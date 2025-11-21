import { useState, useEffect, useRef, useCallback } from 'react'
import type { GameState, Issue, UpgradeType } from '../types/game'
import { 
  STAGE_ORDER, 
  getCyclesPerStage, 
  MAX_CONCURRENT_ISSUES,
  CREDITS_PER_ISSUE,
  UPGRADE_DEFINITIONS,
  DEFAULT_SETTINGS
} from '../types/game'
import { saveGameState, loadGameState, clearGameState } from '../state/persistence'

/**
 * Create initial game state
 */
function createInitialState(): GameState {
  return {
    issues: [],
    nextIssueId: 1,
    currentCycle: 0,
    isAutoCycleEnabled: false,
    totalIssuesProcessed: 0,
    credits: 0,
    upgrades: {
      'faster-development': 0,
      'faster-review': 0
    },
    settings: { ...DEFAULT_SETTINGS }
  }
}

/**
 * Hook to manage all game state with persistence
 */
export function useGameState() {
  // Load initial state from localStorage or create new
  const [gameState, setGameState] = useState<GameState>(() => {
    const loaded = loadGameState()
    return loaded || createInitialState()
  })

  // Ref for auto-cycle interval
  const autoCycleIntervalRef = useRef<number | null>(null)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveGameState(gameState)
  }, [gameState])

  /**
   * Spawn a new issue into the pipeline
   */
  const spawnIssue = useCallback(() => {
    setGameState(prev => {
      // Enforce maximum concurrent issues limit
      if (prev.issues.length >= MAX_CONCURRENT_ISSUES) {
        return prev
      }

      const newIssue: Issue = {
        id: prev.nextIssueId,
        stage: 'scheduled',
        spawnedAt: Date.now(),
        cyclesInStage: 0,
      }

      return {
        ...prev,
        issues: [...prev.issues, newIssue],
        nextIssueId: prev.nextIssueId + 1,
      }
    })
  }, [])

  /**
   * Advance the game by one cycle
   * - Increment cycle counters for all issues
   * - Move issues to next stage if they've spent enough cycles
   * - Remove merged issues after they've been visible
   * - Award credits for completed issues
   */
  const advanceCycle = useCallback(() => {
    setGameState(prev => {
      const cyclesPerStage = getCyclesPerStage(prev.upgrades)
      let mergedCount = 0
      
      const updatedIssues = prev.issues
        .map(issue => {
          const newCyclesInStage = issue.cyclesInStage + 1
          const requiredCycles = cyclesPerStage[issue.stage]

          // Check if issue should advance to next stage
          if (newCyclesInStage >= requiredCycles && issue.stage !== 'merged') {
            const currentStageIndex = STAGE_ORDER.indexOf(issue.stage)
            const nextStage = STAGE_ORDER[currentStageIndex + 1]

            return {
              ...issue,
              stage: nextStage,
              cyclesInStage: 0,
            }
          }

          return {
            ...issue,
            cyclesInStage: newCyclesInStage,
          }
        })
        .filter(issue => {
          // Remove merged issues after they've been visible for required cycles
          if (issue.stage === 'merged' && issue.cyclesInStage >= cyclesPerStage['merged']) {
            mergedCount++
            return false
          }
          return true
        })

      return {
        ...prev,
        issues: updatedIssues,
        currentCycle: prev.currentCycle + 1,
        totalIssuesProcessed: prev.totalIssuesProcessed + mergedCount,
        credits: prev.credits + (mergedCount * CREDITS_PER_ISSUE)
      }
    })
  }, [])

  /**
   * Toggle auto-cycle mode
   */
  const toggleAutoCycle = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isAutoCycleEnabled: !prev.isAutoCycleEnabled,
    }))
  }, [])

  /**
   * Purchase an upgrade
   */
  const purchaseUpgrade = useCallback((upgradeType: UpgradeType) => {
    setGameState(prev => {
      const currentLevel = prev.upgrades[upgradeType]
      const upgradeDef = UPGRADE_DEFINITIONS[upgradeType]
      
      // Check if already at max level
      if (currentLevel >= upgradeDef.maxLevel) {
        return prev
      }

      // Check if player has enough credits
      if (prev.credits < upgradeDef.cost) {
        return prev
      }

      return {
        ...prev,
        credits: prev.credits - upgradeDef.cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeType]: currentLevel + 1
        }
      }
    })
  }, [])

  /**
   * Update game settings
   */
  const updateSettings = useCallback((settings: Partial<GameState['settings']>) => {
    setGameState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings
      }
    }))
  }, [])

  /**
   * Reset game to initial state
   */
  const resetGame = useCallback(() => {
    clearGameState()
    setGameState(createInitialState())
  }, [])

  /**
   * Setup/cleanup auto-cycle interval
   */
  useEffect(() => {
    if (gameState.isAutoCycleEnabled) {
      autoCycleIntervalRef.current = window.setInterval(() => {
        advanceCycle()
      }, gameState.settings.autoCycleSpeed)
    } else {
      if (autoCycleIntervalRef.current !== null) {
        clearInterval(autoCycleIntervalRef.current)
        autoCycleIntervalRef.current = null
      }
    }

    return () => {
      if (autoCycleIntervalRef.current !== null) {
        clearInterval(autoCycleIntervalRef.current)
      }
    }
  }, [gameState.isAutoCycleEnabled, gameState.settings.autoCycleSpeed, advanceCycle])

  return {
    gameState,
    spawnIssue,
    advanceCycle,
    toggleAutoCycle,
    purchaseUpgrade,
    updateSettings,
    resetGame
  }
}

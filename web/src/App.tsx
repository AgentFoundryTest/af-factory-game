import { useState, useEffect, useRef, useCallback } from 'react'
import { PipelineBoard } from './components/Pipeline'
import type { GameState, Issue } from './types/game'
import { STAGE_ORDER, CYCLES_PER_STAGE, MAX_CONCURRENT_ISSUES } from './types/game'

function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    issues: [],
    nextIssueId: 1,
    currentCycle: 0,
    isAutoCycleEnabled: false,
    totalIssuesProcessed: 0,
  })

  // Ref for auto-cycle interval
  const autoCycleIntervalRef = useRef<number | null>(null)

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
   * - Remove merged issues
   */
  const advanceCycle = useCallback(() => {
    setGameState(prev => {
      let mergedCount = 0
      const updatedIssues = prev.issues
        .map(issue => {
          const newCyclesInStage = issue.cyclesInStage + 1
          const requiredCycles = CYCLES_PER_STAGE[issue.stage]

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
          // Remove merged issues and count them
          if (issue.stage === 'merged') {
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
   * Setup/cleanup auto-cycle interval
   */
  useEffect(() => {
    if (gameState.isAutoCycleEnabled) {
      autoCycleIntervalRef.current = window.setInterval(() => {
        advanceCycle()
      }, 1000) // 1 second per cycle
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
  }, [gameState.isAutoCycleEnabled, advanceCycle])

  // Calculate throughput (issues processed per cycle)
  const throughput = gameState.currentCycle > 0 
    ? (gameState.totalIssuesProcessed / gameState.currentCycle).toFixed(2)
    : '0.00'

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HUD Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">Factory Game</h1>
          <div className="flex gap-4">
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Cycle:</span> <span className="text-green-400 font-mono">{gameState.currentCycle}</span>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Processed:</span> <span className="text-yellow-400 font-mono">{gameState.totalIssuesProcessed}</span>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Throughput:</span> <span className="text-purple-400 font-mono">{throughput}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="container mx-auto p-4">
        <div className="mb-4 flex gap-4 items-center">
          <button 
            onClick={spawnIssue}
            disabled={gameState.issues.length >= MAX_CONCURRENT_ISSUES}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded font-semibold transition-colors"
          >
            Spawn Issue ({gameState.issues.length}/{MAX_CONCURRENT_ISSUES})
          </button>
          <button 
            onClick={advanceCycle}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition-colors"
          >
            Advance Cycle
          </button>
          <button 
            onClick={toggleAutoCycle}
            className={`${gameState.isAutoCycleEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} px-6 py-2 rounded font-semibold transition-colors`}
          >
            {gameState.isAutoCycleEnabled ? 'Stop Auto-Cycle' : 'Start Auto-Cycle'}
          </button>
        </div>

        <PipelineBoard issues={gameState.issues} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>Factory Game - A client-side automation game built with Vite + React + TypeScript + Tailwind</p>
        </div>
      </footer>
    </div>
  )
}

export default App

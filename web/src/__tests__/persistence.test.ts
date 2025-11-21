import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveGameState, loadGameState, clearGameState } from '../state/persistence'
import type { GameState } from '../types/game'

describe('Persistence utilities', () => {
  const createMockState = (overrides?: Partial<GameState>): GameState => ({
    issues: [],
    nextIssueId: 1,
    currentCycle: 0,
    isAutoCycleEnabled: false,
    totalIssuesProcessed: 0,
    credits: 0,
    upgrades: {
      'faster-development': 0,
      'bonus-credits': 0
    },
    settings: {
      autoCycleSpeed: 1000,
      animationsEnabled: true,
      showTutorial: false
    },
    ...overrides
  })

  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveGameState', () => {
    it('saves game state to localStorage', () => {
      const state = createMockState({ currentCycle: 42, credits: 100 })
      saveGameState(state)
      
      const stored = localStorage.getItem('factory-game-state')
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.version).toBe(2)
      expect(parsed.state.currentCycle).toBe(42)
      expect(parsed.state.credits).toBe(100)
    })

    it('handles complex state with issues', () => {
      const state = createMockState({
        issues: [
          { id: 1, stage: 'scheduled', spawnedAt: Date.now(), cyclesInStage: 0 },
          { id: 2, stage: 'in-development', spawnedAt: Date.now(), cyclesInStage: 1 }
        ],
        nextIssueId: 3,
        currentCycle: 10
      })
      saveGameState(state)
      
      const stored = localStorage.getItem('factory-game-state')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.issues).toHaveLength(2)
      expect(parsed.state.issues[0].id).toBe(1)
      expect(parsed.state.issues[1].id).toBe(2)
    })

    it('overwrites previous saved state', () => {
      const state1 = createMockState({ currentCycle: 10 })
      const state2 = createMockState({ currentCycle: 20 })
      
      saveGameState(state1)
      saveGameState(state2)
      
      const stored = localStorage.getItem('factory-game-state')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.currentCycle).toBe(20)
    })

    it('handles localStorage unavailable gracefully', () => {
      // Mock localStorage.setItem to check if localStorage is unavailable
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
      
      // First call checks availability, subsequent calls for actual save
      setItemSpy.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError')
      })
      
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const state = createMockState()
      // Should not throw
      expect(() => saveGameState(state)).not.toThrow()
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('localStorage not available')
      )
      
      // Restore
      setItemSpy.mockRestore()
      getItemSpy.mockRestore()
      consoleWarnSpy.mockRestore()
    })
  })

  describe('loadGameState', () => {
    it('loads saved game state from localStorage', () => {
      const state = createMockState({ currentCycle: 42, credits: 100 })
      saveGameState(state)
      
      const loaded = loadGameState()
      expect(loaded).toBeTruthy()
      expect(loaded!.currentCycle).toBe(42)
      expect(loaded!.credits).toBe(100)
    })

    it('returns null when no state exists', () => {
      const loaded = loadGameState()
      expect(loaded).toBeNull()
    })

    it('loads complex state with issues correctly', () => {
      const state = createMockState({
        issues: [
          { id: 1, stage: 'scheduled', spawnedAt: Date.now(), cyclesInStage: 0 },
          { id: 2, stage: 'in-review', spawnedAt: Date.now(), cyclesInStage: 2 }
        ],
        nextIssueId: 3,
        totalIssuesProcessed: 5
      })
      saveGameState(state)
      
      const loaded = loadGameState()
      expect(loaded).toBeTruthy()
      expect(loaded!.issues).toHaveLength(2)
      expect(loaded!.totalIssuesProcessed).toBe(5)
    })

    it('handles corrupted data gracefully', () => {
      localStorage.setItem('factory-game-state', 'invalid json')
      
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const loaded = loadGameState()
      expect(loaded).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalled()
      
      consoleErrorSpy.mockRestore()
    })

    it('handles localStorage unavailable gracefully', () => {
      // Mock localStorage.getItem to check if localStorage is unavailable
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem')
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      
      // First call checks availability
      setItemSpy.mockImplementationOnce(() => {
        throw new Error('SecurityError')
      })
      
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const loaded = loadGameState()
      expect(loaded).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('localStorage not available')
      )
      
      // Restore
      getItemSpy.mockRestore()
      setItemSpy.mockRestore()
      consoleWarnSpy.mockRestore()
    })

    it('migrates v1 state to v2', () => {
      // Create a v1 state with 'faster-review' instead of 'bonus-credits'
      const v1State = {
        version: 1,
        state: {
          issues: [],
          nextIssueId: 1,
          currentCycle: 50,
          isAutoCycleEnabled: false,
          totalIssuesProcessed: 10,
          credits: 200,
          upgrades: {
            'faster-development': 1,
            'faster-review': 1  // Old upgrade type
          },
          settings: {
            autoCycleSpeed: 1000,
            animationsEnabled: true,
            showTutorial: false
          }
        }
      }
      
      localStorage.setItem('factory-game-state', JSON.stringify(v1State))
      
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      const loaded = loadGameState()
      
      expect(loaded).toBeTruthy()
      expect(loaded!.currentCycle).toBe(50)
      expect(loaded!.credits).toBe(200)
      expect(loaded!.upgrades['faster-development']).toBe(1)
      expect(loaded!.upgrades['bonus-credits']).toBe(0) // New upgrade initialized
      // console.warn is called with multiple arguments, not a single string
      expect(consoleWarnSpy).toHaveBeenCalled()
      const warnCall = consoleWarnSpy.mock.calls[0].join(' ')
      expect(warnCall).toContain('Schema version mismatch')
      expect(consoleLogSpy).toHaveBeenCalledWith('Migrated state from v1 to v2')
      
      consoleWarnSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })

    it('ensures all upgrade types exist even with valid v2 state', () => {
      // Save a state that's missing the bonus-credits upgrade
      const incompleteState = {
        version: 2,
        state: {
          ...createMockState(),
          upgrades: {
            'faster-development': 1
            // missing 'bonus-credits'
          }
        }
      }
      
      localStorage.setItem('factory-game-state', JSON.stringify(incompleteState))
      
      const loaded = loadGameState()
      expect(loaded).toBeTruthy()
      expect(loaded!.upgrades['faster-development']).toBe(1)
      expect(loaded!.upgrades['bonus-credits']).toBe(0)
    })

    it('handles unknown schema version by returning null', () => {
      const futureState = {
        version: 999,
        state: createMockState()
      }
      
      localStorage.setItem('factory-game-state', JSON.stringify(futureState))
      
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const loaded = loadGameState()
      expect(loaded).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown schema version')
      )
      
      consoleWarnSpy.mockRestore()
    })
  })

  describe('clearGameState', () => {
    it('removes game state from localStorage', () => {
      const state = createMockState({ currentCycle: 42 })
      saveGameState(state)
      
      expect(localStorage.getItem('factory-game-state')).toBeTruthy()
      
      clearGameState()
      
      expect(localStorage.getItem('factory-game-state')).toBeNull()
    })

    it('handles clearing when no state exists', () => {
      expect(() => clearGameState()).not.toThrow()
      expect(localStorage.getItem('factory-game-state')).toBeNull()
    })

    it('handles localStorage unavailable gracefully', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      
      // Mock setItem for availability check to fail
      setItemSpy.mockImplementationOnce(() => {
        throw new Error('SecurityError')
      })
      
      // Should not throw and should return early
      expect(() => clearGameState()).not.toThrow()
      
      // removeItem should not be called since availability check fails
      expect(removeItemSpy).not.toHaveBeenCalled()
      
      removeItemSpy.mockRestore()
      setItemSpy.mockRestore()
    })
  })

  describe('Edge cases', () => {
    it('handles rapid save/load cycles', () => {
      const state1 = createMockState({ currentCycle: 1 })
      const state2 = createMockState({ currentCycle: 2 })
      const state3 = createMockState({ currentCycle: 3 })
      
      saveGameState(state1)
      saveGameState(state2)
      saveGameState(state3)
      
      const loaded = loadGameState()
      expect(loaded!.currentCycle).toBe(3)
    })

    it('persists and loads all settings correctly', () => {
      const state = createMockState({
        settings: {
          autoCycleSpeed: 2500,
          animationsEnabled: false,
          showTutorial: true
        }
      })
      
      saveGameState(state)
      const loaded = loadGameState()
      
      expect(loaded!.settings.autoCycleSpeed).toBe(2500)
      expect(loaded!.settings.animationsEnabled).toBe(false)
      expect(loaded!.settings.showTutorial).toBe(true)
    })

    it('preserves upgrade levels after save/load', () => {
      const state = createMockState({
        upgrades: {
          'faster-development': 1,
          'bonus-credits': 2
        },
        credits: 500
      })
      
      saveGameState(state)
      const loaded = loadGameState()
      
      expect(loaded!.upgrades['faster-development']).toBe(1)
      expect(loaded!.upgrades['bonus-credits']).toBe(2)
      expect(loaded!.credits).toBe(500)
    })
  })

  describe('Reset flow integration', () => {
    it('clears all persisted data on reset', () => {
      // Set up a game with progress
      const state = createMockState({
        currentCycle: 100,
        totalIssuesProcessed: 50,
        credits: 300,
        upgrades: {
          'faster-development': 1,
          'bonus-credits': 1
        }
      })
      
      saveGameState(state)
      expect(localStorage.getItem('factory-game-state')).toBeTruthy()
      
      // Clear the state
      clearGameState()
      
      // Verify it's gone
      expect(localStorage.getItem('factory-game-state')).toBeNull()
      
      // Loading should return null
      const loaded = loadGameState()
      expect(loaded).toBeNull()
    })

    it('allows fresh start after reset', () => {
      // Save initial state
      const oldState = createMockState({ currentCycle: 100, credits: 500 })
      saveGameState(oldState)
      
      // Reset
      clearGameState()
      
      // Start fresh
      const newState = createMockState()
      saveGameState(newState)
      
      const loaded = loadGameState()
      expect(loaded!.currentCycle).toBe(0)
      expect(loaded!.credits).toBe(0)
      expect(loaded!.nextIssueId).toBe(1)
    })
  })
})

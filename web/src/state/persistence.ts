import type { GameState } from '../types/game'

const STORAGE_KEY = 'factory-game-state'
const SCHEMA_VERSION = 1

interface PersistedState {
  version: number
  state: GameState
}

/**
 * Check if localStorage is available (handles private browsing mode)
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Save game state to localStorage
 */
export function saveGameState(state: GameState): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, state will not persist')
    return
  }

  try {
    const persistedState: PersistedState = {
      version: SCHEMA_VERSION,
      state
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState))
  } catch (error) {
    console.error('Failed to save game state:', error)
  }
}

/**
 * Load game state from localStorage with schema migration support
 */
export function loadGameState(): GameState | null {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, starting with fresh state')
    return null
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return null
    }

    const persistedState: PersistedState = JSON.parse(stored)
    
    // Handle schema migrations
    if (persistedState.version !== SCHEMA_VERSION) {
      console.warn('Schema version mismatch, migrating state')
      return migrateState()
    }

    return persistedState.state
  } catch (error) {
    console.error('Failed to load game state:', error)
    return null
  }
}

/**
 * Migrate state from older schema versions
 */
function migrateState(): GameState | null {
  // For now, if version doesn't match, return null to start fresh
  // In future, add specific migration logic here
  console.warn('No migration path available, starting fresh')
  return null
}

/**
 * Clear saved game state
 */
export function clearGameState(): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear game state:', error)
  }
}

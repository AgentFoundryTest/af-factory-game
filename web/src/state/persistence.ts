import type { GameState } from '../types/game'

const STORAGE_KEY = 'factory-game-state'
const SCHEMA_VERSION = 2

interface PersistedState {
  version: number
  state: GameState
}

// Legacy state structure for migration
interface LegacyGameStateV1 extends Omit<GameState, 'upgrades'> {
  upgrades: {
    'faster-development': number
    'faster-review': number
  }
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
      console.warn('Schema version mismatch, migrating state from version', persistedState.version, 'to', SCHEMA_VERSION)
      return migrateState(persistedState)
    }

    // Ensure upgrades object has all current upgrade types
    return ensureUpgradesComplete(persistedState.state)
  } catch (error) {
    console.error('Failed to load game state:', error)
    return null
  }
}

/**
 * Ensure all current upgrade types exist in the upgrades object
 */
function ensureUpgradesComplete(state: GameState): GameState {
  const upgrades = { ...state.upgrades }
  
  // Ensure all current upgrade types exist
  if (upgrades['faster-development'] === undefined) {
    upgrades['faster-development'] = 0
  }
  if (upgrades['bonus-credits'] === undefined) {
    upgrades['bonus-credits'] = 0
  }
  
  return {
    ...state,
    upgrades
  }
}

/**
 * Migrate state from older schema versions
 */
function migrateState(persistedState: PersistedState): GameState | null {
  try {
    if (persistedState.version === 1) {
      // Migrate from v1 to v2: replace faster-review with bonus-credits
      const oldState = persistedState.state as unknown as LegacyGameStateV1
      
      // Validate the old state has the expected structure
      if (!oldState.upgrades || typeof oldState.upgrades['faster-development'] !== 'number') {
        console.warn('Invalid v1 state structure, starting fresh')
        return null
      }
      
      const newState: GameState = {
        ...oldState,
        upgrades: {
          'faster-development': oldState.upgrades['faster-development'] || 0,
          'bonus-credits': 0  // Initialize new bonus-credits upgrade
        }
      }
      console.log('Migrated state from v1 to v2')
      return ensureUpgradesComplete(newState)
    }
    
    // Unknown version, start fresh
    console.warn('Unknown schema version, starting fresh')
    return null
  } catch (error) {
    console.error('Migration failed:', error)
    return null
  }
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

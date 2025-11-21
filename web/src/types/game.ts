/**
 * Pipeline stages representing the software development lifecycle
 */
export type Stage = 'scheduled' | 'in-development' | 'in-review' | 'merged'

/**
 * Display labels for each stage
 */
export const STAGE_LABELS: Readonly<Record<Stage, string>> = {
  'scheduled': 'Scheduled',
  'in-development': 'In Development',
  'in-review': 'In Review',
  'merged': 'Merged'
}

/**
 * Color classes for each stage (Tailwind)
 */
export const STAGE_COLORS: Readonly<Record<Stage, string>> = {
  'scheduled': 'bg-blue-600',
  'in-development': 'bg-yellow-600',
  'in-review': 'bg-purple-600',
  'merged': 'bg-green-600'
}

/**
 * Represents a single issue/work item in the pipeline
 */
export interface Issue {
  id: number
  stage: Stage
  spawnedAt: number // Timestamp when issue was created
  cyclesInStage: number // How many cycles this issue has been in current stage
}

/**
 * Upgrade types that affect gameplay
 */
export type UpgradeType = 'faster-development' | 'faster-review'

/**
 * Upgrade definition
 */
export interface Upgrade {
  id: UpgradeType
  name: string
  description: string
  cost: number
  level: number
  maxLevel: number
  effect: string
}

/**
 * Game settings
 */
export interface GameSettings {
  autoCycleSpeed: number // milliseconds per cycle
  animationsEnabled: boolean
  showTutorial: boolean
}

/**
 * Overall game state
 */
export interface GameState {
  issues: Issue[]
  nextIssueId: number
  currentCycle: number
  isAutoCycleEnabled: boolean
  totalIssuesProcessed: number // Count of issues that reached "merged"
  credits: number
  upgrades: Record<UpgradeType, number> // upgrade level for each type
  settings: GameSettings
}

/**
 * Maximum number of concurrent issues to prevent performance issues
 */
export const MAX_CONCURRENT_ISSUES = 50

/**
 * Number of cycles an issue must spend in each stage before advancing
 */
export const CYCLES_PER_STAGE: Readonly<Record<Stage, number>> = {
  'scheduled': 1,
  'in-development': 2,
  'in-review': 1,
  'merged': 1 // Issues stay visible in merged stage for 1 cycle before removal
}

/**
 * Stage progression order
 */
export const STAGE_ORDER: readonly Stage[] = ['scheduled', 'in-development', 'in-review', 'merged']

/**
 * Credits earned per completed issue
 */
export const CREDITS_PER_ISSUE = 10

/**
 * Upgrade definitions
 */
export const UPGRADE_DEFINITIONS: Readonly<Record<UpgradeType, Omit<Upgrade, 'level'>>> = {
  'faster-development': {
    id: 'faster-development',
    name: 'Faster Development',
    description: 'Reduce development time by 1 cycle per level',
    cost: 50,
    maxLevel: 1,
    effect: 'Dev cycles: 2 → 1'
  },
  'faster-review': {
    id: 'faster-review',
    name: 'Faster Review',
    description: 'Reduce review time (currently at minimum)',
    cost: 30,
    maxLevel: 0, // Already at 1 cycle minimum
    effect: 'Review cycles: 1 (minimum)'
  }
}

/**
 * Default game settings
 */
export const DEFAULT_SETTINGS: GameSettings = {
  autoCycleSpeed: 1000,
  animationsEnabled: true,
  showTutorial: false  // Don't show tutorial by default to avoid test conflicts
}

/**
 * Calculate cycles per stage with upgrades applied
 */
export function getCyclesPerStage(upgrades: Record<UpgradeType, number>): Record<Stage, number> {
  const base = { ...CYCLES_PER_STAGE }
  
  // Apply faster-development upgrade
  if (upgrades['faster-development'] > 0) {
    base['in-development'] = Math.max(1, base['in-development'] - upgrades['faster-development'])
  }
  
  // faster-review would reduce review time, but it's already at minimum (1 cycle)
  
  return base
}

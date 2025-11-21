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
 * Overall game state
 */
export interface GameState {
  issues: Issue[]
  nextIssueId: number
  currentCycle: number
  isAutoCycleEnabled: boolean
  totalIssuesProcessed: number // Count of issues that reached "merged"
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
  'merged': 0 // Issues are removed immediately after reaching merged
}

/**
 * Stage progression order
 */
export const STAGE_ORDER: readonly Stage[] = ['scheduled', 'in-development', 'in-review', 'merged']

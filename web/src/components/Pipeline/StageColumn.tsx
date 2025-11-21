import type { Stage, Issue } from '../../types/game'
import { STAGE_LABELS, STAGE_COLORS } from '../../types/game'
import { IssueToken } from './IssueToken'

interface StageColumnProps {
  stage: Stage
  issues: Issue[]
}

/**
 * StageColumn - Represents a single stage in the pipeline
 * Displays all issues currently in this stage
 */
export function StageColumn({ stage, issues }: StageColumnProps) {
  const issuesInStage = issues.filter(issue => issue.stage === stage)
  const stageColor = STAGE_COLORS[stage]

  return (
    <div className="flex-1 min-w-0">
      <div className={`${stageColor} text-white px-4 py-3 rounded-t-lg font-semibold text-center`}>
        {STAGE_LABELS[stage]}
        <span className="ml-2 text-sm opacity-80">({issuesInStage.length})</span>
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-b-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {issuesInStage.length === 0 ? (
          <div className="text-gray-500 text-center text-sm mt-8">No issues</div>
        ) : (
          issuesInStage.map(issue => (
            <IssueToken key={issue.id} issue={issue} />
          ))
        )}
      </div>
    </div>
  )
}

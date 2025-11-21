import type { Issue } from '../../types/game'

interface IssueTokenProps {
  issue: Issue
}

/**
 * IssueToken - Represents a single issue/work item in the pipeline
 * Displays issue ID and time spent in current stage
 */
export function IssueToken({ issue }: IssueTokenProps) {
  return (
    <div className="bg-gray-700 border border-gray-600 rounded p-3 mb-2 hover:bg-gray-600 transition-all hover:scale-105">
      <div className="flex justify-between items-center">
        <span className="font-mono text-sm text-blue-300">#{issue.id}</span>
        <span className="text-xs text-gray-400">
          {issue.cyclesInStage} cycle{issue.cyclesInStage !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  )
}

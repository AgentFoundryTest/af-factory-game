import type { Issue } from '../../types/game'
import { STAGE_ORDER } from '../../types/game'
import { StageColumn } from './StageColumn'

interface PipelineBoardProps {
  issues: Issue[]
}

/**
 * PipelineBoard - Main pipeline visualization
 * Displays all four stages of the development pipeline
 */
export function PipelineBoard({ issues }: PipelineBoardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">Development Pipeline</h2>
      <div className="flex gap-4">
        {STAGE_ORDER.map(stage => (
          <StageColumn key={stage} stage={stage} issues={issues} />
        ))}
      </div>
    </div>
  )
}

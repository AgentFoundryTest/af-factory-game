import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StageColumn } from './StageColumn'
import type { Issue } from '../../types/game'

describe('StageColumn', () => {
  it('renders stage label', () => {
    render(<StageColumn stage="scheduled" issues={[]} />)
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
  })

  it('displays zero count when no issues', () => {
    render(<StageColumn stage="in-development" issues={[]} />)
    expect(screen.getByText('(0)')).toBeInTheDocument()
    expect(screen.getByText('No issues')).toBeInTheDocument()
  })

  it('displays correct count of issues in stage', () => {
    const issues: Issue[] = [
      { id: 1, stage: 'scheduled', spawnedAt: Date.now(), cyclesInStage: 0 },
      { id: 2, stage: 'scheduled', spawnedAt: Date.now(), cyclesInStage: 1 },
      { id: 3, stage: 'in-development', spawnedAt: Date.now(), cyclesInStage: 0 },
    ]
    render(<StageColumn stage="scheduled" issues={issues} />)
    expect(screen.getByText('(2)')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.queryByText('#3')).not.toBeInTheDocument()
  })

  it('only shows issues for its stage', () => {
    const issues: Issue[] = [
      { id: 1, stage: 'scheduled', spawnedAt: Date.now(), cyclesInStage: 0 },
      { id: 2, stage: 'in-development', spawnedAt: Date.now(), cyclesInStage: 0 },
      { id: 3, stage: 'in-review', spawnedAt: Date.now(), cyclesInStage: 0 },
    ]
    render(<StageColumn stage="in-review" issues={issues} />)
    expect(screen.getByText('(1)')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
    expect(screen.queryByText('#1')).not.toBeInTheDocument()
    expect(screen.queryByText('#2')).not.toBeInTheDocument()
  })

  it('applies correct color for each stage', () => {
    const { container: scheduledContainer } = render(<StageColumn stage="scheduled" issues={[]} />)
    expect(scheduledContainer.querySelector('.bg-blue-600')).toBeInTheDocument()

    const { container: devContainer } = render(<StageColumn stage="in-development" issues={[]} />)
    expect(devContainer.querySelector('.bg-yellow-600')).toBeInTheDocument()

    const { container: reviewContainer } = render(<StageColumn stage="in-review" issues={[]} />)
    expect(reviewContainer.querySelector('.bg-purple-600')).toBeInTheDocument()

    const { container: mergedContainer } = render(<StageColumn stage="merged" issues={[]} />)
    expect(mergedContainer.querySelector('.bg-green-600')).toBeInTheDocument()
  })
})

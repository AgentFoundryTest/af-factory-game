import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PipelineBoard } from './PipelineBoard'
import type { Issue } from '../../types/game'

describe('PipelineBoard', () => {
  it('renders all four stage columns', () => {
    render(<PipelineBoard issues={[]} />)
    expect(screen.getByText('Development Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.getByText('In Development')).toBeInTheDocument()
    expect(screen.getByText('In Review')).toBeInTheDocument()
    expect(screen.getByText('Merged')).toBeInTheDocument()
  })

  it('displays empty state when no issues', () => {
    render(<PipelineBoard issues={[]} />)
    const noIssuesTexts = screen.getAllByText('No issues')
    expect(noIssuesTexts).toHaveLength(4)
  })

  it('distributes issues to correct stages', () => {
    const issues: Issue[] = [
      { id: 1, stage: 'scheduled', spawnedAt: Date.now(), cyclesInStage: 0 },
      { id: 2, stage: 'scheduled', spawnedAt: Date.now(), cyclesInStage: 1 },
      { id: 3, stage: 'in-development', spawnedAt: Date.now(), cyclesInStage: 0 },
      { id: 4, stage: 'in-review', spawnedAt: Date.now(), cyclesInStage: 2 },
      { id: 5, stage: 'merged', spawnedAt: Date.now(), cyclesInStage: 0 },
    ]
    render(<PipelineBoard issues={issues} />)
    
    // Check all issues are rendered
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('#2')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
    expect(screen.getByText('#4')).toBeInTheDocument()
    expect(screen.getByText('#5')).toBeInTheDocument()
    
    // Check stage counts - using getAllByText since count appears in parentheses
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.getByText('(2)')).toBeInTheDocument()
    expect(screen.getByText('In Development')).toBeInTheDocument()
    expect(screen.getAllByText('(1)')).toHaveLength(3) // Three stages have 1 issue each
  })
})

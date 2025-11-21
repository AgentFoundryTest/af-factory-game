import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IssueToken } from './IssueToken'
import type { Issue } from '../../types/game'

describe('IssueToken', () => {
  it('renders issue ID', () => {
    const issue: Issue = {
      id: 42,
      stage: 'scheduled',
      spawnedAt: Date.now(),
      cyclesInStage: 0,
    }
    render(<IssueToken issue={issue} />)
    expect(screen.getByText('#42')).toBeInTheDocument()
  })

  it('displays cycle count with singular form', () => {
    const issue: Issue = {
      id: 1,
      stage: 'in-development',
      spawnedAt: Date.now(),
      cyclesInStage: 1,
    }
    render(<IssueToken issue={issue} />)
    expect(screen.getByText('1 cycle')).toBeInTheDocument()
  })

  it('displays cycle count with plural form', () => {
    const issue: Issue = {
      id: 2,
      stage: 'in-review',
      spawnedAt: Date.now(),
      cyclesInStage: 3,
    }
    render(<IssueToken issue={issue} />)
    expect(screen.getByText('3 cycles')).toBeInTheDocument()
  })

  it('displays zero cycles', () => {
    const issue: Issue = {
      id: 3,
      stage: 'scheduled',
      spawnedAt: Date.now(),
      cyclesInStage: 0,
    }
    render(<IssueToken issue={issue} />)
    expect(screen.getByText('0 cycles')).toBeInTheDocument()
  })
})

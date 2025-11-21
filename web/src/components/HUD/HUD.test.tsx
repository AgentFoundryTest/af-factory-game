import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HUD } from './HUD'
import type { GameState } from '../../types/game'

describe('HUD', () => {
  const createMockState = (overrides?: Partial<GameState>): GameState => ({
    issues: [],
    nextIssueId: 1,
    currentCycle: 0,
    isAutoCycleEnabled: false,
    totalIssuesProcessed: 0,
    credits: 0,
    upgrades: {
      'faster-development': 0,
      'faster-review': 0
    },
    settings: {
      autoCycleSpeed: 1000,
      animationsEnabled: true,
      showTutorial: false
    },
    ...overrides
  })

  it('displays cycle count', () => {
    const state = createMockState({ currentCycle: 42 })
    render(<HUD gameState={state} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('displays processed issues count', () => {
    const state = createMockState({ totalIssuesProcessed: 15 })
    render(<HUD gameState={state} />)
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('displays credits balance', () => {
    const state = createMockState({ credits: 250 })
    render(<HUD gameState={state} />)
    expect(screen.getByText('250')).toBeInTheDocument()
  })

  it('calculates and displays throughput correctly', () => {
    const state = createMockState({ 
      currentCycle: 10, 
      totalIssuesProcessed: 4 
    })
    render(<HUD gameState={state} />)
    // 4 / 10 = 0.40
    expect(screen.getByText('0.40')).toBeInTheDocument()
  })

  it('displays 0.00 throughput when no cycles have passed', () => {
    const state = createMockState({ 
      currentCycle: 0, 
      totalIssuesProcessed: 0 
    })
    render(<HUD gameState={state} />)
    expect(screen.getByText('0.00')).toBeInTheDocument()
  })

  it('shows active upgrade effects when upgrades are purchased', () => {
    const state = createMockState({ 
      upgrades: {
        'faster-development': 1,
        'faster-review': 0
      }
    })
    render(<HUD gameState={state} />)
    expect(screen.getByText(/Dev Time: 1 cycle/)).toBeInTheDocument()
  })

  it('does not show upgrade effects when no upgrades are active', () => {
    const state = createMockState()
    render(<HUD gameState={state} />)
    expect(screen.queryByText(/Active Upgrades:/)).not.toBeInTheDocument()
  })
})

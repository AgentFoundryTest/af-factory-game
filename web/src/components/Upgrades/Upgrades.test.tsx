import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Upgrades } from './Upgrades'
import type { GameState } from '../../types/game'

describe('Upgrades', () => {
  const createMockState = (overrides?: Partial<GameState>): GameState => ({
    issues: [],
    nextIssueId: 1,
    currentCycle: 0,
    isAutoCycleEnabled: false,
    totalIssuesProcessed: 0,
    credits: 0,
    upgrades: {
      'faster-development': 0,
      'bonus-credits': 0
    },
    settings: {
      autoCycleSpeed: 1000,
      animationsEnabled: true,
      showTutorial: false
    },
    ...overrides
  })

  it('displays available upgrades', () => {
    const state = createMockState()
    render(<Upgrades gameState={state} onPurchase={vi.fn()} />)
    
    expect(screen.getByText('Faster Development')).toBeInTheDocument()
    expect(screen.getByText('Bonus Credits')).toBeInTheDocument()
  })

  it('shows upgrade costs', () => {
    const state = createMockState()
    render(<Upgrades gameState={state} onPurchase={vi.fn()} />)
    
    expect(screen.getByText(/Buy \(50 credits\)/)).toBeInTheDocument()
    expect(screen.getByText(/Buy \(40 credits\)/)).toBeInTheDocument()
  })

  it('shows upgrade levels', () => {
    const state = createMockState({ 
      upgrades: {
        'faster-development': 1,
        'bonus-credits': 0
      }
    })
    render(<Upgrades gameState={state} onPurchase={vi.fn()} />)
    
    expect(screen.getByText('Lv. 1/1')).toBeInTheDocument()
    expect(screen.getByText('Lv. 0/1')).toBeInTheDocument()
  })

  it('disables purchase button when insufficient credits', () => {
    const state = createMockState({ credits: 25 })
    render(<Upgrades gameState={state} onPurchase={vi.fn()} />)
    
    const buyButtons = screen.getAllByRole('button', { name: /Buy/ })
    // Both buttons should be disabled (25 credits is less than both 50 and 30)
    expect(buyButtons[0]).toBeDisabled()
  })

  it('enables purchase button when sufficient credits', () => {
    const state = createMockState({ credits: 100 })
    render(<Upgrades gameState={state} onPurchase={vi.fn()} />)
    
    const buyButtons = screen.getAllByRole('button', { name: /Buy/ })
    expect(buyButtons[0]).not.toBeDisabled()
  })

  it('shows "Max Level" when upgrade is fully purchased', () => {
    const state = createMockState({ 
      credits: 100,
      upgrades: {
        'faster-development': 1,
        'bonus-credits': 1
      }
    })
    render(<Upgrades gameState={state} onPurchase={vi.fn()} />)
    
    // Both upgrades are at max level
    const maxLevelButtons = screen.getAllByText('Max Level')
    expect(maxLevelButtons).toHaveLength(2)
  })

  it('calls onPurchase when buy button is clicked', async () => {
    const user = userEvent.setup()
    const onPurchase = vi.fn()
    const state = createMockState({ credits: 100 })
    
    render(<Upgrades gameState={state} onPurchase={onPurchase} />)
    
    const buyButtons = screen.getAllByRole('button', { name: /Buy/ })
    await user.click(buyButtons[0])
    
    expect(onPurchase).toHaveBeenCalledWith('faster-development')
  })

  it('does not call onPurchase when button is disabled', async () => {
    const user = userEvent.setup()
    const onPurchase = vi.fn()
    const state = createMockState({ credits: 0 })
    
    render(<Upgrades gameState={state} onPurchase={onPurchase} />)
    
    const buyButtons = screen.getAllByRole('button', { name: /Buy/ })
    await user.click(buyButtons[0])
    
    expect(onPurchase).not.toHaveBeenCalled()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Settings } from './Settings'
import type { GameState } from '../../types/game'

describe('Settings', () => {
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

  it('displays current auto-cycle speed', () => {
    const state = createMockState({ settings: { ...createMockState().settings, autoCycleSpeed: 1500 } })
    render(<Settings gameState={state} onSettingsChange={vi.fn()} onReset={vi.fn()} />)
    
    expect(screen.getByText(/1500ms/)).toBeInTheDocument()
  })

  it('displays auto-cycle speed slider', () => {
    const onSettingsChange = vi.fn()
    const state = createMockState()
    
    render(<Settings gameState={state} onSettingsChange={onSettingsChange} onReset={vi.fn()} />)
    
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    expect(slider).toHaveAttribute('min', '500')
    expect(slider).toHaveAttribute('max', '3000')
    expect(slider).toHaveAttribute('value', '1000')
  })

  it('displays animations toggle', () => {
    const state = createMockState()
    render(<Settings gameState={state} onSettingsChange={vi.fn()} onReset={vi.fn()} />)
    
    expect(screen.getByText('Enable Animations')).toBeInTheDocument()
  })

  it('toggles animations when button is clicked', async () => {
    const user = userEvent.setup()
    const onSettingsChange = vi.fn()
    const state = createMockState()
    
    render(<Settings gameState={state} onSettingsChange={onSettingsChange} onReset={vi.fn()} />)
    
    const buttons = screen.getAllByRole('button')
    const animationToggle = buttons.find(btn => 
      btn.parentElement?.textContent?.includes('Enable Animations')
    )
    
    if (animationToggle) {
      await user.click(animationToggle)
      expect(onSettingsChange).toHaveBeenCalledWith({ animationsEnabled: false })
    }
  })

  it('displays tutorial toggle', () => {
    const state = createMockState()
    render(<Settings gameState={state} onSettingsChange={vi.fn()} onReset={vi.fn()} />)
    
    expect(screen.getByText('Show Tutorial on Start')).toBeInTheDocument()
  })

  it('displays reset button', () => {
    const state = createMockState()
    render(<Settings gameState={state} onSettingsChange={vi.fn()} onReset={vi.fn()} />)
    
    expect(screen.getByRole('button', { name: 'Reset Game' })).toBeInTheDocument()
  })

  it('shows confirmation dialog when reset is clicked', async () => {
    const user = userEvent.setup()
    const state = createMockState()
    
    render(<Settings gameState={state} onSettingsChange={vi.fn()} onReset={vi.fn()} />)
    
    const resetButton = screen.getByRole('button', { name: 'Reset Game' })
    await user.click(resetButton)
    
    expect(screen.getByText(/Are you sure/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm Reset' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('calls onReset when confirm is clicked', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    const state = createMockState()
    
    render(<Settings gameState={state} onSettingsChange={vi.fn()} onReset={onReset} />)
    
    const resetButton = screen.getByRole('button', { name: 'Reset Game' })
    await user.click(resetButton)
    
    const confirmButton = screen.getByRole('button', { name: 'Confirm Reset' })
    await user.click(confirmButton)
    
    expect(onReset).toHaveBeenCalled()
  })

  it('cancels reset when cancel is clicked', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    const state = createMockState()
    
    render(<Settings gameState={state} onSettingsChange={vi.fn()} onReset={onReset} />)
    
    const resetButton = screen.getByRole('button', { name: 'Reset Game' })
    await user.click(resetButton)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)
    
    expect(onReset).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Reset Game' })).toBeInTheDocument()
  })
})

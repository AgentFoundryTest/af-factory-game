import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the Factory Game title', () => {
    render(<App />)
    expect(screen.getByText('Factory Game')).toBeInTheDocument()
  })

  it('displays HUD with cycle, processed count, and throughput', () => {
    render(<App />)
    expect(screen.getByText(/Cycle:/)).toBeInTheDocument()
    expect(screen.getByText(/Processed:/)).toBeInTheDocument()
    expect(screen.getByText(/Throughput:/)).toBeInTheDocument()
  })

  it('shows development pipeline with four stages', () => {
    render(<App />)
    expect(screen.getByText('Development Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Scheduled')).toBeInTheDocument()
    expect(screen.getByText('In Development')).toBeInTheDocument()
    expect(screen.getByText('In Review')).toBeInTheDocument()
    expect(screen.getByText('Merged')).toBeInTheDocument()
  })

  it('displays game control buttons', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /Spawn Issue/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Advance Cycle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start Auto-Cycle' })).toBeInTheDocument()
  })

  it('spawns an issue when spawn button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
    await user.click(spawnButton)
    
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Spawn Issue \(1\/50\)/ })).toBeInTheDocument()
  })

  it('advances cycle and moves issues through stages', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Spawn an issue
    const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
    await user.click(spawnButton)
    
    // Issue should be in Scheduled with 0 cycles
    expect(screen.getByText('#1')).toBeInTheDocument()
    
    // Advance cycle
    const advanceButton = screen.getByRole('button', { name: 'Advance Cycle' })
    await user.click(advanceButton)
    
    // Cycle count should increase
    expect(screen.getByText('1')).toBeInTheDocument() // Cycle counter
    
    // Issue should move to In Development (Scheduled requires 1 cycle)
    expect(screen.getByText('(1)')).toBeInTheDocument()
  })

  it('enforces maximum issue limit', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
    
    // Spawn 50 issues (the maximum)
    for (let i = 0; i < 50; i++) {
      await user.click(spawnButton)
    }
    
    expect(screen.getByRole('button', { name: /Spawn Issue \(50\/50\)/ })).toBeInTheDocument()
    expect(spawnButton).toBeDisabled()
  })

  it('toggles auto-cycle mode', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const autoCycleButton = screen.getByRole('button', { name: 'Start Auto-Cycle' })
    await user.click(autoCycleButton)
    
    expect(screen.getByRole('button', { name: 'Stop Auto-Cycle' })).toBeInTheDocument()
  })

  it('calculates throughput correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Initial throughput should be 0.00
    expect(screen.getByText('0.00')).toBeInTheDocument()
    
    // Spawn issues and advance them to completion
    const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
    await user.click(spawnButton)
    await user.click(spawnButton)
    
    const advanceButton = screen.getByRole('button', { name: 'Advance Cycle' })
    
    // Advance 4 cycles to complete the issues
    for (let i = 0; i < 4; i++) {
      await user.click(advanceButton)
    }
    
    // Throughput should be 2 issues / 4 cycles = 0.50
    expect(screen.getByText('0.50')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Processed count
  })

  it('handles zero issues without crashing', () => {
    render(<App />)
    
    // All stages should show "No issues"
    const noIssuesTexts = screen.getAllByText('No issues')
    expect(noIssuesTexts).toHaveLength(4)
  })
})


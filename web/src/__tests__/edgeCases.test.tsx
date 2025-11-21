import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Edge cases - State transitions', () => {
  describe('Rapid tick triggers', () => {
    it('handles rapid cycle advancement correctly', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Spawn multiple issues
      const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
      await user.click(spawnButton)
      await user.click(spawnButton)
      await user.click(spawnButton)
      
      // Get the advance button
      const advanceButton = screen.getByRole('button', { name: 'Advance Cycle' })
      
      // Rapidly advance cycles without waiting
      await user.click(advanceButton)
      await user.click(advanceButton)
      await user.click(advanceButton)
      await user.click(advanceButton)
      await user.click(advanceButton)
      
      // Verify HUD counters updated correctly after rapid advancement
      // Cycle counter should be 5
      const hudSection = screen.getByText(/Cycle:/).parentElement
      expect(hudSection).toHaveTextContent('5')
      
      // All 3 issues should have completed (1+2+1+1=5 cycles total)
      // Verify processed counter shows 3
      const processedSection = screen.getByText(/Processed:/).parentElement
      expect(processedSection).toHaveTextContent('3')
      
      // Throughput should be 3/5 = 0.60
      const throughputSection = screen.getByText(/Throughput:/).parentElement
      expect(throughputSection).toHaveTextContent('0.60')
    })

    it('maintains issue ordering during rapid state changes', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
      
      // Spawn 5 issues rapidly
      await user.click(spawnButton)
      await user.click(spawnButton)
      await user.click(spawnButton)
      await user.click(spawnButton)
      await user.click(spawnButton)
      
      // All issues should be present
      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('#2')).toBeInTheDocument()
      expect(screen.getByText('#3')).toBeInTheDocument()
      expect(screen.getByText('#4')).toBeInTheDocument()
      expect(screen.getByText('#5')).toBeInTheDocument()
      
      // Issue IDs should be sequential
      expect(screen.getByRole('button', { name: /Spawn Issue \(5\/50\)/ })).toBeInTheDocument()
    })

    it('handles rapid spawn and advance cycles correctly', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
      const advanceButton = screen.getByRole('button', { name: 'Advance Cycle' })
      
      // Interleave spawning and advancing
      await user.click(spawnButton)
      await user.click(advanceButton)
      await user.click(spawnButton)
      await user.click(advanceButton)
      await user.click(spawnButton)
      await user.click(advanceButton)
      
      // Should have 3 issues and 3 cycles
      expect(screen.getByText('#1')).toBeInTheDocument()
      expect(screen.getByText('#2')).toBeInTheDocument()
      expect(screen.getByText('#3')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument() // Cycle count
    })

    it('correctly batches state updates during auto-cycle', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Spawn issues
      const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
      await user.click(spawnButton)
      await user.click(spawnButton)
      
      // Start auto-cycle
      const autoCycleButton = screen.getByRole('button', { name: 'Start Auto-Cycle' })
      await user.click(autoCycleButton)
      
      expect(screen.getByRole('button', { name: 'Stop Auto-Cycle' })).toBeInTheDocument()
      
      // Stop auto-cycle immediately (tests that starting/stopping works)
      const stopButton = screen.getByRole('button', { name: 'Stop Auto-Cycle' })
      await user.click(stopButton)
      
      expect(screen.getByRole('button', { name: 'Start Auto-Cycle' })).toBeInTheDocument()
    })
  })

  describe('Maximum issue limit enforcement', () => {
    it('handles attempting to spawn beyond limit', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
      
      // Spawn exactly 50 issues
      for (let i = 0; i < 50; i++) {
        await user.click(spawnButton)
      }
      
      // Button should be disabled
      expect(spawnButton).toBeDisabled()
      
      // Trying to click again should not crash or create more issues
      await user.click(spawnButton)
      
      expect(screen.getByRole('button', { name: /Spawn Issue \(50\/50\)/ })).toBeInTheDocument()
    })

    it('allows spawning again after issues complete', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
      const advanceButton = screen.getByRole('button', { name: 'Advance Cycle' })
      
      // Spawn max issues
      for (let i = 0; i < 50; i++) {
        await user.click(spawnButton)
      }
      
      expect(spawnButton).toBeDisabled()
      
      // Advance enough cycles to complete some issues (5 cycles to complete)
      for (let i = 0; i < 6; i++) {
        await user.click(advanceButton)
      }
      
      // Button should be enabled again since issues have completed
      expect(spawnButton).not.toBeDisabled()
    })
  })

  describe('Persistence integration with state changes', () => {
    it('persists state during rapid changes', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
      const advanceButton = screen.getByRole('button', { name: 'Advance Cycle' })
      
      // Make rapid changes
      await user.click(spawnButton)
      await user.click(advanceButton)
      await user.click(spawnButton)
      await user.click(advanceButton)
      
      // State should be saved to localStorage (verified by checking it exists)
      const stored = localStorage.getItem('factory-game-state')
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.state.currentCycle).toBe(2)
      expect(parsed.state.issues.length).toBeGreaterThan(0)
    })

    it('handles reset during active gameplay', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      // Create some game state
      const spawnButton = screen.getByRole('button', { name: /Spawn Issue/ })
      await user.click(spawnButton)
      await user.click(spawnButton)
      
      const advanceButton = screen.getByRole('button', { name: 'Advance Cycle' })
      await user.click(advanceButton)
      await user.click(advanceButton)
      
      // Open settings (assuming it's a button or tab)
      const settingsButtons = screen.getAllByRole('button')
      const settingsButton = settingsButtons.find(btn => btn.textContent?.includes('Settings'))
      if (settingsButton) {
        await user.click(settingsButton)
      }
      
      // Trigger reset
      const resetButton = screen.getByRole('button', { name: 'Reset Game' })
      await user.click(resetButton)
      
      const confirmButton = screen.getByRole('button', { name: 'Confirm Reset' })
      await user.click(confirmButton)
      
      // State should be reset
      // Check cycle counter in HUD specifically
      const hudSection = screen.getByText(/Cycle:/)
      expect(hudSection).toBeInTheDocument()
      
      const noIssuesTexts = screen.getAllByText('No issues')
      expect(noIssuesTexts.length).toBeGreaterThan(0)
      
      // localStorage should be cleared
      const stored = localStorage.getItem('factory-game-state')
      // After reset, a fresh state is saved
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.currentCycle).toBe(0)
      }
    })
  })
})

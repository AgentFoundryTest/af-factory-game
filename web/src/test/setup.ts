import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Clear localStorage before each test to ensure clean state
beforeEach(() => {
  localStorage.clear()
})


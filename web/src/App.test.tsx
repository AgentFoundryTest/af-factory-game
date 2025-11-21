import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the Factory Game title', () => {
    render(<App />)
    expect(screen.getByText('Factory Game')).toBeInTheDocument()
  })

  it('displays HUD with resources and production', () => {
    render(<App />)
    expect(screen.getByText(/Resources:/)).toBeInTheDocument()
    expect(screen.getByText(/Production\/s:/)).toBeInTheDocument()
  })

  it('shows production pipeline area', () => {
    render(<App />)
    expect(screen.getByText('Production Pipeline')).toBeInTheDocument()
  })

  it('displays available machines', () => {
    render(<App />)
    expect(screen.getByText('Available Machines')).toBeInTheDocument()
    expect(screen.getByText('Collector')).toBeInTheDocument()
    expect(screen.getByText('Processor')).toBeInTheDocument()
    expect(screen.getByText('Assembler')).toBeInTheDocument()
  })
})

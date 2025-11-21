import { useState } from 'react'
import type { GameState } from '../../types/game'

interface SettingsProps {
  gameState: GameState
  onSettingsChange: (settings: Partial<GameState['settings']>) => void
  onReset: () => void
}

export function Settings({ gameState, onSettingsChange, onReset }: SettingsProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  const handleReset = () => {
    onReset()
    setShowConfirmReset(false)
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Settings</h2>
      
      <div className="space-y-4">
        {/* Auto-cycle speed */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Auto-Cycle Speed: {gameState.settings.autoCycleSpeed}ms
          </label>
          <input
            type="range"
            min="500"
            max="3000"
            step="100"
            value={gameState.settings.autoCycleSpeed}
            onChange={(e) => onSettingsChange({ autoCycleSpeed: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Faster (500ms)</span>
            <span>Slower (3000ms)</span>
          </div>
        </div>

        {/* Animations toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Enable Animations
          </label>
          <button
            onClick={() => onSettingsChange({ animationsEnabled: !gameState.settings.animationsEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              gameState.settings.animationsEnabled ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                gameState.settings.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Tutorial toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Show Tutorial on Start
          </label>
          <button
            onClick={() => onSettingsChange({ showTutorial: !gameState.settings.showTutorial })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              gameState.settings.showTutorial ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                gameState.settings.showTutorial ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Reset button */}
        <div className="pt-4 border-t border-gray-700">
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              Reset Game
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-yellow-400 text-center">
                Are you sure? This will delete all progress!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

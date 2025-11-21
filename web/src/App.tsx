import { PipelineBoard } from './components/Pipeline'
import { HUD } from './components/HUD'
import { Upgrades } from './components/Upgrades'
import { Settings, Tutorial } from './components/Settings'
import { useGameState } from './hooks/useGameState'
import { MAX_CONCURRENT_ISSUES } from './types/game'

function App() {
  const {
    gameState,
    spawnIssue,
    advanceCycle,
    toggleAutoCycle,
    purchaseUpgrade,
    updateSettings,
    resetGame
  } = useGameState()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HUD Header */}
      <HUD gameState={gameState} />

      {/* Main Game Area */}
      <main className="container mx-auto p-4">
        <div className="mb-4 flex gap-4 items-center">
          <button 
            onClick={spawnIssue}
            disabled={gameState.issues.length >= MAX_CONCURRENT_ISSUES}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded font-semibold transition-colors"
          >
            Spawn Issue ({gameState.issues.length}/{MAX_CONCURRENT_ISSUES})
          </button>
          <button 
            onClick={advanceCycle}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition-colors"
          >
            Advance Cycle
          </button>
          <button 
            onClick={toggleAutoCycle}
            className={`${gameState.isAutoCycleEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} px-6 py-2 rounded font-semibold transition-colors`}
          >
            {gameState.isAutoCycleEnabled ? 'Stop Auto-Cycle' : 'Start Auto-Cycle'}
          </button>
        </div>

        <PipelineBoard issues={gameState.issues} />

        {/* Upgrades and Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <Upgrades gameState={gameState} onPurchase={purchaseUpgrade} />
          <Settings 
            gameState={gameState} 
            onSettingsChange={updateSettings}
            onReset={resetGame}
          />
        </div>
      </main>

      {/* Tutorial overlay */}
      <Tutorial 
        showOnStart={gameState.settings.showTutorial}
        onClose={() => updateSettings({ showTutorial: false })}
      />

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>Factory Game - A client-side automation game built with Vite + React + TypeScript + Tailwind</p>
        </div>
      </footer>
    </div>
  )
}

export default App

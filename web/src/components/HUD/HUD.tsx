import type { GameState } from '../../types/game'
import { getCyclesPerStage, getCreditsPerIssue } from '../../types/game'

interface HUDProps {
  gameState: GameState
}

export function HUD({ gameState }: HUDProps) {
  // Calculate throughput (issues processed per cycle)
  const throughput = gameState.currentCycle > 0 
    ? (gameState.totalIssuesProcessed / gameState.currentCycle).toFixed(2)
    : '0.00'

  // Get current cycle times with upgrades
  const cyclesPerStage = getCyclesPerStage(gameState.upgrades)
  const devCycles = cyclesPerStage['in-development']
  
  // Get credits per issue with upgrades
  const creditsPerIssue = getCreditsPerIssue(gameState.upgrades)

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold text-blue-400">Factory Game</h1>
          <div className="flex gap-4">
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Cycle:</span> <span className="text-green-400 font-mono">{gameState.currentCycle}</span>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Processed:</span> <span className="text-yellow-400 font-mono">{gameState.totalIssuesProcessed}</span>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Throughput:</span> <span className="text-purple-400 font-mono">{throughput}</span>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Credits:</span> <span className="text-emerald-400 font-mono font-bold">{gameState.credits}</span>
            </div>
          </div>
        </div>
        
        {/* Upgrade effects display */}
        {(gameState.upgrades['faster-development'] > 0 || gameState.upgrades['bonus-credits'] > 0) && (
          <div className="flex gap-2 text-sm">
            <span className="text-gray-400">Active Upgrades:</span>
            {gameState.upgrades['faster-development'] > 0 && (
              <span className="text-blue-300">
                ⚡ Dev Time: {devCycles} cycle{devCycles !== 1 ? 's' : ''}
              </span>
            )}
            {gameState.upgrades['bonus-credits'] > 0 && (
              <span className="text-emerald-300">
                💰 Credits: {creditsPerIssue} per issue
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

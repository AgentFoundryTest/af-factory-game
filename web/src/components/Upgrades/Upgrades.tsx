import type { GameState, UpgradeType } from '../../types/game'
import { UPGRADE_DEFINITIONS } from '../../types/game'

interface UpgradesProps {
  gameState: GameState
  onPurchase: (upgradeType: UpgradeType) => void
}

export function Upgrades({ gameState, onPurchase }: UpgradesProps) {
  const upgrades = Object.keys(UPGRADE_DEFINITIONS) as UpgradeType[]

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Upgrades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgrades.map(upgradeType => {
          const definition = UPGRADE_DEFINITIONS[upgradeType]
          const currentLevel = gameState.upgrades[upgradeType]
          const isMaxLevel = currentLevel >= definition.maxLevel
          const canAfford = gameState.credits >= definition.cost
          const canPurchase = !isMaxLevel && canAfford

          return (
            <div 
              key={upgradeType}
              className="bg-gray-700 rounded p-4 border border-gray-600"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white">{definition.name}</h3>
                <span className="text-sm text-gray-400">
                  Lv. {currentLevel}/{definition.maxLevel}
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {definition.description}
              </p>
              <div className="text-sm text-blue-300 mb-3">
                {definition.effect}
              </div>
              <button
                onClick={() => onPurchase(upgradeType)}
                disabled={!canPurchase}
                className={`w-full px-4 py-2 rounded font-semibold transition-colors ${
                  isMaxLevel
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : canAfford
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                title={
                  isMaxLevel
                    ? 'Maximum level reached'
                    : !canAfford
                    ? `Need ${definition.cost - gameState.credits} more credits`
                    : `Purchase for ${definition.cost} credits`
                }
              >
                {isMaxLevel ? 'Max Level' : `Buy (${definition.cost} credits)`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

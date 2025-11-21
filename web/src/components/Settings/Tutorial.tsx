import { useState } from 'react'

interface TutorialProps {
  showOnStart: boolean
  onClose: () => void
}

export function Tutorial({ showOnStart, onClose }: TutorialProps) {
  const [isOpen, setIsOpen] = useState(showOnStart)

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors font-semibold"
        aria-label="Show help"
      >
        ? Help
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-blue-400">Factory Game - Tutorial</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
              aria-label="Close tutorial"
            >
              ×
            </button>
          </div>

          <div className="space-y-4 text-gray-300">
            <section>
              <h3 className="text-lg font-bold text-white mb-2">🎯 Game Objective</h3>
              <p>
                Process issues through a software development pipeline to earn credits and purchase upgrades
                that improve your efficiency.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">🔄 Pipeline Stages</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Scheduled</strong> (1 cycle) - Issues waiting to be picked up</li>
                <li><strong>In Development</strong> (2 cycles) - Active development work</li>
                <li><strong>In Review</strong> (1 cycle) - Code review and QA</li>
                <li><strong>Merged</strong> (1 cycle) - Completed and visible before removal</li>
              </ul>
              <p className="mt-2 text-sm">
                Each completed issue earns you <strong className="text-emerald-400">10 credits</strong>.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">🎮 Controls</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Spawn Issue</strong> - Create a new work item (max 50 concurrent)</li>
                <li><strong>Advance Cycle</strong> - Manually progress all issues by one cycle</li>
                <li><strong>Auto-Cycle</strong> - Enable automatic progression (default: 1 cycle/second)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">⚡ Upgrades</h3>
              <p>
                Spend credits to purchase upgrades that reduce cycle times:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Faster Development</strong> - Reduce dev time from 2 to 1 cycle</li>
                <li><strong>Faster Review</strong> - Already at minimum (1 cycle)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">📊 Metrics</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Cycle</strong> - Total number of cycles elapsed</li>
                <li><strong>Processed</strong> - Total issues completed</li>
                <li><strong>Throughput</strong> - Efficiency score (Processed / Cycles)</li>
                <li><strong>Credits</strong> - Currency for purchasing upgrades</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-2">💾 Persistence</h3>
              <p>
                Your progress is automatically saved to your browser's local storage.
                Use the Reset button in Settings to start fresh.
              </p>
            </section>
          </div>

          <button
            onClick={handleClose}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded font-semibold transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}

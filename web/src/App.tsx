function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HUD Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">Factory Game</h1>
          <div className="flex gap-4">
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Resources:</span> <span className="text-green-400 font-mono">0</span>
            </div>
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-gray-400">Production/s:</span> <span className="text-yellow-400 font-mono">0.0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pipeline Area */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Production Pipeline</h2>
            <div className="bg-gray-700 rounded p-8 text-center text-gray-400">
              Pipeline placeholder - drag and drop machines here
            </div>
          </div>

          {/* Side Panel */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Available Machines</h2>
            <div className="space-y-2">
              <div className="bg-gray-700 hover:bg-gray-600 p-4 rounded cursor-pointer transition-colors">
                <h3 className="font-semibold text-green-400">Collector</h3>
                <p className="text-sm text-gray-400">Gathers raw resources</p>
              </div>
              <div className="bg-gray-700 hover:bg-gray-600 p-4 rounded cursor-pointer transition-colors">
                <h3 className="font-semibold text-yellow-400">Processor</h3>
                <p className="text-sm text-gray-400">Refines materials</p>
              </div>
              <div className="bg-gray-700 hover:bg-gray-600 p-4 rounded cursor-pointer transition-colors">
                <h3 className="font-semibold text-purple-400">Assembler</h3>
                <p className="text-sm text-gray-400">Creates final products</p>
              </div>
            </div>
          </div>
        </div>
      </main>

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

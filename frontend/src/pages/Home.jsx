import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Shortest Path Spotlight</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Visualize and compare shortest path algorithms in weighted graphs. Explore Dijkstra's,
          Bellman-Ford, and A* algorithms with an interactive graph editor.
        </p>
        <a
          href="/editor"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Launch Editor
        </a>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Editor</h3>
            <p className="text-gray-600">
              Create graphs with drag-and-drop nodes and weighted edges. Add, remove, and modify
              nodes and edges easily.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Visualization</h3>
            <p className="text-gray-600">
              Watch algorithms execute step-by-step with color-coded nodes and edges showing
              visited nodes and relaxation steps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Algorithm Comparison</h3>
            <p className="text-gray-600">
              Compare execution time, path cost, and steps across Dijkstra's, Bellman-Ford, and
              A* algorithms.
            </p>
          </div>
        </div>
      </section>

      {/* Algorithms */}
      <section className="max-w-6xl mx-auto px-4 py-16 bg-white mx-4 rounded-lg my-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Algorithms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Dijkstra's Algorithm</h3>
            <p className="text-gray-600 text-sm mb-4">
              Greedy algorithm that finds the shortest path from a single source to all other
              vertices in a weighted graph with non-negative edge weights.
            </p>
            <p className="text-xs text-gray-500">
              <strong>Time Complexity:</strong> O((V + E) log V)
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-600 mb-3">Bellman-Ford Algorithm</h3>
            <p className="text-gray-600 text-sm mb-4">
              Dynamic programming algorithm that computes shortest paths from a single source to
              all vertices. Works with negative edge weights and detects negative cycles.
            </p>
            <p className="text-xs text-gray-500">
              <strong>Time Complexity:</strong> O(V * E)
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-3">A* Algorithm</h3>
            <p className="text-gray-600 text-sm mb-4">
              Best-first search algorithm that uses heuristics to find the shortest path more
              efficiently. Perfect for pathfinding in games and navigation.
            </p>
            <p className="text-xs text-gray-500">
              <strong>Time Complexity:</strong> O((V + E) log V) with good heuristic
            </p>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How to Use</h2>
        <div className="bg-blue-50 p-8 rounded-lg">
          <ol className="space-y-4 text-gray-700">
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">1.</span>
              <span>
                <strong>Create Nodes:</strong> Click on the canvas to add nodes. Nodes will be
                automatically labeled.
              </span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">2.</span>
              <span>
                <strong>Connect Edges:</strong> Click on a node, then click on another node to
                create an edge. Set the edge weight.
              </span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">3.</span>
              <span>
                <strong>Select Algorithm:</strong> Choose from Dijkstra's, Bellman-Ford, or A*
                in the control panel.
              </span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">4.</span>
              <span>
                <strong>Run Visualization:</strong> Select start and end nodes, then click "Run
                Algorithm" to see it in action.
              </span>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-4">5.</span>
              <span>
                <strong>Compare Algorithms:</strong> Click "Compare All" to see performance
                metrics side-by-side.
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8 mt-20">
        <p className="text-sm">
          © 2025 Shortest Path Spotlight. Built with React, Node.js, and MongoDB.
        </p>
      </footer>
    </div>
  );
}

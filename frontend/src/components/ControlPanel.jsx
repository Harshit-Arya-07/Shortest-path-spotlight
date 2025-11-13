import React, { useState } from 'react';
import { useGraphStore, useUIStore } from '../store/index';

export default function ControlPanel() {
  // keep as string so negative values and zero are preserved while editing
  const [newWeight, setNewWeight] = useState('1');
  const [startNodeId, setStartNodeId] = useState('');
  const [endNodeId, setEndNodeId] = useState('');

  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const selectedNode = useGraphStore((state) => state.selectedNode);
  const selectedEdge = useGraphStore((state) => state.selectedEdge);
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const setCurrentAlgorithm = useGraphStore((state) => state.setCurrentAlgorithm);
  const updateEdge = useGraphStore((state) => state.updateEdge);
  const removeEdge = useGraphStore((state) => state.removeEdge);
  const removeNode = useGraphStore((state) => state.removeNode);
  const clearGraph = useGraphStore((state) => state.clearGraph);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const setSelectedEdge = useGraphStore((state) => state.setSelectedEdge);

  const animationSpeed = useUIStore((state) => state.animationSpeed);
  const setAnimationSpeed = useUIStore((state) => state.setAnimationSpeed);
  const connectMode = useUIStore((state) => state.connectMode);
  const setConnectMode = useUIStore((state) => state.setConnectMode);

  const handleDeleteNode = () => {
    if (selectedNode) {
      removeNode(selectedNode.id);
      setSelectedNode(null);
    }
  };

  const handleDeleteEdge = () => {
    if (selectedEdge) {
      removeEdge(selectedEdge.id);
      setSelectedEdge(null);
    }
  };

  const handleUpdateEdgeWeight = () => {
    if (selectedEdge) {
      const weight = parseFloat(newWeight);
      if (isNaN(weight)) {
        // simple validation
        return toast.error('Please enter a valid numeric weight');
      }
      updateEdge(selectedEdge.id, { weight });
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-300 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Control Panel</h2>

      {/* Graph Stats */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Graph Stats</h3>
        <p className="text-sm text-gray-600">Nodes: {nodes.length}</p>
        <p className="text-sm text-gray-600">Edges: {edges.length}</p>
      </div>

      {/* Algorithm Selection */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Select Algorithm</h3>
        <div className="space-y-2">
          {['dijkstra', 'bellmanFord', 'aStar'].map((algo) => (
            <button
              key={algo}
              onClick={() => setCurrentAlgorithm(algo)}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentAlgorithm === algo
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {algo === 'dijkstra' ? "Dijkstra's" : algo === 'bellmanFord' ? 'Bellman-Ford' : 'A*'}
            </button>
          ))}
        </div>
      </div>

      {/* Node Selection */}
      {selectedNode && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Selected Node</h3>
          <p className="text-sm text-gray-600 mb-3">
            {selectedNode.label} ({selectedNode.id})
          </p>
          <button
            onClick={handleDeleteNode}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Delete Node
          </button>
        </div>
      )}

      {/* Edge Selection */}
      {selectedEdge && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Selected Edge</h3>
          <p className="text-sm text-gray-600 mb-2">
            {selectedEdge.source} → {selectedEdge.target}
          </p>
          <p className="text-sm text-gray-600 mb-3">Weight: {selectedEdge.weight}</p>
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
            placeholder="New weight (can be negative)"
          />
          <button
            onClick={handleUpdateEdgeWeight}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors mb-2"
          >
            Update Weight
          </button>
          <button
            onClick={handleDeleteEdge}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Delete Edge
          </button>
        </div>
      )}

      {/* Animation Speed */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Animation Speed</h3>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-600 mt-1">{animationSpeed}ms</p>
      </div>

      {/* Clear Graph */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Connect Nodes</h3>
        <p className="text-xs text-gray-500 mb-2">
          Toggle connect mode to click one node then another to create an edge. Or hold Shift and click to draw an edge.
        </p>
        <button
          onClick={() => setConnectMode(!connectMode)}
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium mb-2 ${
            connectMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {connectMode ? 'Connect Mode: ON' : 'Connect Mode: OFF'}
        </button>
      </div>

      <button
        onClick={() => {
          if (confirm('Clear entire graph?')) {
            clearGraph();
          }
        }}
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Clear Graph
      </button>
    </div>
  );
}

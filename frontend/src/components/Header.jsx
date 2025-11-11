import React from 'react';
import { useGraphStore } from '../store/index';

export default function Header() {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const executionTime = useGraphStore((state) => state.executionTime);

  const handleExportGraph = () => {
    const graphData = {
      nodes: nodes,
      edges: edges,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(graphData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `graph-${Date.now()}.json`;
    link.click();
  };

  const handleImportGraph = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          const { loadGraph } = useGraphStore.getState();
          loadGraph(data.nodes, data.edges);
          alert('Graph imported successfully!');
        } catch (error) {
          alert('Error importing graph: ' + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Shortest Path Spotlight</h1>
          <p className="text-sm text-blue-100">Visualize Dijkstra's & Compare Algorithms</p>
        </div>
        <div className="flex items-center space-x-4">
          {executionTime > 0 && (
            <div className="text-right">
              <p className="text-xs text-blue-100">Last Execution</p>
              <p className="text-lg font-bold">{executionTime}ms</p>
            </div>
          )}
          <div className="border-l border-blue-300 pl-4">
            <p className="text-xs text-blue-100">Graph Statistics</p>
            <p className="text-sm font-semibold">
              {nodes.length} nodes • {edges.length} edges
            </p>
          </div>
          <div className="border-l border-blue-300 pl-4 space-x-2">
            <button
              onClick={handleExportGraph}
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Export
            </button>
            <button
              onClick={handleImportGraph}
              className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

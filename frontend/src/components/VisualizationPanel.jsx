import React, { useState } from 'react';
import { useGraphStore } from '../store/index';
import { graphService } from '../services/api';
import { toast } from 'react-toastify';

export default function VisualizationPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);

  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const currentAlgorithm = useGraphStore((state) => state.currentAlgorithm);
  const setVisualizationState = useGraphStore((state) => state.setVisualizationState);
  const setIsRunning = useGraphStore((state) => state.setIsRunning);
  const setExecutionTime = useGraphStore((state) => state.setExecutionTime);

  const [startNodeId, setStartNodeId] = useState('');
  const [endNodeId, setEndNodeId] = useState('');

  const handleRunAlgorithm = async () => {
    if (!startNodeId) {
      toast.error('Please select a start node');
      return;
    }

    if (currentAlgorithm === 'aStar' && !endNodeId) {
      toast.error('A* requires both start and end nodes');
      return;
    }

    setIsLoading(true);
    setIsRunning(true);

    try {
      // For demo, we'll run locally
      if (currentAlgorithm === 'dijkstra') {
        const result = runDijkstraLocal(nodes, edges, startNodeId, endNodeId);
        visualizeResult(result);
      } else if (currentAlgorithm === 'bellmanFord') {
        const result = runBellmanFordLocal(nodes, edges, startNodeId);
        visualizeResult(result);
      } else if (currentAlgorithm === 'aStar') {
        const result = runAStarLocal(nodes, edges, startNodeId, endNodeId);
        visualizeResult(result);
      }

      toast.success(`${currentAlgorithm} algorithm executed!`);
    } catch (error) {
      toast.error('Error running algorithm: ' + error.message);
    } finally {
      setIsLoading(false);
      setIsRunning(false);
    }
  };

  const handleCompareAlgorithms = async () => {
    if (!startNodeId || !endNodeId) {
      toast.error('Please select both start and end nodes for comparison');
      return;
    }

    setIsLoading(true);

    try {
      const dijkstraResult = runDijkstraLocal(nodes, edges, startNodeId, endNodeId);
      const bellmanResult = runBellmanFordLocal(nodes, edges, startNodeId, endNodeId);
      const astarResult = runAStarLocal(nodes, edges, startNodeId, endNodeId);

      setComparison({
        dijkstra: dijkstraResult,
        bellmanFord: bellmanResult,
        aStar: astarResult,
      });

      toast.success('Algorithms compared!');
    } catch (error) {
      toast.error('Error comparing algorithms: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const runDijkstraLocal = (nodes, edges, start, end) => {
    const distances = {};
    const predecessors = {};
    const visited = [];
    let startTime = performance.now();

    nodes.forEach((n) => {
      distances[n.id] = n.id === start ? 0 : Infinity;
      predecessors[n.id] = null;
    });

    const unvisited = new Set(nodes.map((n) => n.id));

    while (unvisited.size > 0) {
      let current = null;
      let minDist = Infinity;

      for (const id of unvisited) {
        if (distances[id] < minDist) {
          minDist = distances[id];
          current = id;
        }
      }

      if (current === null || distances[current] === Infinity) break;

      visited.push(current);
      unvisited.delete(current);

      const edgesFromCurrent = edges.filter((e) => e.source === current);
      edgesFromCurrent.forEach((edge) => {
        if (unvisited.has(edge.target)) {
          const newDist = distances[current] + edge.weight;
          if (newDist < distances[edge.target]) {
            distances[edge.target] = newDist;
            predecessors[edge.target] = current;
          }
        }
      });
    }

    let executionTime = performance.now() - startTime;

    const path = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      if (current === start) break;
      current = predecessors[current];
    }

    return {
      distances,
      predecessors,
      visited,
      path: path[0] === start ? path : [],
      executionTime: executionTime.toFixed(2),
    };
  };

  const runBellmanFordLocal = (nodes, edges, start) => {
    const distances = {};
    const predecessors = {};
    let startTime = performance.now();

    nodes.forEach((n) => {
      distances[n.id] = n.id === start ? 0 : Infinity;
      predecessors[n.id] = null;
    });

    for (let i = 0; i < nodes.length - 1; i++) {
      edges.forEach((edge) => {
        if (distances[edge.source] !== Infinity) {
          const newDist = distances[edge.source] + edge.weight;
          if (newDist < distances[edge.target]) {
            distances[edge.target] = newDist;
            predecessors[edge.target] = edge.source;
          }
        }
      });
    }

    let executionTime = performance.now() - startTime;

    return {
      distances,
      predecessors,
      visited: Object.keys(distances).filter((id) => distances[id] !== Infinity),
      executionTime: executionTime.toFixed(2),
    };
  };

  const runAStarLocal = (nodes, edges, start, end) => {
    const startNode = nodes.find((n) => n.id === start);
    const endNode = nodes.find((n) => n.id === end);
    const gScore = {};
    const fScore = {};
    const predecessors = {};
    const visited = [];
    let startTime = performance.now();

    nodes.forEach((n) => {
      gScore[n.id] = Infinity;
      fScore[n.id] = Infinity;
      predecessors[n.id] = null;
    });

    gScore[start] = 0;
    const heuristic = Math.hypot(endNode.x - startNode.x, endNode.y - startNode.y);
    fScore[start] = heuristic;

    const openSet = new Set([start]);
    const closedSet = new Set();

    while (openSet.size > 0) {
      let current = null;
      let lowestF = Infinity;

      for (const id of openSet) {
        if (fScore[id] < lowestF) {
          lowestF = fScore[id];
          current = id;
        }
      }

      if (current === null) break;

      if (current === end) {
        let executionTime = performance.now() - startTime;
        const path = [];
        let node = end;
        while (node !== null) {
          path.unshift(node);
          if (node === start) break;
          node = predecessors[node];
        }

        return {
          gScore,
          fScore,
          predecessors,
          visited,
          path,
          executionTime: executionTime.toFixed(2),
        };
      }

      openSet.delete(current);
      closedSet.add(current);
      visited.push(current);

      const edgesFromCurrent = edges.filter((e) => e.source === current);
      edgesFromCurrent.forEach((edge) => {
        if (closedSet.has(edge.target)) return;

        const tentativeGScore = gScore[current] + edge.weight;

        if (!openSet.has(edge.target)) {
          openSet.add(edge.target);
        } else if (tentativeGScore >= gScore[edge.target]) {
          return;
        }

        predecessors[edge.target] = current;
        gScore[edge.target] = tentativeGScore;

        const targetNode = nodes.find((n) => n.id === edge.target);
        const h = Math.hypot(endNode.x - targetNode.x, endNode.y - targetNode.y);
        fScore[edge.target] = gScore[edge.target] + h;
      });
    }

    let executionTime = performance.now() - startTime;

    return {
      gScore,
      fScore,
      predecessors,
      visited,
      path: [],
      executionTime: executionTime.toFixed(2),
    };
  };

  const visualizeResult = (result) => {
    // Normalize visited list to only include exact node IDs (algorithms may emit objects for relaxation steps)
    const visitedIds = Array.isArray(result.visited)
      ? result.visited
          .map((v) => {
            if (typeof v === 'string') return v;
            if (v && typeof v === 'object') {
              if (typeof v.to === 'string') return v.to;
              if (typeof v.from === 'string') return v.from;
            }
            return null;
          })
          .filter((id) => id && nodes.find((n) => n.id === id))
      : [];

    // Choose the last valid node id as current node (if any)
    const lastNodeId = visitedIds.length > 0 ? visitedIds[visitedIds.length - 1] : null;

    setVisualizationState({
      distances: result.distances,
      visited: visitedIds,
      currentNode: lastNodeId,
    });
    setExecutionTime(result.executionTime);
    setResult(result);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-300 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Visualization</h2>

      {/* Node Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Node</label>
        <select
          value={startNodeId}
          onChange={(e) => setStartNodeId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Select start node</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.label}
            </option>
          ))}
        </select>
      </div>

      {/* End Node Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">End Node</label>
        <select
          value={endNodeId}
          onChange={(e) => setEndNodeId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Select end node</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.label}
            </option>
          ))}
        </select>
      </div>

      {/* Run Button */}
      <button
        onClick={handleRunAlgorithm}
        disabled={isLoading || nodes.length === 0}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors mb-3"
      >
        {isLoading ? 'Running...' : 'Run Algorithm'}
      </button>

      {/* Compare Button */}
      <button
        onClick={handleCompareAlgorithms}
        disabled={isLoading || nodes.length === 0}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 transition-colors mb-6"
      >
        {isLoading ? 'Comparing...' : 'Compare All'}
      </button>

      {/* Results */}
      {result && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-3">Results</h3>
          <p className="text-xs text-gray-600 mb-2">
            Execution Time: <strong>{result.executionTime}ms</strong>
          </p>
          <p className="text-xs text-gray-600 mb-2">
            Path:{' '}
            <strong>
              {Array.isArray(result.path)
                ? result.path
                    .map((id) => nodes.find((n) => n.id === id)?.label || id)
                    .join(' → ')
                : ''}
            </strong>
          </p>
          {result.distances && (
            <div className="text-xs text-gray-600">
              <strong>Distances:</strong>
              {Object.entries(result.distances).map(([nodeId, distance]) => {
                const node = nodes.find((n) => n.id === nodeId);
                const display = node ? node.label : nodeId;
                return (
                  <p key={nodeId}>
                    {display}: {distance === Infinity ? '∞' : distance}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Comparison */}
      {comparison && (
        <div className="p-4 bg-purple-50 rounded-lg mt-4">
          <h3 className="font-semibold text-gray-700 mb-3">Comparison</h3>
          {Object.entries(comparison).map(([algo, result]) => (
            <div key={algo} className="mb-3 pb-3 border-b border-purple-200 last:border-b-0">
              <p className="text-xs font-semibold text-gray-700">{algo}</p>
              <p className="text-xs text-gray-600">Time: {result.executionTime}ms</p>
              <p className="text-xs text-gray-600">Visited: {result.visited.length} nodes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

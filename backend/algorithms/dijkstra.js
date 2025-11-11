/**
 * Dijkstra's Algorithm - Finds shortest path from a source node to all other nodes
 * Time Complexity: O((V + E) log V) with min-heap
 */
export function dijkstra(nodes, edges, startNodeId) {
  const distances = {};
  const predecessors = {};
  const visited = new Set();
  const unvisited = new Set();
  const visitationOrder = [];

  // Initialize distances
  nodes.forEach((node) => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    predecessors[node.id] = null;
    unvisited.add(node.id);
  });

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentNode = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < minDistance) {
        minDistance = distances[nodeId];
        currentNode = nodeId;
      }
    }

    if (currentNode === null || distances[currentNode] === Infinity) break;

    visited.add(currentNode);
    unvisited.delete(currentNode);
    visitationOrder.push(currentNode);

    // Relax edges
    const relaxationSteps = [];
    edges.forEach((edge) => {
      if (edge.source === currentNode && unvisited.has(edge.target)) {
        const newDistance = distances[currentNode] + edge.weight;
        if (newDistance < distances[edge.target]) {
          distances[edge.target] = newDistance;
          predecessors[edge.target] = currentNode;
          relaxationSteps.push({
            edge: edge.id,
            from: currentNode,
            to: edge.target,
            oldDistance: distances[edge.target],
            newDistance: newDistance,
          });
        }
      }
    });

    if (relaxationSteps.length > 0) {
      visitationOrder.push({
        type: 'relaxation',
        steps: relaxationSteps,
      });
    }
  }

  return {
    distances,
    predecessors,
    visitationOrder,
    visited: Array.from(visited),
  };
}

/**
 * Get shortest path from start to end node
 */
export function getPath(predecessors, startNodeId, endNodeId) {
  const path = [];
  let current = endNodeId;

  while (current !== null) {
    path.unshift(current);
    if (current === startNodeId) break;
    current = predecessors[current];
  }

  return path.length > 0 && path[0] === startNodeId ? path : [];
}

/**
 * Calculate total path cost
 */
export function calculatePathCost(path, edges) {
  let cost = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = edges.find((e) => e.source === path[i] && e.target === path[i + 1]);
    if (edge) cost += edge.weight;
  }
  return cost;
}

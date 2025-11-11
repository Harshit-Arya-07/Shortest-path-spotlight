/**
 * Bellman-Ford Algorithm - Works with negative weights, detects negative cycles
 * Time Complexity: O(V * E)
 */
export function bellmanFord(nodes, edges, startNodeId) {
  const distances = {};
  const predecessors = {};
  const visited = new Set();
  const relaxationOrder = [];

  // Initialize distances
  nodes.forEach((node) => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    predecessors[node.id] = null;
  });

  // Relax edges V-1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    let updated = false;
    edges.forEach((edge) => {
      if (distances[edge.source] !== Infinity) {
        const newDistance = distances[edge.source] + edge.weight;
        if (newDistance < distances[edge.target]) {
          distances[edge.target] = newDistance;
          predecessors[edge.target] = edge.source;
          visited.add(edge.target);
          updated = true;
          relaxationOrder.push({
            iteration: i + 1,
            edge: edge.id,
            from: edge.source,
            to: edge.target,
            newDistance: newDistance,
          });
        }
      }
    });
    if (!updated) break;
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  edges.forEach((edge) => {
    if (distances[edge.source] !== Infinity) {
      const newDistance = distances[edge.source] + edge.weight;
      if (newDistance < distances[edge.target]) {
        hasNegativeCycle = true;
      }
    }
  });

  return {
    distances,
    predecessors,
    relaxationOrder,
    visited: Array.from(visited),
    hasNegativeCycle,
  };
}

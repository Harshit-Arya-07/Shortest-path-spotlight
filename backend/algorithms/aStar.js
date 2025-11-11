/**
 * A* Algorithm - Uses heuristic to find shortest path faster
 * Time Complexity: O((V + E) log V) but typically faster than Dijkstra with good heuristic
 */

function manhattanDistance(node1, node2) {
  return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
}

export function aStar(nodes, edges, startNodeId, endNodeId, useHeuristic = true) {
  const openSet = new Set([startNodeId]);
  const closedSet = new Set();
  const gScore = {}; // Cost from start
  const fScore = {}; // Estimated total cost
  const predecessors = {};
  const visitationOrder = [];

  const startNode = nodes.find((n) => n.id === startNodeId);
  const endNode = nodes.find((n) => n.id === endNodeId);

  // Initialize scores
  nodes.forEach((node) => {
    gScore[node.id] = Infinity;
    const heuristic =
      useHeuristic && startNode && endNode
        ? manhattanDistance(node, endNode)
        : 0;
    fScore[node.id] = Infinity;
    predecessors[node.id] = null;
  });

  gScore[startNodeId] = 0;
  fScore[startNodeId] = useHeuristic && endNode ? manhattanDistance(startNode, endNode) : 0;

  const relaxationSteps = [];

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let currentNodeId = null;
    let lowestFScore = Infinity;

    for (const nodeId of openSet) {
      if (fScore[nodeId] < lowestFScore) {
        lowestFScore = fScore[nodeId];
        currentNodeId = nodeId;
      }
    }

    if (currentNodeId === null) break;

    visitationOrder.push(currentNodeId);

    if (currentNodeId === endNodeId) {
      // Path found
      return {
        gScore,
        fScore,
        predecessors,
        visitationOrder,
        visited: Array.from(closedSet),
        pathFound: true,
        relaxationSteps,
      };
    }

    openSet.delete(currentNodeId);
    closedSet.add(currentNodeId);

    // Check all neighbors
    const edgesFromCurrent = edges.filter((e) => e.source === currentNodeId);

    edgesFromCurrent.forEach((edge) => {
      const neighbor = edge.target;
      if (closedSet.has(neighbor)) return;

      const tentativeGScore = gScore[currentNodeId] + edge.weight;

      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
      }

      if (tentativeGScore >= gScore[neighbor]) return;

      // This path is better
      predecessors[neighbor] = currentNodeId;
      gScore[neighbor] = tentativeGScore;

      const neighborNode = nodes.find((n) => n.id === neighbor);
      const heuristic =
        useHeuristic && neighborNode && endNode ? manhattanDistance(neighborNode, endNode) : 0;

      fScore[neighbor] = gScore[neighbor] + heuristic;

      relaxationSteps.push({
        edge: edge.id,
        from: currentNodeId,
        to: neighbor,
        gScore: gScore[neighbor],
        fScore: fScore[neighbor],
      });
    });
  }

  return {
    gScore,
    fScore,
    predecessors,
    visitationOrder,
    visited: Array.from(closedSet),
    pathFound: false,
    relaxationSteps,
  };
}

import Graph from '../models/Graph.js';
import { dijkstra, getPath, calculatePathCost } from '../algorithms/dijkstra.js';
import { bellmanFord } from '../algorithms/bellmanFord.js';
import { aStar } from '../algorithms/aStar.js';

export async function createGraph(req, res) {
  try {
    const { name, description, nodes, edges } = req.body;
    const userId = req.userId || null;

    const graph = new Graph({
      name,
      description,
      nodes,
      edges,
      userId,
    });

    await graph.save();
    res.status(201).json({ message: 'Graph created', graph });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getGraphs(req, res) {
  try {
    const userId = req.userId;
    const filter = userId ? { $or: [{ userId }, { isPublic: true }] } : { isPublic: true };

    const graphs = await Graph.find(filter).sort({ createdAt: -1 });
    res.json(graphs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getGraphById(req, res) {
  try {
    const graph = await Graph.findById(req.params.id);
    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }
    res.json(graph);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateGraph(req, res) {
  try {
    const { name, description, nodes, edges, isPublic } = req.body;
    const graph = await Graph.findById(req.params.id);

    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }

    if (graph.userId && req.userId !== graph.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this graph' });
    }

    graph.name = name || graph.name;
    graph.description = description || graph.description;
    graph.nodes = nodes || graph.nodes;
    graph.edges = edges || graph.edges;
    if (isPublic !== undefined) graph.isPublic = isPublic;

    await graph.save();
    res.json({ message: 'Graph updated', graph });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteGraph(req, res) {
  try {
    const graph = await Graph.findById(req.params.id);
    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }

    if (graph.userId && req.userId !== graph.userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this graph' });
    }

    await Graph.findByIdAndDelete(req.params.id);
    res.json({ message: 'Graph deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function runAlgorithm(req, res) {
  try {
    const { graphId, algorithm, startNodeId, endNodeId } = req.body;

    if (!graphId || !algorithm || !startNodeId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const graph = await Graph.findById(graphId);
    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }

    const startTime = performance.now();
    let result;

    switch (algorithm) {
      case 'dijkstra':
        result = dijkstra(graph.nodes, graph.edges, startNodeId);
        break;
      case 'bellmanFord':
        result = bellmanFord(graph.nodes, graph.edges, startNodeId);
        break;
      case 'aStar':
        if (!endNodeId) {
          return res.status(400).json({ error: 'A* requires endNodeId' });
        }
        result = aStar(graph.nodes, graph.edges, startNodeId, endNodeId);
        break;
      default:
        return res.status(400).json({ error: 'Unknown algorithm' });
    }

    const executionTime = performance.now() - startTime;

    let pathResult = null;
    if (endNodeId) {
      const path = getPath(result.predecessors, startNodeId, endNodeId);
      const cost = path.length > 0 ? calculatePathCost(path, graph.edges) : 0;
      pathResult = { path, cost };
    }

    res.json({
      algorithm,
      executionTime: executionTime.toFixed(2),
      result: {
        ...result,
        pathResult,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function compareAlgorithms(req, res) {
  try {
    const { graphId, startNodeId, endNodeId } = req.body;

    if (!graphId || !startNodeId || !endNodeId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const graph = await Graph.findById(graphId);
    if (!graph) {
      return res.status(404).json({ error: 'Graph not found' });
    }

    const comparisons = {};

    // Dijkstra
    let startTime = performance.now();
    const dijkstraResult = dijkstra(graph.nodes, graph.edges, startNodeId);
    let executionTime = performance.now() - startTime;
    const dijkstraPath = getPath(dijkstraResult.predecessors, startNodeId, endNodeId);
    const dijkstraCost = dijkstraPath.length > 0 ? calculatePathCost(dijkstraPath, graph.edges) : 0;
    comparisons.dijkstra = {
      executionTime: executionTime.toFixed(2),
      path: dijkstraPath,
      cost: dijkstraCost,
      steps: dijkstraResult.visitationOrder.length,
    };

    // Bellman-Ford
    startTime = performance.now();
    const bellmanFordResult = bellmanFord(graph.nodes, graph.edges, startNodeId);
    executionTime = performance.now() - startTime;
    const bellmanPath = getPath(bellmanFordResult.predecessors, startNodeId, endNodeId);
    const bellmanCost = bellmanPath.length > 0 ? calculatePathCost(bellmanPath, graph.edges) : 0;
    comparisons.bellmanFord = {
      executionTime: executionTime.toFixed(2),
      path: bellmanPath,
      cost: bellmanCost,
      steps: bellmanFordResult.relaxationOrder.length,
      hasNegativeCycle: bellmanFordResult.hasNegativeCycle,
    };

    // A*
    startTime = performance.now();
    const aStarResult = aStar(graph.nodes, graph.edges, startNodeId, endNodeId);
    executionTime = performance.now() - startTime;
    const aStarPath = getPath(aStarResult.predecessors, startNodeId, endNodeId);
    const aStarCost = aStarPath.length > 0 ? calculatePathCost(aStarPath, graph.edges) : 0;
    comparisons.aStar = {
      executionTime: executionTime.toFixed(2),
      path: aStarPath,
      cost: aStarCost,
      steps: aStarResult.visitationOrder.length,
      pathFound: aStarResult.pathFound,
    };

    res.json(comparisons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

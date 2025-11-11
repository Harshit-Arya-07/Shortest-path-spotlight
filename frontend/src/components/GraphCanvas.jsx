import React, { useRef, useEffect, useState } from 'react';
import { useGraphStore, useUIStore } from '../store/index';

export default function GraphCanvas() {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState(null);
  const [isDrawingEdge, setIsDrawingEdge] = useState(false);
  const [edgeStart, setEdgeStart] = useState(null); // stores the start node id when drawing an edge
  const [edgePointer, setEdgePointer] = useState(null); // stores current mouse position for preview
  const [edgeEditingId, setEdgeEditingId] = useState(null); // stores edge id being edited inline
  const [edgeNewWeight, setEdgeNewWeight] = useState(''); // stores new weight value being entered
  const [doubleClickTime, setDoubleClickTime] = useState(0); // track double-click timing

  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const visualizationState = useGraphStore((state) => state.visualizationState);
  const selectedNode = useGraphStore((state) => state.selectedNode);
  const selectedEdge = useGraphStore((state) => state.selectedEdge);
  const addNode = useGraphStore((state) => state.addNode);
  const updateNode = useGraphStore((state) => state.updateNode);
  const removeNode = useGraphStore((state) => state.removeNode);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const addEdge = useGraphStore((state) => state.addEdge);
  const removeEdge = useGraphStore((state) => state.removeEdge);
  const setSelectedEdge = useGraphStore((state) => state.setSelectedEdge);
  const connectMode = useUIStore((state) => state.connectMode);

  const NODE_RADIUS = 25;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw edges
    edges.forEach((edge) => {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);

      if (source && target) {
        const isSelectedEdge = selectedEdge && selectedEdge.id === edge.id;
        ctx.strokeStyle =
          isSelectedEdge
            ? '#ff6b6b'
            : visualizationState?.relaxedEdges?.includes(edge.id)
            ? '#28a745'
            : '#495057';
        ctx.lineWidth = isSelectedEdge ? 4 : visualizationState?.relaxedEdges?.includes(edge.id) ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();

        // Draw weight
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(edge.weight, midX, midY - 5);
      }
    });

    if (isDrawingEdge && edgeStart && edgePointer) {
      const startNode = nodes.find((n) => n.id === edgeStart);
      if (startNode) {
        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(startNode.x, startNode.y);
        ctx.lineTo(edgePointer.x, edgePointer.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      const isVisited = visualizationState?.visited?.includes(node.id);
      const isCurrentNode = visualizationState?.currentNode === node.id;

      ctx.fillStyle = isCurrentNode ? '#ffc107' : isVisited ? '#28a745' : '#007bff';
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fill();

      if (selectedNode?.id === node.id) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS + 3, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);

      // Draw distance if available
      if (visualizationState?.distances?.[node.id] !== undefined) {
        ctx.fillStyle = '#495057';
        ctx.font = '10px Arial';
        ctx.fillText(`d: ${visualizationState.distances[node.id]}`, node.x, node.y + 25);
      }
    });
  }, [nodes, edges, visualizationState, selectedNode, isDrawingEdge, edgeStart]);

  const getNodeAtPosition = (x, y) => {
    return nodes.find((node) => {
      const distance = Math.hypot(node.x - x, node.y - y);
      return distance <= NODE_RADIUS;
    });
  };

  const pointToSegmentDistance = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.hypot(dx, dy);
  };

  const getEdgeAtPosition = (x, y) => {
    const EDGE_HIT_RADIUS = 8;
    return edges.find((edge) => {
      const s = nodes.find((n) => n.id === edge.source);
      const t = nodes.find((n) => n.id === edge.target);
      if (!s || !t) return false;
      const dist = pointToSegmentDistance(x, y, s.x, s.y, t.x, t.y);
      return dist <= EDGE_HIT_RADIUS;
    });
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = getNodeAtPosition(x, y);

    // Check for double-click on an edge to start inline editing
    if (e.detail === 2 && !clickedNode && !isDrawingEdge) {
      const edgeHit = getEdgeAtPosition(x, y);
      if (edgeHit) {
        setEdgeEditingId(edgeHit.id);
        setEdgeNewWeight(edgeHit.weight.toString());
        return;
      }
    }

    if (clickedNode) {
      // If connect mode is enabled, allow click-to-connect (select source then click target)
      if (connectMode) {
        if (!edgeStart) {
          setEdgeStart(clickedNode.id);
          setEdgePointer({ x: clickedNode.x, y: clickedNode.y });
          setSelectedNode(clickedNode);
          return;
        }

        // finish connection when clicking a different node
        if (edgeStart && edgeStart !== clickedNode.id) {
          const newEdge = {
            id: `edge-${Date.now()}`,
            source: edgeStart,
            target: clickedNode.id,
            weight: 1,
          };
          addEdge(newEdge);
        }
        setEdgeStart(null);
        setEdgePointer(null);
        return;
      }

      // If user holds Shift while clicking a node, begin drawing an edge (freeform)
      if (!isDrawingEdge && e.shiftKey) {
        setIsDrawingEdge(true);
        setEdgeStart(clickedNode.id);
        setEdgePointer({ x: clickedNode.x, y: clickedNode.y });
        return;
      }

      if (isDrawingEdge) {
        // finish drawing edge when clicking a different node
        if (edgeStart && edgeStart !== clickedNode.id) {
          const newEdge = {
            id: `edge-${Date.now()}`,
            source: edgeStart,
            target: clickedNode.id,
            weight: 1,
          };
          addEdge(newEdge);
        }
        // clear drawing temporary state
        setIsDrawingEdge(false);
        setEdgeStart(null);
        setEdgePointer(null);
      } else {
        setSelectedNode(clickedNode);
      }
    } else {
      // check for clicking near an edge to select it
      const EDGE_HIT_RADIUS = 8; // pixels
      const edgeHit = edges.find((edge) => {
        const s = nodes.find((n) => n.id === edge.source);
        const t = nodes.find((n) => n.id === edge.target);
        if (!s || !t) return false;
        const dist = pointToSegmentDistance(x, y, s.x, s.y, t.x, t.y);
        return dist <= EDGE_HIT_RADIUS;
      });

      if (edgeHit) {
        setSelectedEdge(edgeHit);
        setSelectedNode(null);
        return;
      }

      if (!isDrawingEdge) {
        // Create new node
        const newNode = {
          id: `node-${Date.now()}`,
          label: `N${nodes.length + 1}`,
          x,
          y,
        };
        addNode(newNode);
      }
      // If user clicks empty space while connect mode is active, cancel the current connection
      if (connectMode && edgeStart) {
        setEdgeStart(null);
        setEdgePointer(null);
      }

      setSelectedNode(null);
      // clear selected edge when clicking empty space that is not near an edge
      setSelectedEdge(null);
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = getNodeAtPosition(x, y);
    if (clickedNode && e.button === 0) {
      setIsDragging(true);
      setDraggedNode(clickedNode);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && draggedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateNode(draggedNode.id, { x, y });
    }

    if (isDrawingEdge) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setEdgePointer({ x, y });
      canvasRef.current.style.cursor = 'crosshair';
      return; // while drawing, keep crosshair and don't change to grab/default below
    } else {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check for edge hover to show pointer cursor
      const edgeHit = getEdgeAtPosition(x, y);
      if (edgeHit) {
        canvasRef.current.style.cursor = 'pointer';
        return;
      }
      
      const hoveredNode = getNodeAtPosition(x, y);
      canvasRef.current.style.cursor = hoveredNode ? 'grab' : 'default';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNode(null);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = getNodeAtPosition(x, y);
    if (clickedNode) {
      removeNode(clickedNode.id);
    }
  };

  // When the graph is cleared, also reset any local drawing state to avoid stale preview
  useEffect(() => {
    if (nodes.length === 0 && edges.length === 0) {
      setIsDrawingEdge(false);
      setEdgeStart(null);
      setEdgePointer(null);
      setIsDragging(false);
      setDraggedNode(null);
      setEdgeEditingId(null);
      setEdgeNewWeight('');
    }
  }, [nodes.length, edges.length]);

  const handleKeyDown = (e) => {
    if (!edgeEditingId) return;
    if (e.key === 'Enter') {
      const weight = parseFloat(edgeNewWeight) || 1;
      const updateEdge = useGraphStore.getState().updateEdge;
      updateEdge(edgeEditingId, { weight });
      setEdgeEditingId(null);
      setEdgeNewWeight('');
    } else if (e.key === 'Escape') {
      setEdgeEditingId(null);
      setEdgeNewWeight('');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [edgeEditingId, edgeNewWeight]);

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleRightClick}
        className="w-full h-full bg-gray-50 border border-gray-300 rounded-lg cursor-crosshair"
      />
      {edgeEditingId && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <input
            autoFocus
            type="number"
            value={edgeNewWeight}
            onChange={(e) => setEdgeNewWeight(e.target.value)}
            onBlur={() => {
              const weight = parseFloat(edgeNewWeight) || 1;
              const updateEdge = useGraphStore.getState().updateEdge;
              updateEdge(edgeEditingId, { weight });
              setEdgeEditingId(null);
              setEdgeNewWeight('');
            }}
            className="pointer-events-auto px-2 py-1 border border-blue-400 rounded bg-white text-center text-sm font-semibold"
            placeholder="Weight"
          />
          <p className="pointer-events-auto ml-2 text-xs text-gray-600">Enter to save, Esc to cancel</p>
        </div>
      )}
    </>
  );
}

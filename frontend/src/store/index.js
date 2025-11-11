import { create } from 'zustand';

export const useGraphStore = create((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  visualizationState: null,
  currentAlgorithm: 'dijkstra',
  isRunning: false,
  executionTime: 0,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setSelectedNode: (node) => set({ selectedNode: node }),
  setSelectedEdge: (edge) => set({ selectedEdge: edge }),
  setVisualizationState: (state) => set({ visualizationState: state }),
  setCurrentAlgorithm: (algorithm) => set({ currentAlgorithm: algorithm }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setExecutionTime: (time) => set({ executionTime: time }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),

  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
    })),

  addEdge: (edge) =>
    set((state) => {
      const existsEdge = state.edges.find(
        (e) => e.source === edge.source && e.target === edge.target
      );
      if (existsEdge) {
        // If an identical edge exists, select it so user can edit weight
        return { edges: state.edges, selectedEdge: existsEdge };
      }
      return { edges: [...state.edges, edge], selectedEdge: edge };
    }),

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
      selectedEdge: state.selectedEdge && state.selectedEdge.id === edgeId ? null : state.selectedEdge,
    })),

  updateEdge: (edgeId, updates) =>
    set((state) => ({
      edges: state.edges.map((e) => (e.id === edgeId ? { ...e, ...updates } : e)),
    })),

  clearGraph: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      visualizationState: null,
    }),

  loadGraph: (nodes, edges) => set({ nodes, edges }),
}));

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: !!token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  showComparison: false,
  connectMode: false,
  animationSpeed: 500,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setShowComparison: (show) => set({ showComparison: show }),
  setConnectMode: (on) => set({ connectMode: on }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
}));

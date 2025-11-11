import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const graphService = {
  getGraphs: () => api.get('/graphs'),
  getGraphById: (id) => api.get(`/graphs/${id}`),
  createGraph: (name, description, nodes, edges) =>
    api.post('/graphs', { name, description, nodes, edges }),
  updateGraph: (id, data) => api.put(`/graphs/${id}`, data),
  deleteGraph: (id) => api.delete(`/graphs/${id}`),
  runAlgorithm: (graphId, algorithm, startNodeId, endNodeId) =>
    api.post('/graphs/algorithms/run', { graphId, algorithm, startNodeId, endNodeId }),
  compareAlgorithms: (graphId, startNodeId, endNodeId) =>
    api.post('/graphs/algorithms/compare', { graphId, startNodeId, endNodeId }),
};

export default api;

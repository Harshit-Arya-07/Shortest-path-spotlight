import express from 'express';
import {
  createGraph,
  getGraphs,
  getGraphById,
  updateGraph,
  deleteGraph,
  runAlgorithm,
  compareAlgorithms,
} from '../controllers/graphController.js';
import { optionalToken, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (optional authentication)
router.get('/', optionalToken, getGraphs);
router.get('/:id', getGraphById);
router.post('/algorithms/run', runAlgorithm);
router.post('/algorithms/compare', compareAlgorithms);

// Protected routes (require authentication)
router.post('/', verifyToken, createGraph);
router.put('/:id', verifyToken, updateGraph);
router.delete('/:id', verifyToken, deleteGraph);

export default router;

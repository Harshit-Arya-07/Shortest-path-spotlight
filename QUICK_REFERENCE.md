# Quick Reference Guide

## 📦 Project Structure at a Glance

```
shortest-path-spotlight/
├── backend/               # Node.js + Express API
│   ├── algorithms/        # Algorithm implementations
│   ├── controllers/       # Business logic
│   ├── middleware/        # Authentication
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── server.js          # Entry point
│   └── package.json
│
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── store/         # State management
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md              # Main documentation
├── SETUP_GUIDE.md         # Installation guide
├── API_DOCUMENTATION.md   # API reference
└── package.json           # Root scripts
```

---

## 🚀 Quick Commands

### Initial Setup
```bash
npm run setup              # Install all dependencies
```

### Development
```bash
npm run dev                # Run both frontend and backend
npm start                  # Run backend only
cd frontend && npm run dev # Run frontend only
```

### Production
```bash
npm run build              # Build frontend
cd backend && npm start    # Start backend
```

---

## 🗂️ File Overview

### Backend Files

| File | Purpose |
|------|---------|
| `server.js` | Express app setup, middleware config |
| `algorithms/dijkstra.js` | Dijkstra's shortest path implementation |
| `algorithms/bellmanFord.js` | Bellman-Ford algorithm implementation |
| `algorithms/aStar.js` | A* pathfinding algorithm |
| `controllers/authController.js` | User registration/login logic |
| `controllers/graphController.js` | Graph CRUD & algorithm execution |
| `models/User.js` | User schema with password hashing |
| `models/Graph.js` | Graph schema for nodes/edges |
| `routes/authRoutes.js` | `/api/auth/*` endpoints |
| `routes/graphRoutes.js` | `/api/graphs/*` endpoints |
| `middleware/auth.js` | JWT verification middleware |
| `.env.example` | Environment variables template |
| `package.json` | Dependencies and scripts |

### Frontend Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app routing |
| `src/main.jsx` | React entry point |
| `src/index.css` | Global styles with Tailwind |
| `src/components/Header.jsx` | Top navbar with export/import |
| `src/components/GraphCanvas.jsx` | Canvas-based graph visualization |
| `src/components/ControlPanel.jsx` | Node/edge controls |
| `src/components/VisualizationPanel.jsx` | Algorithm execution |
| `src/pages/Home.jsx` | Landing page |
| `src/pages/Editor.jsx` | Main editor layout |
| `src/services/api.js` | Axios API client |
| `src/store/index.js` | Zustand state management |
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS plugins |
| `.env.example` | Environment variables template |
| `package.json` | Dependencies and scripts |

---

## 🔑 Key Concepts

### Algorithms

#### Dijkstra's Algorithm
- **Use case:** Finding shortest path in non-negative weighted graphs
- **Time:** O((V + E) log V)
- **Space:** O(V)
- **File:** `backend/algorithms/dijkstra.js`

#### Bellman-Ford Algorithm
- **Use case:** Works with negative weights, detects negative cycles
- **Time:** O(V × E)
- **Space:** O(V)
- **File:** `backend/algorithms/bellmanFord.js`

#### A* Algorithm
- **Use case:** Fast pathfinding with heuristics
- **Time:** O((V + E) log V)
- **Space:** O(V)
- **File:** `backend/algorithms/aStar.js`

### State Management

**Zustand Stores:**
- `useGraphStore` - Graph nodes, edges, visualization state
- `useAuthStore` - User authentication, JWT token
- `useUIStore` - UI state, sidebar, animation speed

### API Communication

```javascript
// Example API call
const result = await graphService.runAlgorithm(
  graphId,
  'dijkstra',
  'node-1',
  'node-3'
);
```

---

## 🎨 UI Components

### GraphCanvas
- Canvas-based rendering
- Node dragging
- Edge creation with Shift+click
- Right-click to delete
- Color-coded visualization

### ControlPanel
- Graph statistics
- Algorithm selection
- Node/edge management
- Animation speed slider

### VisualizationPanel
- Start/end node selection
- Algorithm execution
- Results display
- Performance comparison

### Header
- Graph info display
- Export/Import buttons
- Execution time

---

## 📊 Data Models

### Graph Model
```json
{
  "name": "string",
  "description": "string",
  "nodes": [
    { "id": "string", "label": "string", "x": "number", "y": "number" }
  ],
  "edges": [
    { "id": "string", "source": "string", "target": "string", "weight": "number" }
  ],
  "isPublic": "boolean",
  "userId": "ObjectId (optional)"
}
```

### User Model
```json
{
  "username": "string (unique)",
  "email": "string (unique)",
  "password": "string (hashed)"
}
```

### Algorithm Result
```json
{
  "distances": { "nodeId": "number" },
  "predecessors": { "nodeId": "string|null" },
  "visited": ["nodeId"],
  "executionTime": "string (ms)",
  "pathResult": {
    "path": ["nodeId"],
    "cost": "number"
  }
}
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Graphs
- `GET /api/graphs` - Get all graphs
- `GET /api/graphs/:id` - Get graph by ID
- `POST /api/graphs` - Create graph (auth required)
- `PUT /api/graphs/:id` - Update graph (auth required)
- `DELETE /api/graphs/:id` - Delete graph (auth required)

### Algorithms
- `POST /api/graphs/algorithms/run` - Run single algorithm
- `POST /api/graphs/algorithms/compare` - Compare all algorithms

---

## 💾 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/shortest-path-db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Ensure MongoDB is running: `mongod` |
| Port 5000 already in use | Kill process: `kill -9 $(lsof -t -i :5000)` |
| Styles not loading | Clear cache: `rm -rf .vite node_modules` |
| Token expired | Clear localStorage and login again |
| CORS error | Check API URL in `.env.local` |

---

## 📚 Resources

- [Dijkstra Algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
- [Bellman-Ford Algorithm](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)
- [A* Pathfinding](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [React Documentation](https://react.dev)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🎓 Learning Paths

### Beginner
1. Understand graph basics (nodes, edges, weights)
2. Learn Dijkstra's algorithm step-by-step
3. Try creating simple graphs
4. Observe visualization

### Intermediate
1. Study Bellman-Ford algorithm
2. Compare with Dijkstra's
3. Explore API endpoints
4. Create custom graphs

### Advanced
1. Study A* algorithm
2. Implement custom heuristics
3. Optimize algorithm implementations
4. Deploy to production

---

## 🚀 Next Steps

1. **Run Setup:** `npm run setup`
2. **Start Servers:** `npm run dev`
3. **Open Browser:** http://localhost:3000
4. **Create Graph:** Click to add nodes
5. **Run Algorithms:** Select and execute
6. **Compare Results:** View performance metrics

---

## 📞 Getting Help

1. Check SETUP_GUIDE.md for installation issues
2. Review API_DOCUMENTATION.md for API questions
3. Check README.md for feature details
4. Look at code comments for implementation details
5. Check browser console for errors (F12)

---

**Happy coding! 🚀**

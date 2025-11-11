# Shortest Path Spotlight 🎯

A full-stack MERN application that visualizes and compares shortest path algorithms in weighted graphs. Explore Dijkstra's, Bellman-Ford, and A* algorithms with an interactive graph editor.

## 🌟 Features

### Interactive Graph Editor
- **Drag-and-drop interface** for creating nodes
- **Click-to-connect** for drawing weighted edges
- **Real-time visualization** with color-coded nodes
- **Node repositioning** by dragging
- **Right-click deletion** for quick removal
- **Export/Import graphs** as JSON files

### Algorithm Visualization
- **Step-by-step execution** with animations
- **Color-coded visualization**:
  - 🔵 Blue: Unvisited nodes
  - 🟢 Green: Visited nodes
  - 🟡 Yellow: Current node being processed
- **Real-time distance updates** in distance tables
- **Path highlighting** showing the final shortest path

### Algorithm Comparison
- **Dijkstra's Algorithm**
  - Time Complexity: O((V + E) log V)
  - Works with non-negative weights
  - Most efficient for most cases

- **Bellman-Ford Algorithm**
  - Time Complexity: O(V × E)
  - Handles negative weights
  - Detects negative cycles

- **A* Algorithm**
  - Time Complexity: O((V + E) log V) with good heuristic
  - Uses Manhattan distance heuristic
  - Optimal pathfinding

### Performance Metrics
- Execution time measurement
- Number of nodes visited
- Path cost calculation
- Step-by-step comparison

## 📋 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - API client
- **React Router** - Navigation
- **React Toastify** - Notifications

### Backend
- **Node.js + Express** - API server
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm
- MongoDB (local or cloud instance)
- Git

### Installation

#### 1. Clone the Repository
```bash
cd shortest-path-spotlight
```

#### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/shortest-path-db
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📚 Project Structure

```
shortest-path-spotlight/
├── backend/
│   ├── algorithms/
│   │   ├── dijkstra.js        # Dijkstra's algorithm implementation
│   │   ├── bellmanFord.js     # Bellman-Ford implementation
│   │   └── aStar.js           # A* algorithm implementation
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── graphController.js # Graph operations
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Graph.js           # Graph schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── graphRoutes.js     # Graph endpoints
│   ├── server.js              # Express app setup
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # Top navigation bar
│   │   │   ├── GraphCanvas.jsx        # Canvas for graph visualization
│   │   │   ├── ControlPanel.jsx       # Node/edge controls
│   │   │   └── VisualizationPanel.jsx # Algorithm execution panel
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Landing page
│   │   │   └── Editor.jsx             # Main editor page
│   │   ├── services/
│   │   │   └── api.js                 # API client
│   │   ├── store/
│   │   │   └── index.js               # Zustand store
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

## 🎮 How to Use

### Creating a Graph

1. **Add Nodes**: Click anywhere on the canvas to create nodes
2. **Add Edges**: 
   - Right-click a node to select it
   - Hold Shift and click another node to create an edge
   - Enter the edge weight in the control panel

### Running Algorithms

1. **Select Algorithm**: Choose from Dijkstra's, Bellman-Ford, or A*
2. **Select Start Node**: Pick the starting node
3. **Select End Node**: Pick the destination (required for A*)
4. **Run**: Click "Run Algorithm" to execute
5. **Observe**: Watch the visualization as nodes are visited

### Comparing Algorithms

1. Select start and end nodes
2. Click "Compare All"
3. See side-by-side performance metrics:
   - Execution time
   - Nodes visited
   - Path cost
   - Steps taken

### Export/Import Graphs

- **Export**: Click "Export" to download graph as JSON
- **Import**: Click "Import" to load a previously saved graph

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Graphs (CRUD)
- `GET /api/graphs` - Get all public graphs
- `POST /api/graphs` - Create graph (auth required)
- `GET /api/graphs/:id` - Get graph by ID
- `PUT /api/graphs/:id` - Update graph (auth required)
- `DELETE /api/graphs/:id` - Delete graph (auth required)

### Algorithm Execution
- `POST /api/graphs/algorithms/run` - Run single algorithm
  ```json
  {
    "graphId": "...",
    "algorithm": "dijkstra|bellmanFord|aStar",
    "startNodeId": "...",
    "endNodeId": "..." // required for A*
  }
  ```

- `POST /api/graphs/algorithms/compare` - Compare all algorithms
  ```json
  {
    "graphId": "...",
    "startNodeId": "...",
    "endNodeId": "..."
  }
  ```

## 🔑 Key Algorithms Explained

### Dijkstra's Algorithm
Finds the shortest path using a greedy approach. Maintains a priority queue of unvisited nodes.

**Steps:**
1. Initialize distances to all nodes as ∞ except source (0)
2. While unvisited nodes exist:
   - Select unvisited node with minimum distance
   - For each neighbor, relax the edge if shorter path found
   - Mark node as visited

**Time Complexity:** O((V + E) log V)

### Bellman-Ford Algorithm
Relaxes edges multiple times to handle negative weights.

**Steps:**
1. Initialize distances to all nodes as ∞ except source (0)
2. Repeat V-1 times: relax all edges
3. Check for negative cycles by attempting one more relaxation

**Time Complexity:** O(V × E)

### A* Algorithm
Uses heuristics to guide search toward the goal.

**Steps:**
1. Maintain open set with start node
2. While open set not empty:
   - Pick node with lowest f-score (g + h)
   - If goal reached, reconstruct path
   - Otherwise, expand neighbors and update scores

**Time Complexity:** O((V + E) log V) with good heuristic

## 🎨 UI Components

### GraphCanvas
Canvas-based graph visualization with:
- Automatic node rendering with labels
- Edge weight display
- Color-coded visited nodes
- Drag-and-drop node repositioning
- Distance labels during visualization

### ControlPanel
Right sidebar with:
- Graph statistics
- Algorithm selection
- Node/edge management
- Animation speed control
- Clear graph button

### VisualizationPanel
Bottom-right panel with:
- Start/end node selection
- Run/Compare buttons
- Result display
- Performance metrics
- Distance table

## 🌟 Advanced Features

### Implemented
✅ Interactive graph creation and editing  
✅ All three algorithm implementations  
✅ Real-time visualization  
✅ Algorithm comparison  
✅ Export/import graphs  
✅ JWT authentication system  
✅ MongoDB persistence  
✅ Responsive design  

### Future Enhancements
🔄 Speed control with step-through playback  
🔄 Grid-based A* pathfinding  
🔄 GIF/MP4 export of visualizations  
🔄 Real-time performance charts  
🔄 Multi-source pathfinding  
🔄 Graph generation presets  

## 🐛 Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, use connection string with credentials

### Frontend can't reach backend
- Verify backend is running on port 5000
- Check CORS is enabled in `server.js`
- Update `VITE_API_URL` in `.env.local`

### Algorithms not visualizing
- Ensure graph has nodes and edges
- Select start and end nodes
- Check browser console for errors

### Port already in use
- Backend: `lsof -i :5000` then kill the process
- Frontend: `lsof -i :3000` then kill the process

## 📖 Learning Resources

- [Dijkstra's Algorithm Explained](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
- [Bellman-Ford Algorithm](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)
- [A* Pathfinding Algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm)
- [Graph Theory Basics](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/describing-graphs)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## ✨ Credits

Built as an educational tool to visualize and understand shortest path algorithms in graph theory.

---

**Happy Pathfinding! 🚀**

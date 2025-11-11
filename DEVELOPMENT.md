# Development Workflow Guide

## Getting Started with Development

This guide walks you through the development workflow for the Shortest Path Spotlight project.

---

## Project Setup

### 1. Initial Clone & Setup

```bash
# Clone the repository
git clone <repository-url>
cd shortest-path-spotlight

# Install all dependencies
npm run setup

# This runs npm install in root, backend, and frontend
```

### 2. Environment Configuration

**Backend (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/shortest-path-db
PORT=5000
NODE_ENV=development
JWT_SECRET=dev-secret-key-change-in-production
```

**Frontend (`frontend/.env.local`):**
```bash
echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env.local
```

### 3. Start Development Servers

```bash
# From root directory
npm run dev

# This starts:
# - Backend on http://localhost:5000
# - Frontend on http://localhost:3000
# Both with hot reload enabled
```

---

## Development Workflow

### Adding a New Feature

#### 1. Plan the Feature
- Sketch out data structures
- Identify backend endpoints needed
- Plan frontend components
- Consider state management

#### 2. Backend Development

**Create/Modify Algorithm:**
```javascript
// backend/algorithms/yourAlgorithm.js
export function yourAlgorithm(nodes, edges, startNodeId) {
  // Implementation
  return {
    distances,
    predecessors,
    visited,
    // ...
  };
}
```

**Add API Endpoint:**
```javascript
// backend/routes/graphRoutes.js
router.post('/algorithms/your-algo', runYourAlgorithm);

// backend/controllers/graphController.js
export async function runYourAlgorithm(req, res) {
  // Implementation
}
```

**Test with Postman:**
- Use POST request to `http://localhost:5000/api/...`
- Include required body/headers
- Verify response format

#### 3. Frontend Development

**Create Component:**
```javascript
// frontend/src/components/YourComponent.jsx
import React from 'react';
import { useGraphStore } from '../store/index';

export default function YourComponent() {
  const store = useGraphStore();
  // Component logic
  return <div>{/* JSX */}</div>;
}
```

**Update Store if Needed:**
```javascript
// frontend/src/store/index.js
export const useGraphStore = create((set) => ({
  // Add new state
  yourState: null,
  setYourState: (state) => set({ yourState: state }),
}));
```

**Update API Client:**
```javascript
// frontend/src/services/api.js
export const graphService = {
  // Add new method
  yourMethod: (params) => api.post('/graphs/your-endpoint', params),
};
```

#### 4. Integration

**Connect Components:**
```javascript
// Use the API in component
import { graphService } from '../services/api';

const result = await graphService.yourMethod(params);
useGraphStore.setState({ yourState: result });
```

#### 5. Testing

**Manual Testing:**
1. Trigger the feature in the UI
2. Check Network tab (F12 → Network)
3. Verify response in backend console
4. Check browser console for errors
5. Test edge cases

**Backend Testing:**
```bash
# In backend directory
npm test  # When tests are added
```

---

## Code Organization

### Backend Structure

```
backend/
├── algorithms/          # Pure algorithm implementations
│   ├── dijkstra.js     # No database access, deterministic
│   ├── bellmanFord.js
│   └── aStar.js
├── controllers/         # Business logic, calls algorithms
│   ├── authController.js
│   └── graphController.js
├── middleware/          # Request interceptors
│   └── auth.js
├── models/              # MongoDB schemas
│   ├── User.js
│   └── Graph.js
└── routes/              # API endpoints
    ├── authRoutes.js
    └── graphRoutes.js
```

**Best Practices:**
- Keep algorithms pure (no side effects)
- Controllers handle business logic
- Models define data structure
- Routes map to controllers

### Frontend Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── GraphCanvas.jsx
│   ├── ControlPanel.jsx
│   └── VisualizationPanel.jsx
├── pages/               # Full page components
│   ├── Home.jsx
│   └── Editor.jsx
├── services/            # API communication
│   └── api.js
├── store/               # State management
│   └── index.js
├── App.jsx              # App routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

**Best Practices:**
- Components are small and focused
- Use hooks for state
- Keep components pure
- Separate concerns (UI vs Logic)

---

## Common Development Tasks

### Modify Algorithm

1. **Edit algorithm file:**
   ```javascript
   // backend/algorithms/dijkstra.js
   export function dijkstra(nodes, edges, startNodeId) {
     // Modify logic
   }
   ```

2. **Test in browser:**
   - Go to editor
   - Create graph
   - Run algorithm
   - Check results

3. **Update visualization if needed:**
   - Modify `VisualizationPanel.jsx`
   - Update store if needed

### Add New UI Component

1. **Create component file:**
   ```bash
   touch frontend/src/components/NewComponent.jsx
   ```

2. **Implement component:**
   ```javascript
   export default function NewComponent() {
     return <div>{/* */}</div>;
   }
   ```

3. **Import and use:**
   ```javascript
   import NewComponent from '../components/NewComponent';
   // In another component
   <NewComponent />
   ```

### Add API Endpoint

1. **Add controller method:**
   ```javascript
   // backend/controllers/graphController.js
   export async function newEndpoint(req, res) {
     // Implementation
   }
   ```

2. **Add route:**
   ```javascript
   // backend/routes/graphRoutes.js
   router.post('/endpoint', newEndpoint);
   ```

3. **Add API client method:**
   ```javascript
   // frontend/src/services/api.js
   newMethod: (data) => api.post('/graphs/endpoint', data),
   ```

4. **Use in component:**
   ```javascript
   const result = await graphService.newMethod(data);
   ```

### Fix a Bug

1. **Identify the issue:**
   - Check browser console (F12)
   - Check backend logs
   - Check Network requests

2. **Locate the code:**
   - Use Ctrl+F to search
   - Check git diff: `git diff`

3. **Debug:**
   - Add console.log statements
   - Use browser debugger
   - Add server-side logging

4. **Fix and test:**
   - Make code change
   - Test in UI
   - Verify no new issues

---

## Debugging Tips

### Frontend Debugging

1. **Open DevTools:** F12
2. **Check Console tab:**
   - Look for red errors
   - Click error to see full message
   - Check Stack Trace

3. **Check Network tab:**
   - Click XHR to filter API calls
   - Click request to see details
   - Check response body

4. **Use Debugger:**
   - Set breakpoints
   - Step through code
   - Inspect variables

5. **React DevTools:**
   - Install extension
   - Inspect component tree
   - Check props and state

### Backend Debugging

1. **Check console output:**
   - Look for error messages
   - See request logs
   - Note response times

2. **Add logging:**
   ```javascript
   console.log('Debug info:', variable);
   console.error('Error:', error);
   ```

3. **Check Database:**
   - Open MongoDB Compass
   - Verify data was saved
   - Check collection contents

4. **Use Postman:**
   - Send requests manually
   - Inspect responses
   - Test edge cases

---

## Git Workflow

### Basic Commands

```bash
# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Feature: Add new algorithm"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# View history
git log --oneline
```

### Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push feature branch
git push origin feature/new-feature

# Create pull request (GitHub/GitLab)

# After approval, merge to main
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main

# Delete feature branch
git branch -d feature/new-feature
```

---

## Performance Tips

### Frontend Optimization

1. **Lazy load components:**
   ```javascript
   const Editor = lazy(() => import('./pages/Editor'));
   ```

2. **Memoize expensive components:**
   ```javascript
   export default memo(GraphCanvas);
   ```

3. **Optimize canvas rendering:**
   - Only redraw when necessary
   - Use requestAnimationFrame
   - Cache calculations

4. **Reduce bundle size:**
   - Check tree-shake unused imports
   - Use dynamic imports

### Backend Optimization

1. **Index MongoDB fields:**
   ```javascript
   userSchema.index({ email: 1 });
   ```

2. **Cache queries:**
   - Store frequently accessed data
   - Invalidate on updates

3. **Optimize algorithms:**
   - Use appropriate data structures
   - Profile with performance.now()

4. **Connection pooling:**
   - MongoDB handles automatically
   - Configure pool size in connection string

---

## Testing (When Added)

### Unit Tests

```bash
cd backend
npm test

cd ../frontend
npm test
```

### Integration Tests

Test API endpoints with various graph sizes and configurations.

### Manual Testing Checklist

- [ ] Create nodes and edges
- [ ] Run all three algorithms
- [ ] Compare algorithms
- [ ] Export graph
- [ ] Import graph
- [ ] Register/login
- [ ] Save graph to database
- [ ] Load saved graph
- [ ] Delete graph
- [ ] Handle errors gracefully

---

## Deployment Preparation

### Before Deploying

1. **Test thoroughly:**
   - Test all features
   - Test with various data sizes
   - Check for memory leaks

2. **Update environment:**
   ```env
   NODE_ENV=production
   JWT_SECRET=strong-random-key
   MONGODB_URI=production-database-uri
   ```

3. **Security checklist:**
   - [ ] No API keys in code
   - [ ] HTTPS only
   - [ ] CORS properly configured
   - [ ] Input validation
   - [ ] Rate limiting

4. **Performance checklist:**
   - [ ] Minify frontend
   - [ ] Optimize images
   - [ ] Enable gzip compression
   - [ ] Use CDN for static files

---

## Resources

- [React Hooks](https://react.dev/reference/react)
- [Express.js](https://expressjs.com/en/starter/basic-routing.html)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/core/crud/)
- [Zustand Store](https://github.com/pmndrs/zustand)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## Quick Command Reference

```bash
# Setup
npm run setup

# Development
npm run dev

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Build frontend
npm run build

# Git operations
git add .
git commit -m "message"
git push

# Stop servers
Ctrl+C (in terminals)

# Clean and reinstall
npm run setup
rm -rf backend/node_modules frontend/node_modules
npm install
```

---

**Happy coding! 🚀**

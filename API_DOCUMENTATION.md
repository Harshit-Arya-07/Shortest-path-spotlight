# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Register
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error (400):**
```json
{
  "error": "User already exists"
}
```

---

### Login
Authenticate and get JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## Graphs

### Get All Graphs
Retrieve all public graphs (and user's graphs if authenticated).

**Endpoint:** `GET /graphs`

**Headers (Optional):**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Social Network",
    "description": "Sample social network graph",
    "userId": "507f1f77bcf86cd799439012",
    "nodes": [
      {
        "id": "node-1",
        "label": "N1",
        "x": 100,
        "y": 100
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2",
        "weight": 5
      }
    ],
    "isPublic": true,
    "createdAt": "2025-11-11T10:00:00Z",
    "updatedAt": "2025-11-11T10:00:00Z"
  }
]
```

---

### Get Graph by ID
Retrieve a specific graph.

**Endpoint:** `GET /graphs/:id`

**Parameters:**
- `id` (string) - Graph ID

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Social Network",
  "description": "Sample social network graph",
  "userId": "507f1f77bcf86cd799439012",
  "nodes": [...],
  "edges": [...],
  "isPublic": true,
  "createdAt": "2025-11-11T10:00:00Z",
  "updatedAt": "2025-11-11T10:00:00Z"
}
```

---

### Create Graph
Create a new graph (requires authentication).

**Endpoint:** `POST /graphs`

**Headers (Required):**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "My Graph",
  "description": "A sample graph",
  "nodes": [
    {
      "id": "node-1",
      "label": "N1",
      "x": 100,
      "y": 100
    },
    {
      "id": "node-2",
      "label": "N2",
      "x": 200,
      "y": 150
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "weight": 5
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Graph created",
  "graph": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "My Graph",
    "description": "A sample graph",
    "userId": "507f1f77bcf86cd799439012",
    "nodes": [...],
    "edges": [...],
    "isPublic": false,
    "createdAt": "2025-11-11T10:00:00Z",
    "updatedAt": "2025-11-11T10:00:00Z"
  }
}
```

---

### Update Graph
Update an existing graph (requires authentication & ownership).

**Endpoint:** `PUT /graphs/:id`

**Headers (Required):**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Graph Name",
  "description": "Updated description",
  "nodes": [...],
  "edges": [...],
  "isPublic": true
}
```

**Response (200):**
```json
{
  "message": "Graph updated",
  "graph": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Updated Graph Name",
    ...
  }
}
```

---

### Delete Graph
Delete a graph (requires authentication & ownership).

**Endpoint:** `DELETE /graphs/:id`

**Headers (Required):**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Graph deleted"
}
```

**Error (403):**
```json
{
  "error": "Not authorized to delete this graph"
}
```

---

## Algorithms

### Run Algorithm
Execute a single shortest path algorithm on a graph.

**Endpoint:** `POST /graphs/algorithms/run`

**Request Body:**
```json
{
  "graphId": "507f1f77bcf86cd799439011",
  "algorithm": "dijkstra",
  "startNodeId": "node-1",
  "endNodeId": "node-3"
}
```

**Algorithm Options:**
- `dijkstra` - Dijkstra's Algorithm
- `bellmanFord` - Bellman-Ford Algorithm
- `aStar` - A* Algorithm (requires endNodeId)

**Response (200):**
```json
{
  "algorithm": "dijkstra",
  "executionTime": "2.45",
  "result": {
    "distances": {
      "node-1": 0,
      "node-2": 5,
      "node-3": 10
    },
    "predecessors": {
      "node-1": null,
      "node-2": "node-1",
      "node-3": "node-2"
    },
    "visited": ["node-1", "node-2", "node-3"],
    "visitationOrder": ["node-1", "node-2", "node-3"],
    "pathResult": {
      "path": ["node-1", "node-2", "node-3"],
      "cost": 10
    }
  }
}
```

---

### Compare Algorithms
Execute all three algorithms and compare results.

**Endpoint:** `POST /graphs/algorithms/compare`

**Request Body:**
```json
{
  "graphId": "507f1f77bcf86cd799439011",
  "startNodeId": "node-1",
  "endNodeId": "node-3"
}
```

**Response (200):**
```json
{
  "dijkstra": {
    "executionTime": "1.23",
    "path": ["node-1", "node-2", "node-3"],
    "cost": 10,
    "steps": 3
  },
  "bellmanFord": {
    "executionTime": "3.45",
    "path": ["node-1", "node-2", "node-3"],
    "cost": 10,
    "steps": 12,
    "hasNegativeCycle": false
  },
  "aStar": {
    "executionTime": "0.89",
    "path": ["node-1", "node-2", "node-3"],
    "cost": 10,
    "steps": 3,
    "pathFound": true
  }
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Authentication required or invalid token |
| 403 | Forbidden | Not authorized to perform action |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Example Usage

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Create Graph:**
```bash
curl -X POST http://localhost:5000/api/graphs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Graph",
    "nodes": [...],
    "edges": [...]
  }'
```

**Run Algorithm:**
```bash
curl -X POST http://localhost:5000/api/graphs/algorithms/run \
  -H "Content-Type: application/json" \
  -d '{
    "graphId": "507f1f77bcf86cd799439011",
    "algorithm": "dijkstra",
    "startNodeId": "node-1",
    "endNodeId": "node-3"
  }'
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider implementing:
- Request throttling
- IP-based rate limiting
- User-based rate limiting

---

## CORS

CORS is enabled for all origins. For production, restrict to specific domains:

```javascript
const corsOptions = {
  origin: 'https://yourdomain.com',
  credentials: true
};
```

---

## Best Practices

1. **Always include error handling** in client requests
2. **Use token refresh** for long-lived sessions
3. **Validate input** on both client and server
4. **Use HTTPS** in production
5. **Implement rate limiting** to prevent abuse
6. **Log all API requests** for debugging
7. **Use environment variables** for sensitive data


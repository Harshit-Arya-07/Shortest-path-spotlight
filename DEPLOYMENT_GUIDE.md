# Deployment Guide: Shortest Path Spotlight

Complete guide to deploy the backend and frontend to production.

---

## Table of Contents

1. [Quick Deploy](#quick-deploy)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Quick Deploy

### Option A: Deploy to Railway (Fastest - Recommended for Beginners)

Railway is the fastest way to deploy both backend and frontend with automatic deploys from GitHub.

**Backend on Railway:**
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo → authorize GitHub
5. Railway auto-detects Node.js backend
6. Set environment variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `NODE_ENV` = production
   - `JWT_SECRET` = a strong random string (e.g., `openssl rand -base64 32`)
7. Deploy → Railway generates a public URL (e.g., `https://yourapp-prod.railway.app`)

**Frontend on Railway:**
1. In the same Railway project, click "New" → "GitHub Repo"
2. Select your repo again
3. Set environment variables:
   - `VITE_API_URL` = `https://yourapp-prod.railway.app/api`
4. Railway auto-runs `npm run build` and serves the dist folder
5. Deploy → Railway generates frontend URL (e.g., `https://yourapp-frontend.railway.app`)

---

## Backend Deployment

### Option 1: Railway (Recommended)

See Quick Deploy above.

**Verify Deployment:**
```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"ok"}
```

---

### Option 2: Heroku (with Procfile)

Heroku is free for small projects (note: free tier has limitations).

**Setup:**
1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create Procfile in `backend/` directory:
   ```
   web: node server.js
   ```

**Deploy:**
```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
git push heroku main
```

**Get URL:**
```bash
heroku open
# Your backend is at https://your-app-name.herokuapp.com
```

---

### Option 3: Render

Render offers free tier with automatic deployments.

**Setup:**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Select `backend` directory
5. Fill in:
   - **Name**: `shortest-path-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Set environment variables:
   - `MONGODB_URI` = your MongoDB Atlas string
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = a strong random string
7. Click "Deploy"

**Get URL:** Render shows your public URL after deployment (e.g., `https://shortest-path-backend.onrender.com`)

---

### Option 4: AWS (EC2 + Elastic Beanstalk)

For production-grade hosting with auto-scaling.

**Setup:**
1. Install AWS CLI and EB CLI
2. Go to `backend` directory:
   ```bash
   cd backend
   eb init -p node.js-18
   eb create shortest-path-env
   ```
3. Set environment variables in `.elasticbeanstalk/config.yml` or AWS console
4. Deploy:
   ```bash
   eb deploy
   eb open
   ```

---

### Option 5: Docker + Any Cloud (GCP, Azure, DigitalOcean)

Create a Docker image for maximum portability.

**Create `backend/Dockerfile`:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Build and test locally:**
```bash
cd backend
docker build -t shortest-path-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb+srv://... \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  shortest-path-backend
```

**Deploy to Cloud Run (GCP):**
```bash
gcloud run deploy shortest-path-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=mongodb+srv://...,NODE_ENV=production,JWT_SECRET=...
```

**Deploy to Container Registry (any cloud):**
Push to Docker Hub, then deploy to your cloud provider's container service.

---

## Frontend Deployment

### Option 1: Vercel (Recommended for React + Vite)

Vercel is built for Next.js and Vite apps with automatic deploys.

**Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import GitHub repo
4. Select `frontend` directory as root
5. Set environment variables:
   - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
6. Click "Deploy"

**Auto-Deploy:**
Every push to `main` triggers automatic redeployment.

**Get URL:** Vercel shows your frontend URL (e.g., `https://shortest-path-spotlight.vercel.app`)

---

### Option 2: Netlify

Netlify works great for Vite + React.

**Setup:**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → select repo
4. Set build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variables:
   - `VITE_API_URL` = your backend URL
6. Deploy

**Get URL:** Netlify generates your frontend URL.

---

### Option 3: GitHub Pages (Static, Free)

GitHub Pages hosts your frontend for free (backend must be elsewhere).

**Setup:**
1. Add to `frontend/vite.config.js`:
   ```javascript
   export default {
     base: '/shortest-path-spotlight/',
     // ... rest of config
   }
   ```

2. Add `frontend/.nojekyll` (tells GitHub Pages not to process Jekyll)

3. Deploy script in root `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "cd frontend && npm run build && cd .. && git add -A && git commit -m 'Deploy frontend' && git push"
     }
   }
   ```

4. Push to GitHub → GitHub Actions auto-builds and deploys to `gh-pages` branch

5. Enable GitHub Pages in repo settings → select `gh-pages` branch

---

### Option 4: AWS S3 + CloudFront

For maximum control and performance caching.

**Setup:**
1. Create S3 bucket (name: `shortest-path-frontend`)
2. Enable static website hosting
3. Upload `frontend/dist` contents to bucket
4. Create CloudFront distribution pointing to S3
5. Set environment variable in build:
   ```bash
   VITE_API_URL=https://your-backend-url npm run build
   ```

---

### Option 5: Docker + Container Registry

Same Docker approach as backend (above), but for frontend:

**Create `frontend/Dockerfile`:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN VITE_API_URL=https://your-backend-url npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create `frontend/nginx.conf`:**
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Environment Variables

### Backend (.env for production)

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shortest-path-db

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-random-string-min-32-chars

# CORS (if needed)
FRONTEND_URL=https://your-frontend-domain.com
```

**Generate JWT_SECRET:**
```bash
# On Windows PowerShell:
$([System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char][byte](Get-Random -Minimum 33 -Maximum 126) } | Join-String)))) | Write-Host

# On Linux/Mac:
openssl rand -base64 32
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## Complete Deployment Checklist

### Before Deploying

- [ ] MongoDB Atlas account created with database
- [ ] Connection string copied and secured
- [ ] JWT_SECRET generated and stored safely
- [ ] Backend tested locally: `npm run dev`
- [ ] Frontend builds successfully: `npm run build`
- [ ] All environment variables documented
- [ ] CORS settings verified in backend `server.js`

### Backend Checklist

- [ ] Database connection works in production
- [ ] Health check endpoint responds: `/health`
- [ ] Authentication endpoints work: `/api/auth/register`, `/api/auth/login`
- [ ] API endpoints work: `/api/graphs/*`
- [ ] Error logging configured
- [ ] Monitoring/alerts set up (if available on platform)

### Frontend Checklist

- [ ] API_URL environment variable points to backend
- [ ] Build completes without errors
- [ ] Static assets load correctly
- [ ] Can log in and authenticate
- [ ] Can create nodes and edges
- [ ] Algorithms run and visualize
- [ ] Export/import graphs work
- [ ] Responsive design works on mobile

### Post-Deployment

- [ ] Test full user flow end-to-end
- [ ] Monitor logs for errors
- [ ] Set up automatic backups (MongoDB Atlas)
- [ ] Configure domain names (if using custom domains)
- [ ] Enable HTTPS (all platforms do this automatically)
- [ ] Monitor performance and costs

---

## Step-by-Step: Deploy Everything (Railway Route)

### 1. Prepare Your Code

```bash
cd shortest-path-spotlight
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 2. Create MongoDB Atlas Database

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up free
3. Create a cluster (M0 free tier)
4. Go to Database → Connect
5. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/shortest-path?retryWrites=true&w=majority
   ```

### 3. Deploy Backend to Railway

```bash
# Option A: Via Railway CLI
npm install -g @railway/cli
railway login
railway init
# Select Node.js, accept defaults
# Set variables:
# MONGODB_URI = your-connection-string
# NODE_ENV = production
# JWT_SECRET = openssl rand -base64 32
railway deploy
```

**Or:**
1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Connect your repo
4. Set environment variables in Railway dashboard
5. Deploy

**Get backend URL:**
Railway shows it in the project dashboard (e.g., `https://shortest-path-prod.railway.app`)

### 4. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. "Add new..." → "Project"
3. Import your GitHub repo
4. Set project root to `frontend`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-railway-url/api
   ```
6. Deploy

**Get frontend URL:** Vercel dashboard shows it

### 5. Update and Test

```bash
# Update frontend .env.production locally with backend URL
echo "VITE_API_URL=https://your-backend-url/api" > frontend/.env.production

# Test in browser
# Frontend: https://your-frontend-vercel-url
# Backend: https://your-backend-railway-url/health
```

---

## Monitoring & Troubleshooting

### Backend Issues

**Symptoms: Backend endpoint returns 500 error**

```bash
# Check logs on Railway/Heroku/Render:
# - Look for database connection errors
# - Check JWT_SECRET is set
# - Verify MONGODB_URI is correct

# Test locally:
MONGODB_URI=your-string NODE_ENV=production npm start
```

**Symptoms: CORS errors in browser**

```javascript
// In backend/server.js, verify CORS is configured:
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

**Symptoms: 401 Unauthorized on protected routes**

```bash
# Verify JWT_SECRET matches between local and production
# Check token is being sent in Authorization header
# curl -H "Authorization: Bearer TOKEN" https://your-backend-url/api/graphs
```

### Frontend Issues

**Symptoms: API calls fail with 404**

```javascript
// Check VITE_API_URL is correct in browser DevTools:
// Network tab → see actual URL being called
// Should be: https://your-backend-url/api/...
```

**Symptoms: Blank page or 404 on frontend URL**

- Verify build directory is set correctly (usually `dist` for Vite)
- Check environment variables were passed at build time
- Verify static assets are loading (check DevTools Network tab)

---

## Cost Estimates (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Railway | Free-$5 | $5 / 1GB RAM |
| Vercel | Free | Free for 1 deployment/week |
| MongoDB Atlas | Free (M0) | 512MB storage, then $57+ |
| Netlify | Free | Free tier sufficient |
| Heroku | Discontinued free | Now $5-50+ |
| AWS | ~$10-50 | EC2 + S3 |

**Budget Option:** Railway ($5) + Vercel (Free) + MongoDB Atlas (Free) = **~$5/month**

---

## Next Steps

1. Choose your deployment platform (Railway recommended)
2. Set up MongoDB Atlas
3. Deploy backend
4. Deploy frontend with backend URL
5. Test end-to-end
6. Monitor logs for errors
7. Set up automatic backups

---

## Helpful Resources

- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Docs](https://render.com/docs)
- [Express Deployment](https://expressjs.com/en/advanced/best-practice-deployment.html)

---

**Questions? Check the logs on your deployment platform dashboard for detailed error messages.**


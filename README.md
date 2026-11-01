# TechFest 2026

Simple React + Express + MongoDB portal. React and the API share one Render service, so authentication cookies remain same-origin.

## Run locally

Use Node 22.16 or newer. Copy `backend/.env.example` to `backend/.env`, set an Atlas URI ending in `/techfest2026` and a random JWT secret of at least 32 characters. Do not commit secrets.

```sh
npm ci --prefix backend
npm ci --prefix frontend
cd backend
node seed.js
npm start
```

In another terminal run `npm run dev --prefix frontend`. Open http://localhost:5173. The Vite proxy forwards `/api` to port 5000. Create an account, log in, browse events and register. Account registration never grants admin privileges.

## Verify

```sh
npm test --prefix backend
npm run build --prefix frontend
npm audit --omit=dev --prefix backend
npm audit --prefix frontend
```

Tests use mocked user queries; they do not prove live MongoDB persistence or transaction concurrency. Event bookings require Atlas or another replica set because seat decrement and unique registration commit in one transaction.

## Deploy

Use `render.yaml` or configure a free Node web service from **Sabareesh-pr/wt-lab**, branch main. Build: `npm ci --include=dev --prefix backend && npm test --prefix backend && npm ci --include=dev --prefix frontend && npm run build --prefix frontend`. Start: `npm start --prefix backend`. Health check: `/api/health`.

Set NODE_ENV=production, MONGO_URI to the dedicated Atlas database, JWT_SECRET to a random value of at least 32 characters, and APP_ORIGIN to the exact HTTPS service origin with no trailing slash. Allow only the needed Render outbound addresses in Atlas. Run the seed locally against that database once.

CI installs locked dependencies, runs tests and builds React. Render is configured with **After CI Checks Pass**, so successful main-branch checks trigger deployment after the service is created. No deployment-hook secret is needed. This matches Render's [Blueprint reference](https://render.com/docs/blueprint-spec#autodeploytrigger). No cloud deployment is implied by a successful local build.

Rollback: redeploy the previous successful Render deployment. This update does not modify existing collection data. JWTs expire after two hours; logout clears the browser cookie but does not revoke a copied token before expiry.

See [deployment report](docs/deployment-report.md) for evidence and pending cloud checks.

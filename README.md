# TechFest 2026

Simple React + Express + MongoDB portal, deployed as one Vercel project.

**Live:** https://techfest2026-wt-lab.vercel.app

## Run locally

Use Node 22. Copy backend/.env.example to backend/.env and set the actual Atlas MONGO_URI, a random JWT_SECRET of at least 32 characters, APP_ORIGIN=http://localhost:5173 and NODE_ENV=development. Percent-encode special characters in database credentials. The literal word `password` is not a default Atlas password. Never commit .env.

```sh
npm ci --prefix backend
npm ci --prefix frontend
cd backend
node seed.js
npm start
```

In another terminal, run `npm run dev --prefix frontend` from the repository root. Open http://localhost:5173. Create an account, log in and register for an event. Account signup does not grant admin privileges.

## Checks

```sh
npm run build
npm audit --omit=dev --prefix backend
npm audit --prefix frontend
node scripts/smoke-live.cjs https://techfest2026-wt-lab.vercel.app
```

The build runs eleven backend security/serverless tests and builds React. The live smoke script creates a synthetic account and a free-event booking. Unit tests mock database calls; the live smoke evidence confirms actual Atlas persistence. Transactions require Atlas or another MongoDB replica set.

## Vercel deployment

Import **Sabareesh-pr/wt-lab**, keep the root directory as `./`, and choose the **Other** preset. vercel.json installs both packages, runs tests, builds React, serves frontend/dist and routes /api/* to the Express function. Page refreshes fall back to index.html. The same origin handles authentication and API traffic.

Set these sensitive environment variables in Vercel:

- MONGO_URI: the verified Atlas URI for techfest2026, with encoded credentials.
- JWT_SECRET: at least 32 random characters.
- APP_ORIGIN: https://techfest2026-wt-lab.vercel.app (no trailing slash).
- NODE_ENV: production.

Do not set PORT on Vercel. Re-deploy after changing environment variables. GitHub Actions checks pushes and pull requests; Vercel automatically builds and deploys main and also runs tests in its own build. Warm functions reuse a small MongoDB pool. Request counters are per function instance.

Render's optional alternative configuration remains in render.yaml; it is not the selected live deployment. Roll back using the previous successful Vercel deployment. Logout clears the cookie, but a copied JWT expires after two hours.

See the [deployment report](docs/deployment-report.md) for architecture, screenshots, measured Lighthouse results, CI and live verification evidence, and remaining limitations.

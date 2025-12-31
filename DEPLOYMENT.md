# Deployment guide

This document gives quick steps to deploy the URL Shortener (backend + frontend) as a combined app or separately.

## Environment
- Create `.env` files from the `.env.example` files in `backend/` and `frontend/` and set the correct values.

## Combined deploy (single server serves frontend)
- Ensure `backend/package.json` has the `postinstall` script (it will build the frontend during deploy).
- Set `MONGO_URL`, `PORT`, `FRONTEND_URL`, and `BASE_URL` in the environment.
- Example run (development):
  - In `backend/`: `npm run dev`
  - Or: `npm start` to run `node server.js` (production)

## Deploying separately
- Host frontend on Vercel/Netlify: set `VITE_BACKEND_URL` to your backend URL and run the build.
- Host backend on Render/Heroku: ensure `MONGO_URL`, `PORT`, and `BASE_URL` are set.

## Notes
- The backend serves the frontend static files if `frontend/dist` exists after build.
- A `/health` endpoint is available for simple health checks.

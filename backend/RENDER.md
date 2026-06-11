# Deploy Backend to Render

This API uses **JSON files** for storage (`letters.json`, `admin_config.json`), not SQLite.
On Render's free tier the filesystem is **ephemeral** — data survives restarts but may reset on redeploy.
For durable storage, attach a [Render persistent disk](https://render.com/docs/disks) and set `DATA_DIR=/var/data`.

## 1. Create the Web Service

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Connect the `LetterLibraryWebsite` repository.
4. Render reads `render.yaml` at the repo root.
5. When prompted, set **ADMIN_PASSWORD** (and optionally **OPENAI_API_KEY**).

### Option B — Manual Web Service

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Runtime** | Python 3 |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Health Check Path** | `/health` |

## 2. Environment Variables (Render Dashboard)

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `OPENAI_API_KEY` | No | Enables AI letter generation |
| `OPENAI_MODEL` | No | Default: `gpt-4o-mini` |
| `DATA_DIR` | No | Persistent disk path, e.g. `/var/data` |
| `CORS_ORIGINS` | No | Extra origins, comma-separated |

Render sets `PORT` automatically — do not override it.

## 3. Connect GitHub Pages Frontend

After deploy, copy your Render URL (e.g. `https://letter-library-api.onrender.com`).

In GitHub → **Settings** → **Secrets and variables** → **Actions**, add:

| Secret | Example value |
|--------|----------------|
| `VITE_API_URL` | `https://letter-library-api.onrender.com` |

Push to `main` (or re-run the **Deploy to GitHub Pages** workflow).

With `VITE_API_URL` set:

- `VITE_USE_STATIC_DATA` becomes `false` in CI
- The live site uses the Render API
- Full admin delete and password change work via the backend

You can remove `VITE_ADMIN_PASSWORD` once the API handles admin auth.

## 4. Verify

1. Open `https://YOUR-SERVICE.onrender.com/health` → `{"status":"ok"}`
2. Open `https://YOUR-SERVICE.onrender.com/docs` → Swagger UI
3. Open your GitHub Pages site → create/delete a letter as admin

## 5. Local vs Production

| | Local (`python run.py`) | Render |
|--|-------------------------|--------|
| Host | `127.0.0.1` | `0.0.0.0` |
| Port | Auto (8081…) | `$PORT` from Render |
| Data | `backend/app/data/` | Same, or `DATA_DIR` on disk |

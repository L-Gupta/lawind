# LawInd — Local Setup Guide

Get the repo running on your machine in a few minutes. This covers frontend, backend, and optional local services (Postgres, Qdrant).

---

## Prerequisites

Install these before you begin:

| Tool | Version | Check |
|------|---------|-------|
| **Git** | latest | `git --version` |
| **Node.js** | 20+ | `node --version` |
| **npm** | 10+ | `npm --version` |
| **Python** | 3.12+ | `python --version` |
| **Docker** (optional) | latest | `docker --version` |

> Docker is only needed if you want local Postgres or Qdrant. The app runs without it for basic frontend/backend development.

---

## 1. Clone the repository

```bash
git clone https://github.com/L-Gupta/lawind.git
cd lawind
```

---

## 2. Environment variables

Copy the example env file and create a frontend-specific one:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
Copy-Item .env backend\.env
"NEXT_PUBLIC_API_URL=http://localhost:8500" | Out-File -Encoding utf8 frontend\.env.local
```

**macOS / Linux:**
```bash
cp .env.example .env
cp .env backend/.env
echo "NEXT_PUBLIC_API_URL=http://localhost:8500" > frontend/.env.local
```

You do not need to fill in API keys, AWS, or database credentials for local development. Defaults are enough to start the servers.

---

## 3. Install dependencies

### Backend (Python)

Create a virtual environment at the **repo root** (required by `start.bat` on Windows):

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r backend\requirements.txt
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

### Frontend (Node.js)

```bash
cd frontend
npm install
cd ..
```

Or from the repo root using Make:

```bash
make install
```

---

## 4. Start the development servers

### Option A — Windows quick start

Double-click or run from the repo root:

```powershell
.\start.bat
```

This opens two terminals:
- **Backend** → http://localhost:8500 (API docs at `/docs`)
- **Frontend** → http://localhost:8600

### Option B — Manual (all platforms)

Open **two terminals** from the repo root.

**Terminal 1 — Backend:**
```bash
# Activate venv first
source venv/bin/activate        # macOS/Linux
# .\venv\Scripts\activate       # Windows

cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8500
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### Option C — Make

```bash
make dev-api    # terminal 1
make dev-web    # terminal 2
```

---

## 5. Verify everything works

| Service | URL | Expected |
|---------|-----|----------|
| Frontend | http://localhost:8600 | LawInd marketing site loads |
| Backend root | http://localhost:8500 | `{ "message": "Lawind AI API", "status": "running" }` |
| Health check | http://localhost:8500/health | `{ "status": "healthy" }` |
| API docs | http://localhost:8500/docs | Swagger UI |

---

## 6. Optional — Local database services

When you need Postgres or Qdrant (future features):

```bash
docker compose up -d
```

| Service | URL |
|---------|-----|
| PostgreSQL | `localhost:5432` (user: `postgres`, password: `postgres`, db: `lawind`) |
| Qdrant | http://localhost:6333 |

Stop services:

```bash
docker compose down
```

---

## Project structure

```
lawind/
├── frontend/          # Next.js app (port 8600)
├── backend/           # FastAPI app (port 8500)
├── .env.example       # Environment template
├── start.bat          # Windows dev launcher
├── Makefile           # Install / dev shortcuts
├── docker-compose.yml # Postgres + Qdrant
├── STARTUP.md         # This file
├── README.md          # Product overview
├── STEPS.md           # Development roadmap
└── architecture.md    # Target repo layout
```

---

## Common commands

Run from the **repo root** unless noted.

| Command | Description |
|---------|-------------|
| `make install` | Install backend + frontend dependencies |
| `make dev-api` | Start FastAPI with hot reload |
| `make dev-web` | Start Next.js dev server |
| `make build` | Production build of frontend |
| `make lint` | ESLint on frontend |
| `make docker-up` | Start Postgres + Qdrant |
| `make docker-down` | Stop Docker services |

**Frontend only** (from `frontend/`):

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 8600 |
| `npm run build` | Production build |
| `npm run lint` | Lint |
| `npm run start` | Serve production build |

---

## Troubleshooting

### `start.bat` fails — venv not found

Create the virtual environment at the repo root (see step 3), then run `start.bat` again.

### Backend import errors

Make sure the venv is activated and dependencies are installed:

```bash
pip install -r backend/requirements.txt
```

Run uvicorn from the `backend/` directory:

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8500
```

### Port already in use

- Frontend uses **8600** — change in `frontend/package.json` if needed
- Backend uses **8500** — change with `--port` on uvicorn

### Frontend env not picked up

Confirm `frontend/.env.local` exists with:

```
NEXT_PUBLIC_API_URL=http://localhost:8500
```

Restart the Next.js dev server after changing env files.

### `pip install` is slow or fails on AI packages

The full `backend/requirements.txt` includes ML/LLM libraries. For basic API work, the install should still succeed; if you hit issues on a slow connection, retry or use a faster network.

---

## Next steps for contributors

1. Read [README.md](README.md) for product context
2. Read [STEPS.md](STEPS.md) for the development roadmap
3. Read [architecture.md](architecture.md) for the target monorepo layout
4. Pick a task from the roadmap and open a PR against `main`

For deployment instructions, see [deploy.ps1](deploy.ps1).

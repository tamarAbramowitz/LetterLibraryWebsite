# Letter Library

A modern, responsive web application for browsing beautiful personal letter templates. Built with React + TypeScript on the frontend and FastAPI on the backend.

## Live Website

**https://tamarAbramowitz.github.io/LetterLibraryWebsite/**

The live site is hosted on GitHub Pages and updates automatically when you push to the `main` branch.

## Features

- **Home Page** — Hero section, search, category filters, responsive card grid, letter count
- **Letter Details** — Full letter content, illustration, reading time, share & favorite buttons
- **About Page** — Mission, how it works, feature overview
- **Bonus** — Favorites (local storage), dark mode, reading progress bar, pagination, page transitions, animated illustrations

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── data/letters.json      # Mock letter data
│   │   ├── models/                # Domain models
│   │   ├── routers/               # API route handlers
│   │   ├── schemas/               # Pydantic schemas
│   │   ├── services/              # Business logic
│   │   └── main.py                # FastAPI entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                   # API client
│   │   ├── components/            # Reusable UI components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page components
│   │   ├── styles/                # CSS variables & globals
│   │   ├── types/                 # TypeScript interfaces
│   │   └── utils/                 # Utility functions
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
```

On Windows PowerShell, you can also run:

```powershell
.\start.ps1
```

API docs: http://localhost:8080/docs

> **WinError 10013?** This usually means the port is already in use by a leftover server. Run `.\start.ps1` in the `backend` folder — it stops old Python servers and starts fresh on port **8080**.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/letters`            | List letters (search, filter, page)  |
| GET    | `/letters/{id}`       | Get a single letter by ID            |
| GET    | `/letters/categories` | List all categories                  |
| GET    | `/health`             | Health check                         |

### Query Parameters for `/letters`

- `search` — Filter by title, description, content, or category
- `category` — Filter by exact category name
- `page` — Page number (default: 1)
- `page_size` — Items per page (default: 12, max: 50)

## Tech Stack

- **Frontend:** React 19, TypeScript, React Router, Vite
- **Backend:** FastAPI, Pydantic, Uvicorn
- **Styling:** Custom CSS with CSS variables, Google Fonts (Inter + Lora)

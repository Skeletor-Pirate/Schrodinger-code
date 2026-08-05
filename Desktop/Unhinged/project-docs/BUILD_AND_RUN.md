# Build and Run Guide

## Prerequisites

- Node.js 20 LTS (or compatible Node runtime)
- Docker Desktop with Docker Compose
- Git
- Google OAuth credentials and OpenAI API key (for testing live integrations)

## Local Environment Setup

1. Copy `.env.example` to `.env` at the repository root.
2. Populate required variables following [MANUAL_INPUT_REQUIRED.md](MANUAL_INPUT_REQUIRED.md). Never commit `.env`.
3. Start full stack via Docker Compose:

```powershell
docker compose up --build
```

4. Frontend available at `http://localhost:3001` (or `http://localhost:3000`); API health check at `http://localhost:3000/health`.

## Frontend Development

```powershell
cd unhinged-web
npm install
npm run dev
```

## Backend Services

```powershell
cd backend
npm install
node server.js
```

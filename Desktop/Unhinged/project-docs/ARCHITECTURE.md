# UNHINGED Architecture

## Overview

```text
Next.js / React frontend
  └─ Browser desktop shell and future app screens
       └─ Express API
            ├─ Workspace, user, group, agent, plugin, audit and compliance services
            ├─ Orbit and Icebound agent pipelines
            ├─ RAG service (Python): embeddings, ChromaDB, BM25, vault indexing
            └─ Security service (Rust): password hashing, JWT, AES-GCM, validation

Data layer
  ├─ PostgreSQL + Prisma: application data
  ├─ Redis: intended sessions/cache
  ├─ MinIO: object storage
  ├─ ChromaDB: vector index
  └─ Vault files: knowledge and agent logs
```

## Frontend

`unhinged-web/` uses Next.js 16, React 19, TypeScript, Zustand, React RND, Framer Motion, and Lucide. The current UI implements the desktop environment: startup animation, taskbar, start menu, icons, and window management. App entries for chat, agents, files, admin, search, settings, marketplace, and hackathons are currently definitions/window-launch targets; most still require working screens and API integration.

## API and services

`backend/server.js` runs Express with Helmet, CORS, body parsing, rate limiting, health checks, and service routes. The backend has service modules for users, workspaces, groups, agents, plugins, audit logs, compliance, vault sync, conflict resolution, and plugin security.

Orbit and Icebound contain multi-stage flows for scope checking, policy checks, trigger evaluation, persona selection, memory retrieval, tool planning/execution, response composition, auditing, feedback, and vault writes. Several tools/integrations remain mocked or need end-to-end validation.

## Data and AI

- PostgreSQL/Prisma: users, workspaces, audit data, and application records.
- Redis: planned/expected session storage and caching.
- MinIO: configured object storage for files and attachments; application integration needs completing.
- RAG: Python FastAPI service that uses sentence-transformer embeddings, ChromaDB persistence, BM25 keyword search, and vault watching.
- Rust security service: HTTP endpoints for bcrypt, JWT, AES-256-GCM, secure random values, and validation.

## Local runtime ports

| Service | Port |
| --- | ---: |
| Frontend | 3001 |
| Backend API | 3000 |
| PostgreSQL | 5432 |
| Redis | 6379 |
| MinIO API / console | 9000 / 9001 |
| RAG | 8001 |
| Security service | 8002 |

## Production readiness note

The project documentation describes OAuth and Redis sessions, but the active `backend/server.js` does not presently mount the Passport/session configuration or authentication middleware. Authentication, role checks, workspace scoping, restrictive CORS, secrets, testing, monitoring, backups, and deployment safety must be finished and verified before public deployment.

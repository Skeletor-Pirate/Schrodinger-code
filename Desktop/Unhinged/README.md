# UNHINGED Platform

> **A Next-Gen Collaborative Operating System & Multi-Agent Workspace in the Browser.**

UNHINGED fuses an interactive desktop environment with powerful AI autonomous agents, vector RAG document storage, and admin microservices.

---

## 🌟 Key Features

- 🖥️ **Desktop OS Interface**: Interactive Web Desktop with animated boot sequence, taskbar, start menu, draggable/resizable windows, and sound effects.
- 🤖 **Multi-Agent Orchestration**:
  - **Orbit Agent**: Task execution, summaries, and collaborative team assistant.
  - **Icebound Agent**: Code analysis, problem-solving, and deep technical agent pipelines.
- 🧠 **Vault & RAG Knowledge Base**: Vector search over markdown knowledge bases (FastAPI + Chroma/Pinecone + MinIO).
- 🛡️ **Admin Microservices & Security**: User & workspace management, group permissions, audit logging, GDPR compliance, and path traversal protected agent tools.
- ⚡ **Modern Stack**: Next.js 16 (Turbopack), Tailwind CSS v4, Express Node.js, Prisma ORM, PostgreSQL, Redis, and Docker Compose.

---

## 🏗️ Tech Stack

| Domain | Technologies |
| --- | --- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Zustand |
| **Backend** | Node.js, Express, Passport.js OAuth 2.0, Helmet, Rate Limiting |
| **Data & ORM** | PostgreSQL, Prisma ORM, Redis, MinIO Object Storage |
| **AI & RAG** | Python FastAPI, OpenAI Embeddings, Markdown Vault Storage |
| **Infrastructure** | Docker, Docker Compose, Kubernetes manifests |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js 20+**
- **Docker Desktop**

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
Follow the configuration guide in [project-docs/MANUAL_INPUT_REQUIRED.md](project-docs/MANUAL_INPUT_REQUIRED.md) to set your database URL, Google OAuth secrets, and API keys.

### 3. Run Web Development Server

```bash
cd unhinged-web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Full Stack via Docker

```bash
docker compose up --build
```

---

## 📁 Repository Structure

```
Unhinged/
├── unhinged-web/        # Next.js 16 Frontend Web Application (Desktop Shell)
├── backend/             # Express.js Backend Microservices & Agent Tools
│   ├── agents/          # Orbit & Icebound Agent Node Pipelines
│   ├── services/        # User, Workspace, Audit, Compliance, & Vault Services
│   ├── passport-config.js
│   └── server.js
├── prisma/              # Prisma Schema & Database Migrations
├── project-docs/        # Comprehensive System & API Documentation
│   ├── MANUAL_INPUT_REQUIRED.md
│   ├── ARCHITECTURE.md
│   ├── BUILD_AND_RUN.md
│   ├── SECURITY.md
│   ├── AGENTS.md
│   ├── SITE_OVERVIEW.md
│   └── STATUS_AND_ROADMAP.md
├── docker-compose.yml   # Multi-container orchestration config
├── Makefile             # Automation targets
└── README.md            # Repository Master Overview
```

---

## 🔒 Security & Privacy

- `.env` and sensitive credentials are model-isolated and enforced via root `.gitignore`.
- All agent file system interactions use safe path resolution (`resolveSafeVaultPath`) to prevent directory traversal attacks.
- OWASP-compliant security headers (`helmet`) and rate-limiting endpoints.

---

## 📖 Documentation

For detailed guides, refer to the [project-docs/](project-docs/):
- [Architecture Specifications](project-docs/ARCHITECTURE.md)
- [Environment Configuration Guide](project-docs/MANUAL_INPUT_REQUIRED.md)
- [Build and Run Reference](project-docs/BUILD_AND_RUN.md)
- [Security Guidelines](project-docs/SECURITY.md)

---

## 📄 License
ISC License © 2026 UNHINGED Platform.

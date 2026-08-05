# Status and Roadmap

## What exists in the repository

| Area | Current state |
| --- | --- |
| Web UI | Windows-inspired desktop shell: boot sequence, taskbar, start menu, icons, and window behavior. |
| Backend | Express API routes and service modules for users, workspaces, groups, agents, plugins, audit, compliance, vault sync, and plugin security. |
| Agents | Orbit and Icebound pipeline/source foundations, memory/tool abstractions, and vault/RAG integration points. |
| Data | Prisma schema plus Compose services for PostgreSQL, Redis, and MinIO. |
| Intelligence | Python RAG service with embeddings, ChromaDB, BM25, and vault watcher source. |
| Security service | Rust service source for bcrypt, JWT, AES-GCM, random values, and validation. |
| Deployment | Dockerfiles, Docker Compose, and Kubernetes base manifests. |

## What is not complete

- Functional product screens for chat, workspaces, tasks, files, knowledge search, admin, settings, plugins, and notifications.
- Verified API authentication, session wiring, role-based authorization, and workspace/tenant isolation.
- Real implementations for every agent tool and external integration.
- End-to-end testing, CI/CD, production secrets, backup/recovery, monitoring, and incident runbooks.
- A production Kubernetes overlay; the Makefile references one that is not present.

## Release-critical work

1. Finish route authentication, role checks, workspace scoping, secure CORS, and first-admin/onboarding flow.
2. Resolve documented path traversal risks; add server-side input validation, output sanitization, and secure error handling.
3. Replace default infrastructure credentials; store production secrets safely; test database migrations, backups, and restores.
4. Build and test core user workflows: login, workspace access, chat/task/file actions, knowledge search, and permissions.
5. Add CI, dependency/image scanning, structured/redacted logs, metrics, alerting, health checks, and deployment runbooks.

## Product delivery sequence

1. Security and data foundations.
2. Verified authentication, authorization, and tenancy.
3. Chat/workspace/files/search user interfaces connected to stable APIs.
4. Real storage, notification, search, and agent-tool integrations.
5. Admin console and real-time collaboration.
6. Tests, CI/CD, monitoring, backups, accessibility, mobile support, and performance work.
7. Plugins, marketplace, custom agents, and advanced enterprise features.

## Documentation inconsistencies to fix

- Some old notes say OAuth and Redis sessions are complete, but the active backend entry point does not mount Passport/session middleware.
- The frontend README references Next.js 14+, while the package uses Next.js 16.
- Root Makefile commands do not all match scripts declared in the backend/frontend packages.
- OAuth callback and frontend/backend port guidance needs one consistent configuration.

This document is intentionally evidence-based: verify each milestone with tests before marking it complete.

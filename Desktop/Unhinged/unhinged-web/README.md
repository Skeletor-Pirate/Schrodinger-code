# UNHINGED - AI-Powered Team Collaboration Platform

## Overview

UNHINGED is an advanced AI-powered team collaboration platform that combines multi-agent AI systems, retrieval-augmented generation (RAG), and secure authentication to create a powerful workspace for teams. The platform features a futuristic Windows-inspired web operating system interface with AI agents that assist users in various tasks.

## Key Features

### 🖥️ Futuristic Web OS Interface
- Windows-inspired desktop environment in the browser
- Taskbar with start menu, system tray, and application launcher
- Window management (resize, minimize, maximize, close)
- Desktop icons and start menu with search functionality
- Animated startup sequence with custom "Uh" logo and sound
- Glassmorphism design effects throughout the interface
- Responsive layout that works on desktop and tablet devices

### 🤖 Multi-Agent AI System
- **Orbit Agent**: General-purpose AI assistant for task management, scheduling, and collaboration
- **Icebound Agent**: Specialized agent for technical tasks, code-related workflows, and development assistance
- **LangGraph Orchestration**: Advanced workflow management with state persistence and conditional logic
- **Memory Systems**: 
  - Short-term memory for conversation context
  - Long-term memory using vector embeddings for knowledge retention
  - Automatic memory summarization for efficiency

### 🧠 Knowledge Intelligence
- **RAG Service**: Combines semantic search (sentence-transformer embeddings) with keyword search (BM25)
- **Obsidian Vault Integration**: Real-time synchronization with personal knowledge bases
- **Hybrid Search**: Vector similarity + keyword matching for optimal knowledge retrieval
- **Continuous Learning**: Agents learn from interactions and store insights in the vault

### 🔐 Security & Authentication
- **Google OAuth 2.0**: Secure, industry-standard authentication with Google accounts
- **Redis Sessions**: Encrypted, expiring sessions with automatic renewal (10-minute timeout)
- **Rust Security Service**: Cryptographic primitives including:
  - Bcrypt password hashing with configurable strength
  - JWT token generation and validation
  - AES-256-GCM encryption/decryption for sensitive data
  - Cryptographically secure random number generation
  - Input validation (email, username, safe strings)
- **Role-Based Access Control**: Admin, moderator, member, and guest roles with fine-grained permissions
- **Principle of Least Privilege**: Users only get access to what they need

### ⚙️ Technical Architecture
- **Frontend**: Next.js 14+ App Router with React Server Components
- **Backend**: Node.js/Express microservices architecture
- **Database**: PostgreSQL with Prisma ORM for data persistence
- **Caching**: Redis for session storage and temporary data
- **Object Storage**: MinIO for file uploads, attachments, and vault storage
- **Knowledge Base**: ChromaDB for vector storage + BM25 for keyword search
- **Containerization**: Docker multi-stage builds for all services
- **Orchestration**: Docker-compose for local development, Kubernetes manifests for production

## System Components

### Frontend (`unhinged-web/`)
- Next.js App Router implementation
- Windows-style desktop environment with taskbar, start menu, and window management
- Custom components for window management, taskbar, start menu, and system tray
- Animated startup sequence with audio
- Glassmorphism UI effects
- Responsive design
- Admin panel framework (implementation in progress)

### Backend Services
- **User Management Service**: CRUD operations, role-based access, authentication integration
- **Workspace Management Service**: Creation and management of workspaces for team collaboration
- **Audit Log Service**: Database-backed logging of all user and system actions
- **Agent Management Service**: Controls agent lifecycle and tool permissions
- **Group Management Service**: Organization of users into groups and teams
- **Plugin Management Service**: Discovery and management of extensible plugins
- **Compliance Service**: Regulatory compliance tracking and reporting
- **Vault Sync Worker**: Synchronizes agent interactions with Obsidian vault
- **Conflict Resolution Service**: Handles conflicts in collaborative editing
- **Plugin Security Service**: Sandboxing and security checks for plugins

### AI & Intelligence Services
- **RAG Service** (`backend/services/rag-service/`):
  - Python/FastAPI service for retrieval-augmented generation
  - Sentence transformer embeddings (all-MiniLM-L6-v2)
  - ChromaDB vector storage with persistence
  - BM25 keyword search for hybrid capabilities
  - File system watcher for real-time Obsidian vault indexing
- **Security Service** (`backend/security-service/`):
  - Rust implementation of cryptographic primitives
  - Actix-web HTTP API exposing security functions
  - Password hashing/verification (bcrypt)
  - JWT token generation/validation
  - AES-256-GCM encryption/decryption
  - Input validation utilities
- **Agent System**:
  - Orbit and Icebound agents using LangGraph orchestration
  - Memory retrieval from RAG service
  - Vault writing for audit and learning
  - Tool execution framework with permission checking

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- Docker and Docker Compose
- PostgreSQL
- Redis
- Google Cloud Console account (for OAuth 2.0)
- Git

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/FROSTY-MUG/UnHinged.git
   cd UnHinged/unhinged-web
   ```

2. Copy environment example file:
   ```bash
   cp ../.env.example .env.local
   ```

3. Edit `.env.local` with your configuration:
   - Database connection (POSTGRES_URL)
   - Redis configuration (REDIS_URL)
   - MinIO settings (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY)
   - Google OAuth 2.0 credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
   - JWT secrets (JWT_SECRET)
   - Encryption keys (ENCRYPTION_KEY)
   - Email service credentials (for notifications)
   - Optional API keys (search services, etc.)

### Installation & Development
```bash
# Install dependencies
npm install

# Start required services (PostgreSQL, Redis, MinIO)
docker-compose up -d

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production
```bash
# Create production build
npm run build

# Start production server
npm start
```

## Documentation

- [Architecture Overview](docs/readme.architecture.md) - Detailed system design and component interactions
- [Agent System](docs/readme.agents.md) - In-depth look at the multi-agent AI architecture
- [Security Policy](claudedocs/SECURITY.md) - Comprehensive security practices and policies
- [Implementation Progress](claudedocs/IMPLEMENTATION_PROGRESS.md) - Current development status
- [TODO Checklist](claudedocs/TODO_CHECKLIST.md) - Pending tasks and milestones
- [Backend Documentation](../backend/README.md) - Backend-specific implementation details

## Security

UNHINGED prioritizes security at every level. Please see our [Security Policy](claudedocs/SECURITY.md) for details on:

- Authentication and authorization practices
- Data protection measures (encryption at rest and in transit)
- Application security controls (input validation, output encoding)
- Infrastructure security (network segmentation, host security)
- Vulnerability reporting procedures

**To report a security vulnerability**, please email: security@unhinged.com

## Contributing

We welcome contributions from the community! Please see our contributing guidelines for:

1. Fork the repository and create your branch
2. Make your changes following our coding standards
3. Ensure all tests pass
4. Submit a pull request with a clear description of changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions, support, or collaboration inquiries:
- Open an issue on GitHub
- Email: contact@unhinged.com
- Visit: https://unhinged.com

---

*Built with ❤️ by the UNHINGED Team*
*Join us in revolutionizing team collaboration with AI*
# UNHINGED System Architecture

## Overview

UNHINGED follows a microservices architecture with clearly separated concerns between frontend, backend services, and specialized AI services. The platform is designed for scalability, maintainability, and security while providing a seamless user experience through its futuristic web operating system interface.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           UNHINGED Platform                          │
├───────────────┬───────────────────────┬─────────────────────────────┤
│               │                       │                             │
│  Frontend     │  Backend Services       │  AI & Intelligence Services   │
│  (Web OS)     │  (Node.js/Express)     │  (Python/Rust)               │
│               │                       │                             │
├───────────────┴───────────────────────┴─────────────────────────────┤
│                           Infrastructure Layer                       │
├───────────────┬───────────────────────┬─────────────────────────────┤
│               │                       │                             │
│  Container    │  Data Storage         │  External Services          │
│  Orchestration│  & Caching            │  & APIs                     │
│  (Docker/K8s) │                       │                             │
│               ├───┬───────┬───────────┤                             │
│               │   │       │           │                             │
│               │ PostgreSQL Redis    MinIO   Google OAuth  Search APIs │
│               │   │       │           │                             │
└───────────────┴───┴───────┴───────────┴─────────────────────────────┘
```

## Frontend Architecture (`unhinged-web/`)

### Technology Stack
- **Web OS**`)

### Core Principles
- **Windows-Inspired Desktop Environment**: Familiar interface with modern enhancements
- **React Server Components**: Default rendering strategy for performance and SEO
- **App Router**: Next.js 14+ file-based routing with layouts and loading states
- **State Management**: Zustand store for desktop state (windows, taskbar, etc.)
- **Styling**: CSS Modules with CSS variables for theming
- **Assets**: Optimized with next/image, next/font

### Key Components
1. **Desktop Environment**
   - `src/app/layout.tsx`: Root layout with global providers
   - `src/app/page.tsx`: Main desktop interface
   - `src/components/desktop/`: Window management, taskbar, start menu

2. **Window System**
   - Draggable, resizable windows with minimize/maximize/close
   - Window state management (position, size, z-index)
   - Window restoration from previous sessions

3. **Taskbar & Start Menu**
   - Application launcher with search
   - System tray for notifications and status
   - Quick access to frequently used apps
   - Clock and date display

4. **Animated Startup Sequence**
   - Custom "Uh" logo animation
   - Startup sound playback
   - Transition to desktop environment

5. **UI Framework**
   - Glassmorphism effects using CSS backdrop-filter
   - Consistent spacing and typography scale
   - Dark/light theme support (CSS variables)
   - Accessibility features (keyboard navigation, ARIA labels)

### Data Flow
1. User interacts with desktop components (clicks, keyboard)
2. Actions dispatched to Zustand store
3. Store updates trigger UI re-renders
4. API calls made to backend services via `apiFetch` wrapper
5. Responses processed and UI updated accordingly
6. Changes persisted to backend through RESTful APIs

## Backend Architecture

### Service Structure
```
backend/
├── index.js                  # Service exports and initialization
├── server.js                 # Express app with middleware and routes
├── passport-config.js        # Google OAuth 2.0 configuration
├── session-config.js         # Redis-backed session management
├── middleware/               # Custom Express middleware
├── agents/                   # Agent implementations (Orbit, Icebound)
├── security-service/         # Rust cryptographic service
├── services/                 # Core backend services
│   ├── admin/                # Administrative services
│   ├── rag-service/          # Knowledge retrieval service
│   ├── agent-tools.js        # Controlled agent tools
│   ├── memory-summarization-worker.js
│   ├── vault-sync-worker.js
│   ├── plugin-sandbox-worker.js
│   └── plugin-security-service.js
└── Dockerfile                # Multi-stage build configuration
```

### Core Services
1. **User Management Service**
   - RESTful API for user CRUD operations
   - Role-based access control (admin, moderator, member, guest)
   - Authentication session management
   - Profile management and preferences

2. **Workspace Management Service**
   - Creation and management of collaborative workspaces
   - Workspace membership and permissions
   - Resource allocation and quotas

3. **Audit Log Service**
   - Immutable logging of all system actions
   - Database-backed storage with querying capabilities
   - JSON-formatted log entries for easy parsing

4. **Agent Management Service**
   - Agent lifecycle management (startup, shutdown, restart)
   - Tool permission checking and rate limiting
   - Agent-to-agent communication facilitation

5. **Group Management Service**
   - Organization of users into teams and groups
   - Group-based permissions and resource sharing
   - Hierarchical group structures

6. **Plugin Management Service**
   - Discovery and registration of plugins
   - Version compatibility checking
   - Plugin marketplace integration hooks

7. **Compliance Service**
   - Regulatory compliance tracking (GDPR, CCPA, etc.)
   - Data retention and deletion workflows
   - Audit trail generation for compliance reporting

### Communication Patterns
- **RESTful APIs**: JSON over HTTP for service-to-service communication
- **Service Registration**: Implicit through Express middleware mounting
- **Shared Database**: PostgreSQL accessed via Prisma ORM
- **Shared Cache**: Redis for sessions and temporary data
- **Eventual Consistency**: Background workers for cross-service updates

### Middleware Stack
1. **helmet.js**: Security headers (XSS, clickjacking protection)
2. **cors.js**: Cross-origin resource sharing configuration
3. **express-rate-limit**: API abuse prevention
4. **express.json()**: Body parsing with size limits
5. **express.urlencoded()**: Form data parsing
6. **Custom Middleware**: Authentication, logging, error handling

## AI & Intelligence Services

### RAG Service (Retrieval-Augmented Generation)
```
backend/services/rag-service/
├── main.py                 # FastAPI application entrypoint
├── Dockerfile              # Multi-stage Python build
├── requirements.txt        # Python dependencies
└── (logic embedded in main.py)
```

#### Components
1. **Embedding Model**: Sentence-transformers (all-MiniLM-L6-v2)
   - 384-dimensional embeddings for text similarity
   - Optimized for sentence-level semantics
   - Cached in memory for performance

2. **Vector Storage**: ChromaDB
   - Persistent storage for embeddings
   - Cosine similarity search
   - Metadata filtering capabilities

3. **Keyword Search**: BM25Okapi (via rank_bm25)
   - Traditional text retrieval based on term frequency
   - Complements vector search for hybrid results
   - In-memory index rebuilt on vault changes

4. **File System Watcher**: Watchdog
   - Monitors Obsidian vault for changes
   - Triggers re-indexing of modified files
   - Supports real-time knowledge updates

5. **Text Processing**: 
   - RecursiveCharacterTextSplitter for chunking
   - Configurable chunk size and overlap
   - Metadata preservation during splitting

#### API Endpoints
- `POST /query`: Hybrid search (vector + keyword)
- `POST /documents`: Add/update documents in knowledge base
- `GET /health`: Service health check
- `GET /stats`: Knowledge base statistics

#### Data Flow
1. User or agent submits search query
2. Query transformed into embedding vector
3. Vector search performed against ChromaDB
4. Keyword search performed against BM25 index
5. Results combined, re-ranked, and returned
6. Agent processes results and generates response

### Security Service (Rust Cryptographic Backend)
```
backend/security-service/
├── src/
│   ├── lib.rs              # Core cryptographic library
│   └── main.rs             # Actix-web HTTP server
├── Cargo.toml              # Rust dependencies and configuration
├── Dockerfile              # Multi-stage Rust build
└── README.md               # Service documentation
```

#### Cryptographic Primitives
1. **Password Hashing**: Bcrypt
   - Configurable cost factor (default: 12)
   - Salt generation and storage included in hash
   - Constant-time verification to prevent timing attacks

2. **JWT Tokens**: HMAC-SHA256
   - Customizable claims (sub, exp, iat, etc.)
   - Configurable expiration time (default: 1 hour)
   - Signature verification with secret key

3. **Encryption**: AES-256-GCM
   - 32-byte key (hex-encoded in environment)
   - Random 12-byte nonce for each encryption
   - Authentication tag for integrity verification
   - Base64 encoding for safe transport/storage

4. **Secure Random**: Cryptographically secure RNG
   - Used for nonces, salts, and token secrets
   - OS-provided entropy sources

5. **Input Validation**:
   - Email format (RFC 5322 compliant subset)
   - Username (alphanumeric, underscore, hyphen, 3-30 chars)
   - Safe string (null byte, path traversal prevention)
   - Length validation utilities

#### API Endpoints
- `POST /hash-password`: Secure password hashing
- `POST /verify-password`: Password verification against hash
- `POST /create-token`: JWT token generation
- `POST /validate-token`: JWT validation and claims extraction
- `POST /encrypt`: AES-256-GCM encryption
- `POST /decrypt`: AES-256-GCM decryption
- `POST /validate-email`: Email format validation
- `POST /validate-username`: Username format validation
- `GET /health`: Service health check

#### Security Features
- All error messages generic to prevent information leakage
- Input validation prevents injection attacks
- Cryptographic operations use constant-time algorithms where possible
- Secrets managed through environment variables
- No logging of sensitive data (passwords, keys, etc.)

### Agent System (Orbit & Icebound)

#### Architecture Overview
```
LangGraph Orchestrator
├── State Definition (TypedScript interfaces)
├── Pipeline Nodes (individual processing steps)
├── Conditional Logic (edges between nodes)
└── Entry Point (workflow initiation)
```

#### Core Pipeline Nodes (Shared by Both Agents)
1. **Scope Checker**: Validates agent permissions for requested operations
2. **Policy Guard**: Ensures compliance with organizational policies
3. **Trigger Evaluator**: Determines if agent should activate based on triggers
4. **Persona Router**: Selects appropriate agent persona based on context
5. **Memory Retriever**: Fetches relevant memories from RAG service
6. **Tool Planner**: Determines which tools to use and in what order
7. **Tool Executor**: Safely executes approved tools with audit logging
8. **Reply Composer**: Generates final response based on tool results
9. **Feedback Collector**: Gathers user feedback for learning
10. **Audit Logger**: Records all agent interactions for compliance
11. **Vault Writer**: Logs interactions to Obsidian vault for persistence

#### Agent-Specific Characteristics
- **Orbit Agent**: General purpose, collaborative tasks, communication
- **Icebound Agent**: Technical tasks, code analysis, development assistance

#### Tool Framework
- **Permission Checking**: Each tool validates agent authorization
- **Rate Limiting**: Prevents abuse (in-memory in dev, Redis in prod planned)
- **Audit Logging**: All tool usage logged for security and compliance
- **Error Handling**: Structured error responses with context
- **Fallback Mechanisms**: Graceful degradation when services unavailable

#### Agent Tools
1. **Vault Tools**: Read/write/search in Obsidian vault (with path restrictions)
2. **Web Search**: Internet search via configurable API (with mock fallback)
3. **Task Creation**: Create task notes in vault with frontmatter
4. **Summary Creation**: Generate summary notes from chats or other sources
5. **User Lookup**: Retrieve user profiles from database
6. **Notification Send**: Queue notifications for delivery (email, in-app)
7. **File Read**: Read uploaded files (MinIO integration planned)
8. **Chat Tools**: Read/reply to group messages (database integration planned)
9. **Hackathon Search**: Search hackathon listings (API integration planned)
10. **Plugin Invoke**: Execute installed plugins in sandbox (planned)

## Infrastructure Layer

### Containerization
- **Docker Multi-Stage Builds**: 
  - Backend: Node.js → production image
  - Frontend: Node.js → nginx serving static files
  - RAG Service: Python → slim production image
  - Security Service: Rust → minimal production image
- ** docker-compose.yml**: Local development orchestration
- **Kubernetes Manifests**: Production deployment configurations

### Data Storage
1. **PostgreSQL** (Primary Database)
   - User profiles, workspace data, audit logs
   - Prisma ORM for type-safe database access
   - Connection pooling for performance
   - Regular backups and replication planned

2. **Redis** (Session & Cache)
   - HTTP session storage (encrypted, expiring)
   - Temporary data and rate limiting (planned)
   - Pub/sub for real-time notifications (planned)
   - TTL-based automatic cleanup

3. **MinIO** (Object Storage)
   - File uploads and attachments
   - Obsidian vault storage
   - Plugin assets and distributions
   - Backup archives
   - S3-compatible API

4. **ChromaDB** (Vector Storage)
   - Embedded within RAG service
   - Persistent storage directory
   - Metadata filtering capabilities

5. **In-Memory Indexes** (RAG Service)
   - BM25 Okapi for keyword search
   - Rebuilt on vault changes
   - Memory-efficient implementation

### External Services
1. **Google OAuth 2.0**
   - Authentication provider
   - User profile information (email, name, picture)
   - Secure token exchange
   - Refresh token handling

2. **Search APIs** (Planned/Configurable)
   - Web search for agent research capabilities
   - Configurable providers (Google, Bing, DuckDuckGo, etc.)
   - API key authentication
   - Rate limiting and quota management

3. **Email Services** (For Notifications)
   - SMTP, SendGrid, Amazon SES, etc.
   - Templated emails for notifications
   - Delivery tracking and bounce handling
   - Rate limiting and spam compliance

4. **Future Integrations**
   - Vector databases (Pinecone, Weaviate) for scalable embeddings
   - Message queues (RabbitMQ, Apache Kafka) for async processing
   - Monitoring stack (Prometheus, Grafana, Loki)
   - CI/CD pipelines (GitHub Actions, GitLab CI)

## Security Architecture

### Defense in Depth
1. **Network Security**
   - Services deployed in isolated network segments (K8s namespaces)
   - Firewall rules restricting traffic to necessary ports
   - DDoS protection at infrastructure level
   - Service mesh for inter-service communication (planned)

2. **Host Security**
   - Minimal base images (Distroless, Alpine)
   - Regular security patching via automated updates
   - Container scanning for vulnerabilities (planned in CI)
   - Runtime security monitoring (Falco, Sysdig planned)

3. **Application Security**
   - Input validation at API boundaries
   - Output encoding to prevent XSS
   - Parameterized queries via Prisma ORM
   - Security headers (helmet.js)
   - Rate limiting on all API endpoints

4. **Data Protection**
   - Encryption at rest: AES-256-GCM for sensitive data
   - Encryption in transit: TLS 1.2+ for all communications
   - Key management via environment variables
   - Regular key rotation procedures
   - Database connection strings encrypted

5. **Authentication & Authorization**
   - Google OAuth 2.0 as sole authentication method
   - Redis-backed sessions with 10-minute timeout
   - Role-based access control (RBAC) enforced at API level
   - Principle of least privilege for all service accounts
   - Multi-factor authentication planned (TOTP)

6. **Secrets Management**
   - No secrets stored in source code or repositories
   - All configuration via environment variables
   - Secret management service integration planned (HashiCorp Vault, AWS Secrets Manager)
   - Regular rotation of all credentials and keys

7. **Audit & Monitoring**
   - Structured logging across all services
   - Correlation IDs for request tracing
   - Sensitive data automatically redacted from logs
   - Real-time alerting for security events
   - Regular penetration testing and vulnerability scanning

## Data Flow Examples

### User Authentication Flow
1. User clicks "Sign in with Google" on login page
2. Frontend redirects to Google OAuth 2.0 consent screen
3. User grants permission and Google redirects back with auth code
4. Frontend exchanges auth code for tokens with backend `/api/auth/google/callback`
5. Backend validates token with Google, creates user if new
6. Backend creates encrypted Redis session with user ID and role
7. Backend returns session cookie to frontend
8. Frontend stores session and redirects to desktop
9. Subsequent requests include session cookie for authentication

### Agent Task Execution Flow
1. User sends message to agent via chat interface
2. Frontend forwards message to agent management service
3. Agent management service validates user permissions
4. Agent workflow initiated via LangGraph orchestrator
5. Scope checker validates agent can perform requested actions
6. Memory retriever fetches relevant context from RAG service
7. Tool planner determines needed tools based on request
8. Tool executor runs approved tools with permission checking
9. Tool results logged to audit log and Obsidian vault
10. Reply composer generates response from tool results
11. Response sent back to user via chat interface
12. Feedback collector gathers user response for learning

### Knowledge Query Flow
1. User or agent submits knowledge query
2. Request sent to RAG service `/query` endpoint
3. Query transformed to embedding vector
4. Hybrid search executed (vector + BM25 keyword)
5. Results re-ranked and combined
6. Top results returned to requester
7. Agent processes results and generates response
8. Interaction logged to vault for learning and audit

## Deployment Architecture

### Local Development
```
Developer Machine
├── Docker Compose
│   ├── backend (Node.js)
│   ├── frontend (Next.js dev server)
│   ├── rag-service (Python)
│   ├── security-service (Rust)
│   ├── postgres
│   ├── redis
│   └── minio
└── Localhost:3000 (Frontend)
    ↔ Localhost:3001 (Backend API)
```

### Production Deployment
```
Load Balancer
├── Frontend Servers (Next.js static)
│   └── CDN for asset delivery
├── Backend API Servers (Node.js cluster)
│   ├── Microservices behind API gateway
│   ├── Session affinity for WebSocket fallbacks
│   └── Health checks and circuit breakers
├── AI Services
│   ├── RAG Service (Python instances)
│   └── Security Service (Rust instances)
├── Data Stores
│   ├── PostgreSQL (Primary + Read Replicas)
│   ├── Redis (Clustered)
│   └── MinIO (Distributed)
└── Monitoring & Alerting
    ├── Prometheus (Metrics collection)
    ├── Grafana (Dashboards)
    ├── Loki (Log aggregation)
    └── Alertmanager (Notifications)
```

### Scaling Strategy
1. **Horizontal Pod Autoscaler**: Based on CPU/memory usage
2. **Database Read Replicas**: For scaling read-heavy workloads
3. **Redis Clustering**: For session storage and caching
4. **MinIO Erasure Coding**: For durable object storage
5. **Service Mesh**: For traffic management and observability (planned)
6. **Geo-Replication**: For disaster recovery (planned)

## Extensibility Points

### Plugin System
- **Registration**: Plugins register capabilities at startup
- **Sandboxing**: Plugins execute in isolated environments (iframes/Web Workers planned)
- **Permission System**: Granular control over plugin capabilities
- **Versioning**: Semantic versioning with compatibility checking
- **Marketplace**: Discovery and distribution of community plugins
- **Hooks**: Pre/post-action hooks for extending core functionality

### Custom Agents
- **Agent Templates**: Base classes for creating specialized agents
- **Tool Development**: Custom tools that integrate with existing frameworks
- **Personas**: Definable agent personalities and behaviors
- **Training Data**: Ability to fine-tune on domain-specific data
- **Marketplace**: Sharing and discovering custom agents

### Integration Points
- **Webhooks**: For external system notifications
- **API Gateway**: For custom backend endpoints
- **Event System**: Publish/subscribe for cross-service communication
- **Storage Adapters**: Pluggable backends for different storage providers
- **Auth Providers**: Extensible authentication beyond Google OAuth

## Performance Considerations

### Frontend Optimizations
- **Code Splitting**: Route-based splitting with Next.js App Router
- **Image Optimization**: next/image with automatic sizing and formats
- **Font Optimization**: next/font with self-hosting and subsetting
- **Prefetching**: Link prefetching for anticipated navigation
- **Server Components**: Default rendering reduces client-side JavaScript
- **Streaming SSR**: Progressive rendering for slow connections
- **Cache Headers**: Proper caching for static assets

### Backend Optimizations
- **Connection Pooling**: Prisma client with optimized pool settings
- **Query Optimization**: Selective field retrieval to reduce data transfer
- **Caching Layers**: Redis for expensive computations and frequent queries
- **Async/Await**: Non-blocking I/O for concurrent request handling
- **Pagination**: Cursor-based pagination for large datasets
- **Indexing**: Proper database indexes for query performance
- **Compression**: Gzip/Brotli for API responses

### AI Service Optimizations
- **Model Caching**: Embedding model loaded once and reused
- **Batch Processing**: Multiple queries processed in single batch when possible
- **Index Optimization**: ChromaDB tuning for search performance
- **Memory Management**: Efficient BM25 implementation with regular cleanup
- **Connection Pooling**: HTTP client pooling for external API calls
- **Async Processing**: Background workers for non-request-bound tasks

### Database Optimizations
- **Connection Pooling**: Optimized pool sizes based on workload
- **Query Planning**: EXPLAIN ANALYZE for slow query identification
- **Indexing**: Strategic indexes on frequently queried columns
- **Partitioning**: Time-based partitioning for audit logs
- **Archiving**: Moving old data to cheaper storage tiers
- **Read Replicas**: Offloading read queries from primary

## Monitoring & Observability (Planned)

### Metrics Collection
- **Application Metrics**: Request rates, error rates, latency
- **Business Metrics**: Active users, agent usage, knowledge base growth
- **System Metrics**: CPU, memory, disk, network utilization
- **Database Metrics**: Query performance, connection usage, replication lag
- **Cache Metrics**: Hit/miss rates, eviction rates, memory usage

### Logging Strategy
- **Structured Logging**: JSON format with consistent fields
- **Correlation IDs**: Unique identifiers for request tracing
- **Log Levels**: Appropriate use of debug, info, warn, error
- **Sensitive Data Redaction**: Automatic removal of PII and secrets
- **Centralized Collection**: Aggregation to Loki or similar system
- **Retention Policies**: Configurable based on compliance requirements

### Health Checks
- **Liveness Probes**: Determine if container should be restarted
- **Readiness Probes**: Determine if container should receive traffic
- **Dependency Checks**: Verify connectivity to required services
- **Deep Health Checks**: Comprehensive system validation
- **Cascading Failures**: Prevention through circuit breakers and timeouts

### Alerting Strategy
- **Threshold-Based Alerts**: CPU usage > 80%, error rate > 5%
- **Anomaly Detection**: Statistical deviation from baseline
- **Business Impact Alerts**: User-affecting issues prioritized
- **Runbooks**: Documented procedures for common alert scenarios
- **Notification Channels**: Email, SMS, Slack, PagerDuty integrations

## Future Enhancements

### Phase 1: Monitoring & Stability
- Complete Prometheus/Grafana/Loki monitoring stack
- Implement distributed tracing with OpenTelemetry
- Add comprehensive health checks with dependency verification
- Complete structured logging across all services
- Implement backup and disaster recovery procedures

### Phase 2: Security & Compliance
- Integrate Rust security service with user management
- Implement Multi-Factor Authentication (TOTP)
- Add advanced Redis-based rate limiting
- Implement comprehensive input validation middleware
- Add output sanitization to prevent XSS
- Complete SOC 2 Type II compliance preparations

### Phase 3: Agent System Enhancement
- Replace mocked tools with real implementations (MinIO, database, etc.)
- Implement memory summarization worker for efficiency
- Begin plugin marketplace foundation
- Start custom agent training infrastructure
- Add real-time collaboration features (Socket.IO)
- Implement proper tool permissioning and auditing

### Phase 4: Feature Completeness
- Build complete admin interface with all management features
- Implement core user-facing interfaces (chat, workspace, tasks)
- Optimize frontend performance (Core Web Vitals >90)
- Implement knowledge base search interface (RAG-powered)
- Add profile settings and notification center

### Phase 5: Platform Evolution
- Implement comprehensive CI/CD pipeline (GitHub Actions)
- Create comprehensive testing strategy (unit/integration/e2e)
- Set up monitoring stack and alerting configurations
- Conduct security audit and penetration testing
- Prepare for production deployment and monitoring

## Conclusion

UNHINGED's architecture combines modern web technologies with sophisticated AI capabilities to create a unique team collaboration platform. The microservices approach provides scalability and maintainability, while the Windows-inspired web OS interface offers an intuitive and familiar user experience. Security is built in at every layer, from authentication to data encryption, ensuring that user data and system integrity are protected. The platform is designed for extensibility, allowing organizations to customize and expand functionality as their needs evolve.

The separation of concerns between frontend, backend services, and AI intelligence services enables independent development, scaling, and maintenance. Clear APIs and well-defined contracts between services ensure reliability and facilitate troubleshooting. As the platform matures, additional features and optimizations will be added to enhance performance, security, and user experience.
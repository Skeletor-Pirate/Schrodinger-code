# Manual Input Required for Unhinged Platform

## Immediate Actions Needed

### 1. Environment Configuration
Copy `.env.example` to `.env` and populate the following:

#### Database Configuration (PostgreSQL)
- **Variable**: `DATABASE_URL`
- **Format**: `postgresql://username:password@host:port/database_name?schema=public`
- **Example**: `postgresql://unhinged_user:secure_password@localhost:5432/unhinged?schema=public`
- **Where to set**: In `.env` file in the project root
- **Steps**:
  1. Ensure PostgreSQL is running (via Docker: `docker-compose up -d postgres`)
  2. Create database: `createdb -U postgres unhinged`
  3. Create user: `createuser -U postgres -P unhinged_user`
  4. Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE unhinged TO unhinged_user;`
  5. Set the DATABASE_URL in .env accordingly

#### Redis Configuration
- **Variables**: 
  - `REDIS_HOST` (default: localhost)
  - `REDIS_PORT` (default: 6379)
  - `REDIS_PASSWORD` (if password protection enabled)
- **Where to set**: In `.env` file in the project root

#### Obsidian Vault Path Configuration
- **Variable**: `VAULT_PATH` (default: `./vault`)
- **Where to set**: In `.env` file in the project root
- **Steps**:
  1. Specify the path to your local Obsidian vault folder (e.g. `./vault`)
  2. All agent memories, notes, and summaries will sync directly into this local folder.

#### Google OAuth 2.0 Configuration
- **Variables**:
  - `GOOGLE_CLIENT_ID` (from Google Cloud Console)
  - `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)
  - `GOOGLE_CALLBACK_URL` (should match what's configured in Google Console)

#### LLM API Integrations Configuration
- **Variables**:
  - `OPENAI_API_KEY` (OpenAI platform key)
  - `GEMINI_API_KEY` (Google Gemini API key)
  - `GROQ_API_KEY` (Groq API key for low-latency Llama inference)
- **Where to set**: In `.env` file in the project root

#### Security Configuration
- **Variables**:
  - `JWT_SECRET` (32+ byte random string for signing JWT tokens)
  - `ENCRYPTION_KEY` (32 byte random value, hex encoded for AES-256-GCM)

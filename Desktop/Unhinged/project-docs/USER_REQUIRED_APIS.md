# UNHINGED Platform: Required Private API Configuration Registry

To deploy and test live integration features for the UNHINGED platform, populate the following credentials in your `.env` file at the repository root.

> [!WARNING]
> Never commit this file or the `.env` file to your Git repository. They contain active production keys and secrets.

---

## 🔑 Primary Authentication & Security Credentials

### Google OAuth 2.0 Web Client
Needed for user signups, logins, and identity verification.
- **`GOOGLE_CLIENT_ID`**: Create a project in [Google Cloud Console](https://console.cloud.google.com/), enable OAuth 2.0, and paste the Client ID.
- **`GOOGLE_CLIENT_SECRET`**: Paste the corresponding Client Secret key.
- **`GOOGLE_CALLBACK_URL`**: Set this to `http://localhost:3000/api/auth/callback/google` (local dev port) or your production domain callback URL.

### Security Keys
- **`JWT_SECRET`**: A cryptographically random string (minimum 32 bytes) for signing and verifying JSON Web Tokens.
  - *Generation command:* `openssl rand -base64 32`
- **`ENCRYPTION_KEY`**: A 32-byte hex-encoded key for AES-256-GCM encryption of sensitive database fields.
  - *Generation command:* `openssl rand -hex 32`
- **`NEXTAUTH_SECRET`**: A random 32-byte string for Next.js session validation.

---

## 🗄️ Database & Storage Connections

- **`DATABASE_URL`**: PostgreSQL connection string.
  - *Format:* `postgresql://username:password@host:port/database_name?schema=public`
- **Redis Connection**: Host, port, and authentication password for caching, sessions, and rate-limiting.
  - **`REDIS_HOST`** (default: `localhost`)
  - **`REDIS_PORT`** (default: `6379`)
  - **`REDIS_PASSWORD`** (optional)
- **Obsidian Vault Storage Path**: Local file system directory where Obsidian saves markdown notes. Used as the exclusive storage for memories, summaries, tasks, and interaction logs.
  - **`VAULT_PATH`** (default: `./vault`)

---

## 🤖 AI & External Integrations

- **`OPENAI_API_KEY`**: OpenAI platform API key for generating chat completions, LangGraph node execution, and vector embeddings.
- **`GEMINI_API_KEY`**: Google Gemini API key for running Google-native LLM integrations and agent queries.
- **`GROQ_API_KEY`**: Groq Cloud API key for ultra-fast, low-latency agent inference execution (e.g., Llama-3-70B).
- **`RAG_SERVICE_URL`**: FastAPI query endpoints (default: `http://localhost:8001`).

---

## 📬 SMTP Email Service (Optional Notifications)

- **`SMTP_HOST`**: SMTP server hostname.
- **`SMTP_PORT`**: SMTP server port (usually `587` for TLS).
- **`SMTP_USER`**: Email sender/auth username.
- **`SMTP_PASS`**: App-specific password.
- **`SMTP_FROM`**: The displayed sender address.

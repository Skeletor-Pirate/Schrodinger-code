# UNHINGED Security Service

This service provides high-level production-grade security components implemented in Rust for the UNHINGED platform.

## Features

### Cryptographic Operations
- **Password Hashing**: Secure password hashing and verification using bcrypt
- **JWT Tokens**: JSON Web Token generation and validation with customizable claims
- **Encryption**: AES-256-GCM symmetric encryption/decryption for sensitive data
- **Secure Random**: Cryptographically secure random number generation

### Input Validation
- Email format validation
- Username validation (alphanumeric, underscore, hyphen, 3-30 chars)
- Safe string validation (prevents path traversal, null bytes)
- Length validation utilities

## API Endpoints

All endpoints are prefixed with the base URL of the service.

### Authentication
- `POST /hash-password` - Hash a password with optional cost factor
- `POST /verify-password` - Verify a password against a hash
- `POST /create-token` - Create a JWT token with subject and optional claims
- `POST /validate-token` - Validate a JWT token and extract claims

### Encrypt` - Encrypt data (base64 encoded input/output)
- `POST /decrypt` - Decrypt data (base64 encoded input/output)

### Validation
- `POST /validate-email` - Validate email format
- `POST /validate-username` - Validate username format

### Monitoring
- `GET /health` - Health check endpoint

## Usage

### Environment Variables
- `JWT_SECRET`: Secret key for JWT signing (default: development-only secret)
- `JWT_EXPIRES_IN`: JWT expiration time in seconds (default: 3600)
- `ENCRYPTION_KEY`: Hex-encoded 32-byte encryption key (randomly generated if not provided)
- `PASSWORD_COST_FACTOR`: bcrypt cost factor (default: 12)
- `PASSWORD_MIN_LENGTH`: Minimum password length (default: 8)
- `PASSWORD_MAX_LENGTH`: Maximum password length (default: 128)
- `PASSWORD_REQUIRE_UPPERCASE`: Require uppercase letters (default: true)
- `PASSWORD_REQUIRE_LOWERCASE`: Require lowercase letters (default: true)
- `PASSWORD_REQUIRE_DIGITS`: Require digits (default: true)
- `PASSWORD_REQUIRE_SPECIAL`: Require special characters (default: true)

### Example Requests
```bash
# Hash a password
curl -X POST http://localhost:8000/hash-password \
  -H "Content-Type: application/json" \
  -d '{"password": "MySecurePassword123!", "cost_factor": 12}'

# Validate an email
curl -X POST http://localhost:8000/validate-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

## Docker Deployment
The service is configured for Docker deployment via the included Dockerfile.
It is integrated into the main docker-compose.yml as the `security-service`.

## Integration with UNHINGED Platform
Other services (backend, agents, etc.) can interact with this service via HTTP requests to:
- Hash passwords before storage
- Validate user inputs (emails, usernames)
- Create and validate JWT tokens for authentication
- Encrypt sensitive data at rest or in transit
- Perform cryptographically secure operations

## Security Notes
- All cryptographic operations use industry-standard algorithms
- Passwords are hashed with bcrypt (adjustable cost factor)
- JWT tokens are signed using HMAC with SHA-256
- Encryption uses AES-256-GCM with random nonces
- Input validation prevents common injection attacks
- Error messages are generic to avoid information leakage
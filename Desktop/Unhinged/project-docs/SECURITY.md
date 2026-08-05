# Security

UNHINGED is intended to use Google OAuth, role-based access control, secure server-side sessions, least-privilege agent tools, encryption for sensitive data, audit logs, and private object storage.

## Before public deployment

- Enforce authentication and authorization on every protected API route.
- Restrict CORS to the deployed frontend origin; never use permissive production defaults.
- Use HTTPS, secure/HTTP-only/SameSite cookies, and managed secrets.
- Validate all server input, sanitize displayed user content, and prevent path traversal in file/vault operations.
- Keep database, object-storage, OAuth, email, API, and encryption credentials out of Git.
- Create backups, test restoration, monitor dependency health, and retain audit logs appropriately.
- Scan dependencies/images and perform security testing before release.

## Reporting

Until a verified security contact and responsible-disclosure process are configured, do not publish placeholder security contact details. Create a real monitored contact address before opening the repository to public reports.

## Current caution

Security-related source and policy documents exist, but they must not be treated as proof of production enforcement. Confirm the active application wiring and test all access-control and input-handling paths before release.

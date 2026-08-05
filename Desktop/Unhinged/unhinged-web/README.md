# Unhinged Web OS

This is the frontend for the Unhinged Platform - an AI-powered team collaboration platform featuring a futuristic Windows-style operating system interface.

## Overview

Unhinged Web OS provides a desktop-like experience in the browser with:
- Futuristic Windows-inspired UI with taskbar, start menu, and window management
- Glassmorphism design effects throughout
- Animated startup sequence with custom sound
- Agent-based AI assistants (Orbit and Icebound)
- Plugin system for extensibility
- Obsidian vault integration for knowledge management
- Administrative panel for system management

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend services running (see backend/README.md)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp ../.env.example .env.local
   # Edit .env.local with your configuration
   ```

### Development
```bash
# Start development server
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

## Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable UI components
- `src/components/desktop/` - Desktop-specific components (window, taskbar, start menu, etc.)
- `src/store/` - Zustand store for desktop state management
- `src/config/` - Application configuration
- `public/` - Static assets

## Features Implemented
- [x] Futuristic Windows-style UI/UX
- [x] Taskbar with start menu and system tray
- [x] Window management (resize, minimize, maximize, minimize, maximize, close)
- [x] Desktop icons and start menu
- [x] Animated startup sequence with "Uh" logo and sound
- [x] Custom audio player component
- [x] Glassmorphism design effects
- [x] Responsive layout
- [ ] Admin panel implementation (in progress)
- [ ] Core user interface (chat, workspace, tasks) (not started)
- [ ] Knowledge base search interface (not started)

## Environment Variables

See the root `.env.example` file for required environment variables including:
- Database connection (PostgreSQL)
- Redis configuration
- MinIO object storage settings
- Google OAuth 2.0 credentials
- OpenAI API key
- Security secrets (JWT, encryption)
- Email service configuration
- Optional service APIs (search, hackathon, etc.)

## Extending the Platform

### Adding New Applications
1. Add app definition to `src/config/apps.ts`
2. Create the application components
3. Register any needed API routes in the backend
4. Set appropriate permissions in the admin panel

### Customizing the UI
- Modify `src/app/globals.css` for design system variables
- Update component styles in respective component files
- Add new components to `src/components/` as needed

## Learn More

For backend API documentation, see the backend/README.md file.

For detailed implementation status and TODO items, see the claudedocs/ directory in the project root.

## Deployment

The easiest way to deploy is using Docker:
```bash
docker-compose up -d
```

Or deploy to Vercel for frontend-only deployment:
```bash
vercel
```
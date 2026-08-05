import { AppDefinition } from '../types';

export const APPS: Record<string, AppDefinition> = {
  chat: {
    id: 'chat',
    name: 'Messages & Chat',
    icon: 'MessageSquare',
    description: 'Realtime chat with team members and system bots Orbit & Icebound.',
    color: '#6c5ce7',
    defaultWidth: 880,
    defaultHeight: 620,
    minWidth: 450,
    minHeight: 350,
    pinToTaskbar: true,
    category: 'core'
  },
  files: {
    id: 'files',
    name: 'Obsidian Vault',
    icon: 'BookOpen',
    description: 'Sharpen your thinking. Obsidian note brain and neural graph network.',
    color: '#7c3aed', // Obsidian purple
    defaultWidth: 920,
    defaultHeight: 640,
    minWidth: 500,
    minHeight: 380,
    pinToTaskbar: true,
    category: 'core'
  },
  studio: {
    id: 'studio',
    name: 'Agent Studio',
    icon: 'Cpu',
    description: 'Build, wire, test, and deploy custom agent personas and tools.',
    color: '#fdcb6e',
    defaultWidth: 900,
    defaultHeight: 650,
    minWidth: 500,
    minHeight: 400,
    pinToTaskbar: true,
    category: 'tools'
  },
  marketplace: {
    id: 'marketplace',
    name: 'Plugin Store',
    icon: 'ShoppingBag',
    description: 'Discover and install plugins to extend your OS environment.',
    color: '#55efc4',
    defaultWidth: 850,
    defaultHeight: 600,
    minWidth: 450,
    minHeight: 350,
    pinToTaskbar: false,
    category: 'tools'
  },
  hackathons: {
    id: 'hackathons',
    name: 'Hackathon Finder',
    icon: 'Trophy',
    description: 'Discover, track, and get AI-summarized insights on upcoming hackathons.',
    color: '#e84393',
    defaultWidth: 880,
    defaultHeight: 600,
    minWidth: 450,
    minHeight: 350,
    pinToTaskbar: true,
    category: 'tools'
  },
  admin: {
    id: 'admin',
    name: 'Admin Panel',
    icon: 'Shield',
    description: 'Manage user signups, approvals, audit logs, and workspace policies.',
    color: '#d63031',
    defaultWidth: 920,
    defaultHeight: 620,
    minWidth: 500,
    minHeight: 400,
    pinToTaskbar: false,
    category: 'system'
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    description: 'Change wallpaper, UI preferences, sound effects, and workspace options.',
    color: '#a0a0b8',
    defaultWidth: 650,
    defaultHeight: 480,
    minWidth: 380,
    minHeight: 280,
    pinToTaskbar: false,
    category: 'system'
  },
  search: {
    id: 'search',
    name: 'OmniSearch',
    icon: 'Search',
    description: 'Global hybrid search across chats, notes, decisions, and files.',
    color: '#0984e3',
    defaultWidth: 720,
    defaultHeight: 480,
    minWidth: 400,
    minHeight: 300,
    pinToTaskbar: false,
    category: 'system'
  },
  profile: {
    id: 'profile',
    name: 'User Profile',
    icon: 'User',
    description: 'Manage identity, avatar, secondary email, and preferences.',
    color: '#00cec9',
    defaultWidth: 620,
    defaultHeight: 460,
    minWidth: 350,
    minHeight: 260,
    pinToTaskbar: false,
    category: 'system'
  }
};

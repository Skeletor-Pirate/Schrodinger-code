// ============================================
// UNHINGED WEB OS — Type Definitions
// ============================================

export type AppId = 
  | 'chat' 
  | 'files' // Obsidian Brain
  | 'studio' 
  | 'marketplace' 
  | 'hackathons' 
  | 'profile' 
  | 'settings' 
  | 'admin' 
  | 'search';

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: string; // lucide icon name
  description: string;
  color: string; // accent color for the app
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  pinToTaskbar: boolean;
  category: 'core' | 'agents' | 'tools' | 'system';
}

export interface WindowState {
  id: string; // unique window instance id
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  isClosing: boolean;
}

export interface DesktopIconState {
  id: string;
  appId: AppId;
  x: number; // grid column
  y: number; // grid row
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'agent';
  timestamp: Date;
  read: boolean;
  appId?: AppId;
  agentName?: string;
}

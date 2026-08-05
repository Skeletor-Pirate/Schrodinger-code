import { create } from 'zustand';
import { WindowState, NotificationItem, AppId } from '../types';
import { APPS } from '../config/apps';

interface DesktopStore {
  windows: WindowState[];
  activeWindowId: string | null;
  startMenuOpen: boolean;
  commandPaletteOpen: boolean;
  notifications: NotificationItem[];
  wallpaper: string;
  maxZIndex: number;
  
  // Actions
  openWindow: (appId: AppId) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, x: number, y: number) => void;
  updateWindowSize: (windowId: string, width: number, height: number) => void;
  
  toggleStartMenu: (force?: boolean) => void;
  toggleCommandPalette: (force?: boolean) => void;
  
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  setWallpaper: (wallpaper: string) => void;
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  startMenuOpen: false,
  commandPaletteOpen: false,
  notifications: [],
  wallpaper: 'default',
  maxZIndex: 100,

  openWindow: (appId) => {
    const { windows, maxZIndex } = get();
    const appDef = APPS[appId];
    if (!appDef) return;

    // Check if window is already open
    const existingWindow = windows.find((w) => w.appId === appId);
    if (existingWindow) {
      // If minimized, restore it. Otherwise, focus it.
      set((state) => ({
        windows: state.windows.map((w) =>
          w.appId === appId ? { ...w, isMinimized: false } : w
        ),
        startMenuOpen: false
      }));
      get().focusWindow(existingWindow.id);
      return;
    }

    const nextZIndex = maxZIndex + 1;
    // Offset standard spawn position so they don't overlay exactly
    const offset = (windows.length * 28) % 150;
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const defaultX = Math.max(40, (screenWidth - appDef.defaultWidth) / 2 + offset);
    const defaultY = Math.max(40, (screenHeight - appDef.defaultHeight) / 2 - 40 + offset);

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: appDef.name,
      x: defaultX,
      y: defaultY,
      width: appDef.defaultWidth,
      height: appDef.defaultHeight,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
      isClosing: false
    };

    set((state) => ({
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
      maxZIndex: nextZIndex,
      startMenuOpen: false
    }));
  },

  closeWindow: (windowId) => {
    // Set closing animation state first, then remove after anim
    set((state) => ({
      windows: state.windows.map((w) => 
        w.id === windowId ? { ...w, isClosing: true } : w
      )
    }));

    setTimeout(() => {
      set((state) => {
        const nextWindows = state.windows.filter((w) => w.id !== windowId);
        // Find next window to focus
        let nextActiveId = null;
        if (nextWindows.length > 0) {
          const sorted = [...nextWindows].sort((a, b) => b.zIndex - a.zIndex);
          nextActiveId = sorted[0].id;
        }
        return {
          windows: nextWindows,
          activeWindowId: nextActiveId
        };
      });
    }, 200);
  },

  minimizeWindow: (windowId) => {
    set((state) => {
      const nextWindows = state.windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      );
      // Focus next window in z-index hierarchy
      let nextActiveId = null;
      const visibleWindows = nextWindows.filter((w) => !w.isMinimized);
      if (visibleWindows.length > 0) {
        const sorted = [...visibleWindows].sort((a, b) => b.zIndex - a.zIndex);
        nextActiveId = sorted[0].id;
      }
      return {
        windows: nextWindows,
        activeWindowId: nextActiveId
      };
    });
  },

  maximizeWindow: (windowId) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
      )
    }));
    get().focusWindow(windowId);
  },

  focusWindow: (windowId) => {
    const { activeWindowId, maxZIndex } = get();
    if (activeWindowId === windowId) return;

    const nextZIndex = maxZIndex + 1;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
      ),
      activeWindowId: windowId,
      maxZIndex: nextZIndex
    }));
  },

  updateWindowPosition: (windowId, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, x, y } : w
      )
    }));
  },

  updateWindowSize: (windowId, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, width, height } : w
      )
    }));
  },

  toggleStartMenu: (force) => {
    set((state) => ({
      startMenuOpen: force !== undefined ? force : !state.startMenuOpen
    }));
  },

  toggleCommandPalette: (force) => {
    set((state) => ({
      commandPaletteOpen: force !== undefined ? force : !state.commandPaletteOpen
    }));
  },

  addNotification: (notification) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50) // limit to last 50
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  setWallpaper: (wallpaper) => {
    set({ wallpaper });
  }
}));

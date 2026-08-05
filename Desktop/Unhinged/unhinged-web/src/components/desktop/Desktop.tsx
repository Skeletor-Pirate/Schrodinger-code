'use client';

import React, { useEffect } from 'react';
import { useDesktopStore } from '../../store/desktopStore';
import { APPS } from '../../config/apps';
import { AppId } from '../../types';
import { DesktopIcon } from './DesktopIcon';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { StartMenu } from './StartMenu';
import { CommandPalette } from './CommandPalette';

export const Desktop: React.FC = () => {
  const { windows, wallpaper, toggleStartMenu } = useDesktopStore();

  // Close start menu on background click
  const handleDesktopClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only close if clicking the bare desktop background, not a child component
    if (target.classList.contains('desktop-canvas')) {
      toggleStartMenu(false);
    }
  };

  // Wallpaper class mapping
  const wallpaperClass = (() => {
    switch (wallpaper) {
      case 'deep-space':
        return 'wallpaper-deep-space';
      case 'obsidian-purple':
        return 'wallpaper-obsidian-purple';
      case 'midnight-glass':
        return 'wallpaper-midnight-glass';
      default:
        return 'wallpaper-default';
    }
  })();

  // Desktop icon grid layout: show all apps on the desktop
  const desktopApps = Object.values(APPS);

  return (
    <div
      className={`desktop-canvas fixed inset-0 ${wallpaperClass} overflow-hidden select-none`}
      onClick={handleDesktopClick}
    >
      {/* Subtle animated gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15), transparent 70%)',
            top: '10%',
            left: '20%'
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 206, 201, 0.1), transparent 70%)',
            bottom: '20%',
            right: '15%'
          }}
        />
      </div>

      {/* Desktop Icon Grid */}
      <div className="absolute top-6 left-6 z-10 grid grid-cols-1 gap-2">
        {desktopApps.map((app) => (
          <DesktopIcon key={app.id} appId={app.id} />
        ))}
      </div>

      {/* Open Windows Container */}
      <div className="absolute inset-0 z-20 pointer-events-none" style={{ bottom: '52px' }}>
        <div className="relative w-full h-full pointer-events-auto">
          {windows.map((win) => (
            <Window key={win.id} windowState={win}>
              {null}
            </Window>
          ))}
        </div>
      </div>

      {/* Start Menu */}
      <StartMenu />

      {/* Command Palette (Ctrl + K) */}
      <CommandPalette />

      {/* Taskbar (Fixed Bottom) */}
      <Taskbar />
    </div>
  );
};

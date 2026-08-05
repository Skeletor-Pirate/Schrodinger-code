'use client';

import React, { useEffect, useState } from 'react';
import { useDesktopStore } from '../../store/desktopStore';
import { APPS } from '../../config/apps';
import { DynamicIcon } from '../DynamicIcon';
import { AppId } from '../../types';
import { MessageSquare, Bell, Search, Terminal } from 'lucide-react';

export const Taskbar: React.FC = () => {
  const {
    windows,
    openWindow,
    toggleStartMenu,
    toggleCommandPalette,
    activeWindowId,
    focusWindow,
    minimizeWindow
  } = useDesktopStore();

  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
      setDate(
        now.toLocaleDateString([], { month: 'short', day: 'numeric' })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine active apps to show on the taskbar
  const openAppIds = Array.from(new Set(windows.map((w) => w.appId)));
  const pinnedApps = Object.values(APPS).filter((app) => app.pinToTaskbar);
  
  // Combine unique app IDs to render
  const taskbarAppIds = Array.from(
    new Set([...pinnedApps.map((a) => a.id), ...openAppIds])
  ) as AppId[];

  const handleAppClick = (appId: AppId) => {
    const openWin = windows.find((w) => w.appId === appId);
    
    if (openWin) {
      if (openWin.isMinimized) {
        focusWindow(openWin.id);
      } else if (activeWindowId === openWin.id) {
        minimizeWindow(openWin.id);
      } else {
        focusWindow(openWin.id);
      }
    } else {
      openWindow(appId);
    }
  };

  return (
    <div 
      className="taskbar fixed bottom-0 left-0 right-0 h-[52px] bg-[#0c0c14]/85 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-4 z-[500]"
      style={{
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Left: Start Launcher */}
      <div className="flex items-center">
        <button
          onClick={() => toggleStartMenu()}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#6c5ce7]/10 hover:bg-[#6c5ce7]/20 border border-[#6c5ce7]/20 hover:border-[#6c5ce7]/30 transition-all duration-200 group active:scale-95"
          title="Start Menu"
        >
          <div className="w-5 h-5 flex flex-wrap justify-between gap-0.5 group-hover:rotate-12 transition-transform duration-200">
            <span className="w-2 h-2 rounded-[2px] bg-[#00cec9]" />
            <span className="w-2 h-2 rounded-[2px] bg-[#6c5ce7]" />
            <span className="w-2 h-2 rounded-[2px] bg-[#fd79a8]" />
            <span className="w-2 h-2 rounded-[2px] bg-[#fdcb6e]" />
          </div>
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={() => toggleCommandPalette()}
          className="ml-2 w-10 h-10 rounded-xl flex items-center justify-center text-[#a0a0b8] hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95"
          title="Command Palette (Ctrl + K)"
        >
          <Terminal size={18} />
        </button>
      </div>

      {/* Center: Running / Pinned Apps */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white/2 border border-white/2 max-w-[50%] overflow-x-auto select-none">
        {taskbarAppIds.map((appId) => {
          const appDef = APPS[appId];
          if (!appDef) return null;

          const openWin = windows.find((w) => w.appId === appId);
          const isOpen = !!openWin;
          const isActive = isOpen && activeWindowId === openWin.id;
          const isMinimized = isOpen && openWin.isMinimized;

          return (
            <button
              key={appId}
              onClick={() => handleAppClick(appId)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border group ${
                isActive 
                  ? 'bg-[#6c5ce7]/15 border-[#6c5ce7]/30 text-white shadow-[0_0_12px_rgba(108,92,231,0.2)]'
                  : isOpen && !isMinimized
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-transparent border-transparent text-[#a0a0b8] hover:bg-white/5 hover:text-white'
              }`}
              title={appDef.name}
            >
              <DynamicIcon name={appDef.icon} size={18} color={appDef.color} />
              
              {/* Dot indicator for open apps */}
              {isOpen && (
                <span 
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    isActive ? 'bg-[#6c5ce7] shadow-[0_0_8px_#6c5ce7]' : 'bg-[#a0a0b8]'
                  }`} 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right: System Tray & Clock */}
      <div className="flex items-center gap-4">
        {/* Quick Notifications Trigger */}
        <button 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#a0a0b8] hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* Realtime Clock */}
        <div className="clock flex flex-col justify-center items-end select-none">
          <span className="text-[12px] font-semibold text-[#e8e8f0]">{time}</span>
          <span className="text-[9px] font-medium text-[#6c6c82] uppercase tracking-wider">{date}</span>
        </div>
      </div>
    </div>
  );
};

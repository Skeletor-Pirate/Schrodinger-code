'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/desktopStore';
import { APPS } from '../../config/apps';
import { DynamicIcon } from '../DynamicIcon';
import { AppId } from '../../types';
import { LogOut, Power, User as UserIcon, Search } from 'lucide-react';

export const StartMenu: React.FC = () => {
  const { startMenuOpen, toggleStartMenu, openWindow } = useDesktopStore();
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('button[title="Start Menu"]')
      ) {
        toggleStartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startMenuOpen, toggleStartMenu]);

  // Reset search when menu opens/closes
  useEffect(() => {
    if (!startMenuOpen) {
      setSearch('');
    }
  }, [startMenuOpen]);

  const filteredApps = Object.values(APPS).filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleLaunchApp = (appId: AppId) => {
    openWindow(appId);
    toggleStartMenu(false);
  };

  return (
    <AnimatePresence>
      {startMenuOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="start-menu fixed bottom-[60px] left-4 w-[480px] h-[520px] rounded-2xl bg-[#0c0c14]/85 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col z-[600]"
          style={{
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8]" size={16} />
              <input
                type="text"
                placeholder="Search apps, files, or agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#6c5ce7]/50 rounded-xl text-sm text-[#e8e8f0] outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Core Apps Grid / List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6c6c82] mb-3 px-2">
              All Apps ({filteredApps.length})
            </div>
            
            {filteredApps.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#6c6c82]">
                No applications match your search.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchApp(app.id)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 text-left transition-all duration-150 active:scale-97 group"
                  >
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#161622]/40 transition-transform group-hover:scale-105"
                      style={{
                        border: `1px solid ${app.color}20`
                      }}
                    >
                      <DynamicIcon name={app.icon} size={16} color={app.color} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#e8e8f0] truncate">
                        {app.name}
                      </div>
                      <div className="text-[10px] text-[#a0a0b8] truncate">
                        {app.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer: User Profile & Power Controls */}
          <div className="p-4 border-t border-white/5 bg-white/2 flex items-center justify-between rounded-b-2xl">
            {/* User Details */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#00cec9] flex items-center justify-center shadow-md">
                <UserIcon size={16} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#e8e8f0]">Aryan</div>
                <div className="text-[9px] text-[#6c6c82] font-medium tracking-wide">WORKSPACE ADVISOR</div>
              </div>
            </div>

            {/* Power options */}
            <div className="flex items-center gap-1.5">
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a0a0b8] hover:text-white hover:bg-white/5 transition-all duration-150 active:scale-95"
                title="Account Settings"
                onClick={() => handleLaunchApp('profile')}
              >
                <UserIcon size={15} />
              </button>
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-all duration-150 active:scale-95"
                title="System Restart"
                onClick={() => window.location.reload()}
              >
                <Power size={15} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

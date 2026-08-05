'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, ArrowRight } from 'lucide-react';
import { useDesktopStore } from '../../store/desktopStore';
import { APPS } from '../../config/apps';
import { AppId } from '../../types';
import { DynamicIcon } from '../DynamicIcon';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, toggleCommandPalette, openWindow } = useDesktopStore();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Key combination listener (Ctrl + K or Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        toggleCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, toggleCommandPalette]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [commandPaletteOpen]);

  const filteredApps = Object.values(APPS).filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (appId: AppId) => {
    openWindow(appId);
    toggleCommandPalette(false);
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-xl bg-[#0c0c14]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Input Bar */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <Terminal className="text-[#6c5ce7]" size={20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search apps (e.g. Chat, Obsidian, Settings)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder-[#6c6c82]"
              />
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] font-mono text-[#6c6c82]">ESC</span>
            </div>

            {/* App Launch Items */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleSelect(app.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#161622]"
                      style={{ border: `1px solid ${app.color}30` }}
                    >
                      <DynamicIcon name={app.icon} size={16} color={app.color} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{app.name}</div>
                      <div className="text-[10px] text-[#a0a0b8]">{app.description}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-[#6c6c82] group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

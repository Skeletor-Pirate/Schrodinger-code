'use client';

import React from 'react';
import { Settings, Image as ImageIcon, Volume2, Monitor, Check } from 'lucide-react';
import { useDesktopStore } from '../../store/desktopStore';

export const SettingsApp: React.FC = () => {
  const { wallpaper, setWallpaper } = useDesktopStore();

  const wallpapers = [
    { id: 'default', name: 'Cyberpunk Neon', gradient: 'radial-gradient(ellipse at top, #1a103c, #0a0a0f)' },
    { id: 'deep-space', name: 'Deep Space', gradient: 'radial-gradient(ellipse at bottom, #091e3a, #000000)' },
    { id: 'obsidian-purple', name: 'Obsidian Velvet', gradient: 'radial-gradient(circle at center, #2e1065, #09090b)' },
    { id: 'midnight-glass', name: 'Midnight Glass', gradient: 'linear-gradient(135deg, #111827, #030712)' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0d14] text-[#e8e8f0] font-sans p-6 overflow-y-auto space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 font-bold text-sm text-[#a0a0b8]">
          <Settings size={18} />
          <span>System Settings</span>
        </div>
      </div>

      {/* Wallpapers Section */}
      <div>
        <h3 className="text-xs font-bold text-white mb-1 flex items-center gap-2">
          <ImageIcon size={15} className="text-[#6c5ce7]" /> Desktop Wallpaper & Theme
        </h3>
        <p className="text-xs text-[#a0a0b8] mb-4">Choose a dynamic background preset for your Web OS canvas.</p>

        <div className="grid grid-cols-2 gap-3">
          {wallpapers.map((wp) => (
            <button
              key={wp.id}
              onClick={() => setWallpaper(wp.id)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                wallpaper === wp.id
                  ? 'border-[#6c5ce7] bg-[#6c5ce7]/10'
                  : 'border-white/10 hover:border-white/20 bg-white/2'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-white/10 shadow-md"
                  style={{ background: wp.gradient }}
                />
                <div>
                  <div className="text-xs font-bold text-white">{wp.name}</div>
                  <div className="text-[10px] text-[#6c6c82]">{wallpaper === wp.id ? 'Active' : 'Preset'}</div>
                </div>
              </div>
              {wallpaper === wp.id && <Check size={16} className="text-[#6c5ce7]" />}
            </button>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="pt-4 border-t border-white/5">
        <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
          <Monitor size={15} className="text-[#00cec9]" /> System Specifications
        </h3>
        <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-2 text-xs text-[#a0a0b8]">
          <div className="flex justify-between">
            <span>OS Version</span>
            <strong className="text-white">UNHINGED Web OS v1.0.0</strong>
          </div>
          <div className="flex justify-between">
            <span>Framework</span>
            <strong className="text-white">Next.js 16 (Turbopack) & React 19</strong>
          </div>
          <div className="flex justify-between">
            <span>System Agents</span>
            <strong className="text-[#00cec9]">Orbit & Icebound (Active)</strong>
          </div>
          <div className="flex justify-between">
            <span>Durable Memory</span>
            <strong className="text-[#7c3aed]">Obsidian Vault RAG Sync</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

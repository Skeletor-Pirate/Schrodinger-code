'use client';

import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Download, Check, ExternalLink, Filter } from 'lucide-react';

interface PluginItem {
  id: string;
  name: string;
  author: string;
  description: string;
  category: 'productivity' | 'security' | 'developer';
  installed: boolean;
  securityBadge: 'Audited' | 'Verified';
}

export const PluginStoreApp: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginItem[]>([
    {
      id: 'plg-1',
      name: 'GitHub Webhook Sync',
      author: 'UNHINGED Core',
      description: 'Stream commits, PR alerts, and issues directly to your realtime channels.',
      category: 'developer',
      installed: true,
      securityBadge: 'Audited'
    },
    {
      id: 'plg-2',
      name: 'Excalidraw Whiteboard',
      author: 'Community',
      description: 'Embedded collaborative diagramming tool inside desktop OS windows.',
      category: 'productivity',
      installed: false,
      securityBadge: 'Verified'
    },
    {
      id: 'plg-3',
      name: 'Vault Sanitizer Sentinel',
      author: 'Security Lab',
      description: 'Automated malware scan and path-traversal audit for imported markdown notes.',
      category: 'security',
      installed: true,
      securityBadge: 'Audited'
    }
  ]);

  const toggleInstall = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, installed: !p.installed } : p))
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d14] text-[#e8e8f0] font-sans p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 font-bold text-sm text-[#55efc4]">
            <ShoppingBag size={18} />
            <span>Plugin Marketplace</span>
          </div>
          <p className="text-xs text-[#a0a0b8]">Discover and install verified extensions for your Web OS.</p>
        </div>
      </div>

      {/* Grid of Plugin Cards */}
      <div className="grid grid-cols-2 gap-4">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className="p-4 rounded-xl bg-white/2 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white">{plugin.name}</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#55efc4]/20 text-[#55efc4] border border-[#55efc4]/30 flex items-center gap-1">
                  <ShieldCheck size={10} /> {plugin.securityBadge}
                </span>
              </div>
              <p className="text-xs text-[#a0a0b8] leading-relaxed mb-3">{plugin.description}</p>
              <div className="text-[10px] text-[#6c6c82]">By {plugin.author}</div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => toggleInstall(plugin.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  plugin.installed
                    ? 'bg-white/10 text-white'
                    : 'bg-[#55efc4] hover:bg-[#48d6af] text-black shadow-md'
                }`}
              >
                {plugin.installed ? (
                  <>
                    <Check size={13} /> Installed
                  </>
                ) : (
                  <>
                    <Download size={13} /> Install Plugin
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

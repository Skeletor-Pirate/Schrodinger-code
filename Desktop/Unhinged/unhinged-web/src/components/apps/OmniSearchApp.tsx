'use client';

import React, { useState } from 'react';
import { Search, Hash, FileText, Bot, Trophy, ArrowRight } from 'lucide-react';

export const OmniSearchApp: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | 'chats' | 'notes' | 'hackathons'>('all');

  const mockResults = [
    { type: 'note', title: '2026-08-05-Standup-Summary.md', category: 'notes', preview: 'Orbit logged PR reviews and vault sync status.' },
    { type: 'chat', title: '#general — Dev discussion', category: 'chats', preview: 'Security policies updated for resolveSafeVaultPath.' },
    { type: 'hackathon', title: 'Global AI Agent Buildathon 2026', category: 'hackathons', preview: 'Build autonomous multi-agent systems with durable note memory.' }
  ];

  const filteredResults = mockResults.filter(
    (r) =>
      (category === 'all' || r.category === category) &&
      (r.title.toLowerCase().includes(query.toLowerCase()) || r.preview.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-[#0d0d14] text-[#e8e8f0] font-sans p-6 overflow-hidden">
      {/* Search Input Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0984e3]" size={18} />
        <input
          type="text"
          placeholder="OmniSearch across chats, Obsidian notes, decisions, and hackathons..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#0984e3] rounded-xl text-sm text-white outline-none transition-all"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {(['all', 'chats', 'notes', 'hackathons'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              category === cat ? 'bg-[#0984e3] text-white' : 'bg-white/5 text-[#a0a0b8] hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredResults.map((res, i) => (
          <div key={i} className="p-3 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                {res.type === 'note' && <FileText size={14} className="text-[#7c3aed]" />}
                {res.type === 'chat' && <Hash size={14} className="text-[#6c5ce7]" />}
                {res.type === 'hackathon' && <Trophy size={14} className="text-[#e84393]" />}
                <span>{res.title}</span>
              </div>
              <p className="text-xs text-[#a0a0b8] mt-1">{res.preview}</p>
            </div>
            <ArrowRight size={14} className="text-[#6c6c82] group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

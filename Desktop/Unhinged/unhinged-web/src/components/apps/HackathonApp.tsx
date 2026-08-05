'use client';

import React, { useState } from 'react';
import { Trophy, Calendar, DollarSign, ExternalLink, Sparkles, Tag, Users } from 'lucide-react';

interface HackathonItem {
  id: string;
  title: string;
  prize: string;
  deadline: string;
  mode: 'Online' | 'Hybrid' | 'In-Person';
  tags: string[];
  summary: string;
  url: string;
}

export const HackathonApp: React.FC = () => {
  const hackathons: HackathonItem[] = [
    {
      id: 'hack-1',
      title: 'Global AI Agent Buildathon 2026',
      prize: '$100,000 USD',
      deadline: 'Aug 25, 2026',
      mode: 'Online',
      tags: ['AI Agents', 'LangGraph', 'Next.js', 'Vector DB'],
      summary: 'Build autonomous multi-agent systems with durable note-based memory and tool execution capabilities.',
      url: 'https://devpost.com'
    },
    {
      id: 'hack-2',
      title: 'Web OS & Developer Tools Innovation Challenge',
      prize: '$50,000 USD',
      deadline: 'Sep 10, 2026',
      mode: 'Hybrid',
      tags: ['TypeScript', 'Obsidian API', 'Prisma', 'Tailwind'],
      summary: 'Create browser-native operating systems, productivity shells, and plugin ecosystems.',
      url: 'https://ethglobal.com'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0d0d14] text-[#e8e8f0] font-sans p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 font-bold text-sm text-[#e84393]">
            <Trophy size={18} />
            <span>Hackathon Finder & AI Summarizer</span>
          </div>
          <p className="text-xs text-[#a0a0b8]">Track upcoming hackathons with AI-generated eligibility summaries.</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {hackathons.map((h) => (
          <div
            key={h.id}
            className="p-5 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{h.title}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#e84393]/20 text-[#e84393] border border-[#e84393]/30">
                    {h.mode}
                  </span>
                </h3>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <DollarSign size={14} /> {h.prize}
                </div>
              </div>

              {/* AI Summary Box */}
              <div className="p-3 rounded-xl bg-[#e84393]/10 border border-[#e84393]/20 mb-3 text-xs text-[#e8e8f0] flex items-start gap-2">
                <Sparkles size={15} className="text-[#e84393] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#e84393]">Orbit AI Summary:</strong> {h.summary}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {h.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#a0a0b8]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-[#6c6c82]">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} /> Deadline: <span className="text-white font-medium">{h.deadline}</span>
              </div>
              <a
                href={h.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#e84393] hover:bg-[#d6307e] text-white font-bold flex items-center gap-1 transition-all"
              >
                <span>Register</span> <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

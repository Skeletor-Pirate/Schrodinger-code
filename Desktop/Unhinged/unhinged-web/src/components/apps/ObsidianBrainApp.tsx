'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Search, 
  Share2, 
  GitCommit, 
  Sparkles, 
  Tag, 
  BookOpen,
  ChevronRight,
  Database
} from 'lucide-react';

interface NoteItem {
  id: string;
  folder: 'chats' | 'memories' | 'decisions' | 'tasks';
  title: string;
  tags: string[];
  frontmatter: Record<string, string>;
  content: string;
  connections: string[];
}

export const ObsidianBrainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'graph'>('graph');
  const [selectedNoteId, setSelectedNoteId] = useState<string>('mem-1');
  const [searchQuery, setSearchQuery] = useState('');

  const notes: NoteItem[] = [
    {
      id: 'mem-1',
      folder: 'memories',
      title: '2026-08-05-Standup-Summary.md',
      tags: ['standup', 'orbit', 'architecture'],
      frontmatter: {
        agent: 'orbit-agent-001',
        timestamp: '2026-08-05T10:15:00Z',
        workspace: 'unhinged-core'
      },
      content: `# Standup Summary — August 5, 2026

## Key Decisions
- Security hardening verified: \`resolveSafeVaultPath\` deployed to prevent path traversal attacks.
- Consolidated documentation into \`project-docs/\` folder.
- Root \`.gitignore\` updated to prevent credential leakage.

## Agent Memory Log
Orbit and Icebound auto-summarized chat logs and committed vector embeddings to Pinecone/MinIO object storage.

[[2026-08-05-Security-Policy.md]]
[[2026-08-05-Sprint-Tasks.md]]`,
      connections: ['mem-2', 'mem-3']
    },
    {
      id: 'mem-2',
      folder: 'decisions',
      title: '2026-08-05-Security-Policy.md',
      tags: ['security', 'rbac', 'admin'],
      frontmatter: {
        author: 'Admin',
        type: 'policy-decision',
        status: 'approved'
      },
      content: `# Security Policy & Access Boundaries

- Admin Panel (\`admin\`) is strictly locked to users with role \`admin\`.
- Non-admin users are denied access with clear error banners.
- System agents Orbit & Icebound operate under workspace scoping and vault path controls.`,
      connections: ['mem-1']
    },
    {
      id: 'mem-3',
      folder: 'tasks',
      title: '2026-08-05-Sprint-Tasks.md',
      tags: ['tasks', 'roadmap', 'phase-a'],
      frontmatter: {
        priority: 'P0',
        assignee: 'team'
      },
      content: `# Sprint Active Tasks

1. [x] Harden agent file-reading tools.
2. [x] Create root \`.gitignore\` for model isolation.
3. [x] Implement complete Windows-style desktop OS.
4. [ ] Enable real-time WebSockets event gateway.`,
      connections: ['mem-1', 'mem-2']
    }
  ];

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  return (
    <div className="flex h-full bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs overflow-hidden">
      {/* Obsidian Brand Left Sidebar */}
      <div className="w-56 bg-[#181825] border-r border-[#313244] flex flex-col shrink-0">
        {/* Obsidian Header with Purple Crystal Logo */}
        <div className="p-3 border-b border-[#313244] flex items-center gap-2 bg-[#11111b]/80">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white shadow-md shadow-purple-900/40">
            <BookOpen size={14} />
          </div>
          <div>
            <div className="font-bold text-xs text-white">Obsidian</div>
            <div className="text-[9px] text-[#a6adc8]">Vault: second-brain</div>
          </div>
        </div>

        {/* View Mode Toggle Tabs */}
        <div className="p-2 border-b border-[#313244] flex items-center gap-1 bg-[#11111b]/40">
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex-1 py-1 px-2 rounded flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-all ${
              activeTab === 'graph'
                ? 'bg-[#7c3aed] text-white'
                : 'text-[#a6adc8] hover:bg-[#313244] hover:text-white'
            }`}
          >
            <GitCommit size={13} />
            <span>Neural Graph</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-1 px-2 rounded flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-[#7c3aed] text-white'
                : 'text-[#a6adc8] hover:bg-[#313244] hover:text-white'
            }`}
          >
            <FileText size={13} />
            <span>Editor</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-[#313244]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6c7086]" size={13} />
            <input
              type="text"
              placeholder="Search vault notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1 bg-[#11111b] border border-[#313244] rounded text-[11px] text-white outline-none focus:border-[#7c3aed]"
            />
          </div>
        </div>

        {/* File Explorer Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          <div>
            <div className="text-[10px] font-bold text-[#a6adc8] uppercase px-1 mb-1 tracking-wider flex items-center gap-1">
              <Folder size={11} className="text-[#7c3aed]" />
              <span>memories /</span>
            </div>
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setActiveTab('editor');
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all ${
                  selectedNoteId === note.id
                    ? 'bg-[#7c3aed]/20 text-purple-300 font-semibold border-l-2 border-[#7c3aed]'
                    : 'text-[#cdd6f4] hover:bg-[#313244]'
                }`}
              >
                <FileText size={12} className="text-[#a6adc8] shrink-0" />
                <span className="truncate">{note.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col bg-[#1e1e2e]">
        {activeTab === 'graph' ? (
          /* Neural Network Graph Visualizer */
          <div className="flex-1 flex flex-col relative bg-[#11111b] overflow-hidden">
            <div className="absolute top-4 left-4 z-10 bg-[#181825]/90 border border-[#313244] p-3 rounded-lg backdrop-blur-md">
              <div className="font-bold text-white text-xs flex items-center gap-2">
                <Sparkles size={14} className="text-[#7c3aed]" />
                <span>Neural Vault Graph View</span>
              </div>
              <div className="text-[10px] text-[#a6adc8] mt-0.5">
                Obsidian notes linked via semantic memory neural graph
              </div>
            </div>

            {/* Interactive SVG Neural Graph representation */}
            <div className="w-full h-full flex items-center justify-center relative">
              <svg className="w-full h-full absolute inset-0">
                {/* Connection lines */}
                <line x1="35%" y1="40%" x2="65%" y2="30%" stroke="#7c3aed" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
                <line x1="35%" y1="40%" x2="50%" y2="70%" stroke="#a855f7" strokeWidth="2" strokeDasharray="4" />
                <line x1="65%" y1="30%" x2="50%" y2="70%" stroke="#00cec9" strokeWidth="2" />
              </svg>

              {/* Node 1 */}
              <div 
                onClick={() => { setSelectedNoteId('mem-1'); setActiveTab('editor'); }}
                className="absolute top-[38%] left-[32%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white shadow-lg shadow-purple-900/50 group-hover:scale-110 transition-transform">
                  <Database size={20} />
                </div>
                <div className="mt-2 text-[10px] font-bold text-center text-white bg-[#181825]/90 px-2 py-0.5 rounded border border-[#313244]">
                  Standup Summary
                </div>
              </div>

              {/* Node 2 */}
              <div 
                onClick={() => { setSelectedNoteId('mem-2'); setActiveTab('editor'); }}
                className="absolute top-[28%] left-[67%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00cec9] to-[#0984e3] flex items-center justify-center text-white shadow-lg shadow-cyan-900/50 group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
                <div className="mt-2 text-[10px] font-bold text-center text-white bg-[#181825]/90 px-2 py-0.5 rounded border border-[#313244]">
                  Security Policy
                </div>
              </div>

              {/* Node 3 */}
              <div 
                onClick={() => { setSelectedNoteId('mem-3'); setActiveTab('editor'); }}
                className="absolute top-[68%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#fdcb6e] to-[#e84393] flex items-center justify-center text-white shadow-lg shadow-amber-900/50 group-hover:scale-110 transition-transform">
                  <Tag size={18} />
                </div>
                <div className="mt-2 text-[10px] font-bold text-center text-white bg-[#181825]/90 px-2 py-0.5 rounded border border-[#313244]">
                  Sprint Tasks
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Markdown Editor Pane */
          <div className="flex-1 flex flex-col bg-[#1e1e2e]">
            {/* Note Frontmatter Header */}
            <div className="p-4 border-b border-[#313244] bg-[#181825]/40">
              <div className="text-base font-bold text-white mb-2">{selectedNote.title}</div>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {Object.entries(selectedNote.frontmatter).map(([k, v]) => (
                  <span key={k} className="px-2 py-0.5 rounded bg-[#313244] text-[#a6adc8]">
                    <strong className="text-purple-300">{k}:</strong> {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Note Content View */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 leading-relaxed font-sans text-sm text-[#cdd6f4]">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed text-[#cdd6f4]">
                {selectedNote.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

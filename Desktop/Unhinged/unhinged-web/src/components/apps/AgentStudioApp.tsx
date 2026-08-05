'use client';

import React, { useState } from 'react';
import { Cpu, Plus, Play, Shield, Code, Save, Sparkles, Check } from 'lucide-react';

export const AgentStudioApp: React.FC = () => {
  const [agentName, setAgentName] = useState('CodeReviewBot');
  const [personaTone, setPersonaTone] = useState('analytical');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a senior software architect agent. Analyze PRs, flag security vulnerabilities, enforce path traversal safety, and write test cases.'
  );
  const [tools, setTools] = useState({
    vault_read: true,
    vault_write: true,
    vault_search: true,
    code_execution: false
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex h-full bg-[#0d0d14] text-[#e8e8f0] font-sans overflow-hidden">
      {/* Sidebar List */}
      <div className="w-56 bg-[#09090f] border-r border-white/5 flex flex-col shrink-0 p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-bold text-xs text-[#fdcb6e]">
            <Cpu size={16} />
            <span>Agent Studio</span>
          </div>
          <button className="p-1 rounded bg-white/5 hover:bg-white/10 text-xs text-white">
            <Plus size={14} />
          </button>
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-[#6c6c82] mb-2 px-1">
          Custom Agents
        </div>
        <div className="space-y-1">
          <button className="w-full text-left p-2 rounded-lg bg-[#fdcb6e]/20 border border-[#fdcb6e]/40 text-xs font-semibold text-white">
            CodeReviewBot
          </button>
          <button className="w-full text-left p-2 rounded-lg bg-white/2 hover:bg-white/5 text-xs text-[#a0a0b8]">
            MeetingSummarizer
          </button>
          <button className="w-full text-left p-2 rounded-lg bg-white/2 hover:bg-white/5 text-xs text-[#a0a0b8]">
            HackathonScout
          </button>
        </div>
      </div>

      {/* Main Studio Editor */}
      <div className="flex-1 flex flex-col bg-[#0b0b11] p-6 overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Configure Agent Persona & Tools</h2>
            <p className="text-xs text-[#a0a0b8]">Attach permissioned vault tools and define system instructions.</p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#fdcb6e] hover:bg-[#e5b75a] text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            {isSaved ? <Check size={14} /> : <Save size={14} />}
            <span>{isSaved ? 'Saved to Vault' : 'Save Agent'}</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#a0a0b8] mb-1">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#fdcb6e]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#a0a0b8] mb-1">Persona Tone</label>
            <select
              value={personaTone}
              onChange={(e) => setPersonaTone(e.target.value)}
              className="w-full bg-[#161622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#fdcb6e]"
            >
              <option value="analytical">Analytical & Strict</option>
              <option value="sarcastic">Sarcastic (Orbit style)</option>
              <option value="chaotic">Chaotic (Icebound style)</option>
            </select>
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-[11px] font-semibold text-[#a0a0b8] mb-1">System Instructions / Prompt</label>
          <textarea
            rows={4}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-[#fdcb6e] font-mono leading-relaxed"
          />
        </div>

        {/* Tool Permissions */}
        <div>
          <label className="block text-[11px] font-semibold text-[#a0a0b8] mb-2">Vault Tool Permissions</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(tools).map(([tool, enabled]) => (
              <label
                key={tool}
                className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 cursor-pointer hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <Shield size={14} className={enabled ? 'text-[#fdcb6e]' : 'text-[#6c6c82]'} />
                  <span className="text-xs font-medium text-white">{tool}</span>
                </div>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => setTools((prev) => ({ ...prev, [tool]: !enabled }))}
                  className="rounded accent-[#fdcb6e]"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

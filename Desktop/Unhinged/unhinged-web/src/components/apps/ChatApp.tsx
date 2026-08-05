'use client';

import React, { useState } from 'react';
import { 
  Hash, 
  MessageSquare, 
  Send, 
  Smile, 
  Paperclip, 
  User, 
  Bot, 
  Sparkles, 
  Search, 
  MoreVertical,
  CheckCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  avatar?: string;
  isAgent?: boolean;
  agentType?: 'orbit' | 'icebound';
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
}

export const ChatApp: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'general' | 'dev-lounge' | 'orbit-dm' | 'icebound-dm'>('general');
  const [inputText, setInputText] = useState('');

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    general: [
      {
        id: '1',
        sender: 'Sarah Lin',
        content: 'Hey team! Welcome to the new UNHINGED workspace OS. Check out the Obsidian vault notes.',
        timestamp: '10:14 AM'
      },
      {
        id: '2',
        sender: 'Orbit Agent',
        isAgent: true,
        agentType: 'orbit',
        content: 'Dry reminder: 3 PRs are pending review, and no, staring at the screen won’t merge them. I logged today’s standup summary to Obsidian.',
        timestamp: '10:15 AM',
        reactions: [{ emoji: '🔥', count: 4 }, { emoji: '🤖', count: 2 }]
      },
      {
        id: '3',
        sender: 'Icebound Agent',
        isAgent: true,
        agentType: 'icebound',
        content: 'Wait, someone broke the deployment pipeline again? I am logging this tragic event straight to neural memory.',
        timestamp: '10:17 AM',
        reactions: [{ emoji: '💀', count: 5 }]
      }
    ],
    'dev-lounge': [
      {
        id: 'dev-1',
        sender: 'Alex Chen',
        content: 'Anyone tested the new path traversal guards in agent-tools.js?',
        timestamp: '09:30 AM'
      },
      {
        id: 'dev-2',
        sender: 'Orbit Agent',
        isAgent: true,
        agentType: 'orbit',
        content: 'All path inputs are strictly sanitized with resolveSafeVaultPath. No sneaky directory escapes allowed.',
        timestamp: '09:32 AM'
      }
    ],
    'orbit-dm': [
      {
        id: 'orb-1',
        sender: 'Orbit Agent',
        isAgent: true,
        agentType: 'orbit',
        content: 'I am Orbit, your sarcastic proactive team assistant. Ask me anything, or give me a task to log to Obsidian.',
        timestamp: '08:00 AM'
      }
    ],
    'icebound-dm': [
      {
        id: 'ice-1',
        sender: 'Icebound Agent',
        isAgent: true,
        agentType: 'icebound',
        content: 'Icebound active. Need real-talk code review, chaos analysis, or problem solving?',
        timestamp: '08:00 AM'
      }
    ]
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Aryan (You)',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), userMsg]
    }));

    const currentText = inputText;
    setInputText('');

    // Simulate Agent Auto-Response in DMs or when tagging bots
    if (activeChannel === 'orbit-dm' || currentText.toLowerCase().includes('@orbit')) {
      setTimeout(() => {
        const orbitReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'Orbit Agent',
          isAgent: true,
          agentType: 'orbit',
          content: `Note taken. I processed "${currentText}" and committed the summary to Obsidian Vault (memories/decisions.md).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => ({
          ...prev,
          [activeChannel]: [...(prev[activeChannel] || []), orbitReply]
        }));
      }, 1000);
    } else if (activeChannel === 'icebound-dm' || currentText.toLowerCase().includes('@icebound')) {
      setTimeout(() => {
        const iceReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          sender: 'Icebound Agent',
          isAgent: true,
          agentType: 'icebound',
          content: `Interesting proposition! Running diagnostic on "${currentText}". Conclusion: High potential, low sleep guaranteed. Logged to neural brain!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => ({
          ...prev,
          [activeChannel]: [...(prev[activeChannel] || []), iceReply]
        }));
      }, 1200);
    }
  };

  return (
    <div className="flex h-full bg-[#0d0d14] text-[#e8e8f0] font-sans overflow-hidden">
      {/* Sidebar Channels & DMs */}
      <div className="w-60 bg-[#09090f] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-[#e8e8f0]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6c5ce7]" />
            <span>UNHINGED Workspace</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* Channels Section */}
          <div>
            <div className="text-[10px] font-bold text-[#6c6c82] uppercase px-2 mb-1 tracking-wider">
              Channels
            </div>
            <button
              onClick={() => setActiveChannel('general')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeChannel === 'general'
                  ? 'bg-[#6c5ce7]/20 text-white font-semibold'
                  : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Hash size={14} className="text-[#6c5ce7]" />
              <span>general</span>
            </button>
            <button
              onClick={() => setActiveChannel('dev-lounge')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeChannel === 'dev-lounge'
                  ? 'bg-[#6c5ce7]/20 text-white font-semibold'
                  : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Hash size={14} className="text-[#00cec9]" />
              <span>dev-lounge</span>
            </button>
          </div>

          {/* System Bots DMs Section */}
          <div>
            <div className="text-[10px] font-bold text-[#6c6c82] uppercase px-2 mb-1 tracking-wider">
              System AI Bots
            </div>
            <button
              onClick={() => setActiveChannel('orbit-dm')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeChannel === 'orbit-dm'
                  ? 'bg-[#00cec9]/20 text-white font-semibold'
                  : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#00cec9]/20 border border-[#00cec9]/40 flex items-center justify-center">
                  <Bot size={12} className="text-[#00cec9]" />
                </div>
                <span>Orbit Agent</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00cec9]" />
            </button>
            <button
              onClick={() => setActiveChannel('icebound-dm')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeChannel === 'icebound-dm'
                  ? 'bg-[#fd79a8]/20 text-white font-semibold'
                  : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#fd79a8]/20 border border-[#fd79a8]/40 flex items-center justify-center">
                  <Sparkles size={12} className="text-[#fd79a8]" />
                </div>
                <span>Icebound Agent</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#fd79a8]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col bg-[#0b0b11]">
        {/* Top Header */}
        <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#0d0d14]/50">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-[#6c5ce7]" />
            <span className="font-bold text-xs text-[#e8e8f0]">
              {activeChannel === 'general' && 'general'}
              {activeChannel === 'dev-lounge' && 'dev-lounge'}
              {activeChannel === 'orbit-dm' && 'Orbit Agent (Direct Message)'}
              {activeChannel === 'icebound-dm' && 'Icebound Agent (Direct Message)'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[#a0a0b8]">
            <Search size={15} className="cursor-pointer hover:text-white" />
            <MoreVertical size={15} className="cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(messages[activeChannel] || []).map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 group">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.agentType === 'orbit'
                    ? 'bg-[#00cec9]/20 text-[#00cec9] border border-[#00cec9]/40'
                    : msg.agentType === 'icebound'
                    ? 'bg-[#fd79a8]/20 text-[#fd79a8] border border-[#fd79a8]/40'
                    : 'bg-white/10 text-white'
                }`}
              >
                {msg.isAgent ? <Bot size={16} /> : msg.sender[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold ${
                      msg.agentType === 'orbit'
                        ? 'text-[#00cec9]'
                        : msg.agentType === 'icebound'
                        ? 'text-[#fd79a8]'
                        : 'text-[#e8e8f0]'
                    }`}
                  >
                    {msg.sender}
                  </span>
                  {msg.isAgent && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-[#a0a0b8]">
                      SYSTEM BOT
                    </span>
                  )}
                  <span className="text-[10px] text-[#6c6c82]">{msg.timestamp}</span>
                </div>

                <div className="mt-1 text-xs text-[#d0d0e0] leading-relaxed break-words bg-white/2 p-2.5 rounded-xl border border-white/5 max-w-2xl">
                  {msg.content}
                </div>

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {msg.reactions.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/5 text-[#a0a0b8] flex items-center gap-1"
                      >
                        {r.emoji} {r.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Composer */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-[#09090f]">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-[#6c5ce7]/50 rounded-xl px-3 py-2 transition-all">
            <Paperclip size={16} className="text-[#6c6c82] hover:text-white cursor-pointer" />
            <input
              type="text"
              placeholder={
                activeChannel.includes('dm')
                  ? 'Message bot directly...'
                  : 'Send a message or @mention Orbit / Icebound...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white outline-none placeholder-[#6c6c82]"
            />
            <Smile size={16} className="text-[#6c6c82] hover:text-white cursor-pointer" />
            <button
              type="submit"
              className="w-7 h-7 rounded-lg bg-[#6c5ce7] hover:bg-[#5b4bc4] flex items-center justify-center text-white transition-all"
            >
              <Send size={13} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

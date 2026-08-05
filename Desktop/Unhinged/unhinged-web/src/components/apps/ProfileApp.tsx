'use client';

import React from 'react';
import { User, Shield, Mail, Key, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProfileApp: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#0d0d14] text-[#e8e8f0] font-sans p-6 overflow-y-auto space-y-6">
      {/* Header Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#6c5ce7]/20 to-[#00cec9]/20 border border-white/10 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6c5ce7] to-[#00cec9] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-950/40">
          A
        </div>
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Aryan</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <Shield size={10} /> Workspace Admin
            </span>
          </h2>
          <p className="text-xs text-[#a0a0b8]">aryan@unhinged.io</p>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-[#a0a0b8] flex items-center gap-2">
            <Mail size={14} className="text-[#6c5ce7]" /> Primary Auth
          </span>
          <span className="text-white font-medium">Google OAuth 2.0 (Verified)</span>
        </div>
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-[#a0a0b8] flex items-center gap-2">
            <Key size={14} className="text-[#00cec9]" /> MFA Security
          </span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 size={13} /> Enabled
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#a0a0b8] flex items-center gap-2">
            <Sparkles size={14} className="text-[#fd79a8]" /> Agent Interaction Permissions
          </span>
          <span className="text-white font-medium">Full Access (Orbit & Icebound)</span>
        </div>
      </div>
    </div>
  );
};

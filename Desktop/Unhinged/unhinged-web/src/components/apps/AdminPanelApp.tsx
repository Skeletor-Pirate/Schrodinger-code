'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Lock, 
  FileText, 
  Activity, 
  Settings, 
  Search, 
  Check, 
  X,
  Key
} from 'lucide-react';

export const AdminPanelApp: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Admin toggle for demo
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'audit' | 'policies'>('approvals');

  const [pendingUsers, setPendingUsers] = useState([
    { id: '1', name: 'Jordan Miller', email: 'jordan.m@example.com', date: '2026-08-05', role: 'member' },
    { id: '2', name: 'Devon Vance', email: 'devon.v@example.com', date: '2026-08-04', role: 'member' }
  ]);

  const [approvedUsers, setApprovedUsers] = useState([
    { id: 'usr-1', name: 'Aryan', email: 'aryan@unhinged.io', role: 'admin', status: 'active' },
    { id: 'usr-2', name: 'Sarah Lin', email: 'sarah@unhinged.io', role: 'member', status: 'active' },
    { id: 'usr-3', name: 'Alex Chen', email: 'alex@unhinged.io', role: 'member', status: 'active' }
  ]);

  const auditLogs = [
    { id: 'log-1', actor: 'Aryan (Admin)', action: 'SECURITY_HARDENING', target: 'agent-tools.js', timestamp: '2026-08-05 15:40' },
    { id: 'log-2', actor: 'Orbit Agent', action: 'VAULT_WRITE', target: 'memories/2026-08-05.md', timestamp: '2026-08-05 10:15' },
    { id: 'log-3', actor: 'Icebound Agent', action: 'TOOL_EXECUTE', target: 'code-analyzer', timestamp: '2026-08-05 10:17' }
  ];

  const handleApprove = (id: string) => {
    const userToApprove = pendingUsers.find((u) => u.id === id);
    if (userToApprove) {
      setApprovedUsers((prev) => [
        ...prev,
        { id: `usr-${Date.now()}`, name: userToApprove.name, email: userToApprove.email, role: 'member', status: 'active' }
      ]);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleReject = (id: string) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // If user is not admin, show strict Access Denied screen
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0d0d14] text-[#e8e8f0] p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-lg shadow-red-950/40">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Access Restricted — Admin Only</h2>
        <p className="text-xs text-[#a0a0b8] max-w-sm mb-6">
          You are currently logged in as a standard member. Admin console access requires workspace administrator authorization.
        </p>

        {/* Demo privilege switcher */}
        <button
          onClick={() => setIsAdmin(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all flex items-center gap-2"
        >
          <Key size={14} />
          <span>Simulate Admin Privilege (Demo)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#0d0d14] text-[#e8e8f0] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-52 bg-[#09090f] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-red-400">
            <ShieldCheck size={16} />
            <span>Admin Console</span>
          </div>
          <button
            onClick={() => setIsAdmin(false)}
            className="text-[10px] text-[#6c6c82] hover:text-white underline"
            title="Switch to Non-Admin View"
          >
            Lock
          </button>
        </div>

        <div className="flex-1 p-2 space-y-1">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'approvals'
                ? 'bg-red-500/20 text-white font-semibold border-l-2 border-red-500'
                : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <UserCheck size={14} className="text-red-400" />
            <span>Pending Signups ({pendingUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-red-500/20 text-white font-semibold border-l-2 border-red-500'
                : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Lock size={14} className="text-cyan-400" />
            <span>User Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-red-500/20 text-white font-semibold border-l-2 border-red-500'
                : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Activity size={14} className="text-amber-400" />
            <span>Audit Trail Logs</span>
          </button>
        </div>
      </div>

      {/* Main Admin Dashboard */}
      <div className="flex-1 flex flex-col bg-[#0b0b11] overflow-hidden">
        {activeTab === 'approvals' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-1">User Registration Approvals</h3>
            <p className="text-xs text-[#a0a0b8] mb-4">
              Review and grant workspace access to pending user registration requests.
            </p>

            {pendingUsers.length === 0 ? (
              <div className="p-8 text-center bg-white/2 rounded-xl border border-white/5 text-xs text-[#6c6c82]">
                No pending signup requests. All users are reviewed!
              </div>
            ) : (
              <div className="space-y-2">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-[#a0a0b8]">{user.email} — Requested {user.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <Check size={13} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <X size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-1">Workspace User Directory</h3>
            <p className="text-xs text-[#a0a0b8] mb-4">Active workspace members and role assignments.</p>

            <div className="space-y-2">
              {approvedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white">{user.name}</div>
                    <div className="text-[10px] text-[#a0a0b8]">{user.email}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-[#a0a0b8]'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-bold text-white mb-1">System Audit Trail Logs</h3>
            <p className="text-xs text-[#a0a0b8] mb-4">Track security events, agent tool executions, and vault writes.</p>

            <div className="space-y-2 font-mono">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-white/2 border border-white/5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold mb-1">
                    <span>[{log.action}] {log.target}</span>
                    <span className="text-[#6c6c82] font-normal">{log.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-[#a0a0b8]">Actor: {log.actor}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

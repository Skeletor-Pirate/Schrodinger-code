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
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [adminEmail, setAdminEmail] = useState<string>('aryanarora26110@gmail.com');
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'audit'>('approvals');

  const [pendingUsers, setPendingUsers] = useState([
    { id: 'p-1', name: 'Jordan Miller', email: 'jordan.m@example.com', date: '2026-08-05', role: 'member' },
    { id: 'p-2', name: 'Devon Vance', email: 'devon.v@example.com', date: '2026-08-04', role: 'member' }
  ]);

  const [approvedUsers, setApprovedUsers] = useState([
    { id: 'usr-1', name: 'Aryan (Creator)', email: 'aryanarora26110@gmail.com', role: 'admin', status: 'active' },
    { id: 'usr-2', name: 'Sarah Lin', email: 'sarah@unhinged.io', role: 'member', status: 'active' },
    { id: 'usr-3', name: 'Alex Chen', email: 'alex@unhinged.io', role: 'member', status: 'active' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'log-1', actor: 'aryanarora26110@gmail.com', action: 'SECURITY_HARDENING', target: 'agent-tools.js', timestamp: '2026-08-05 15:40' },
    { id: 'log-2', actor: 'Orbit Agent', action: 'VAULT_WRITE', target: 'memories/2026-08-05.md', timestamp: '2026-08-05 10:15' },
    { id: 'log-3', actor: 'Icebound Agent', action: 'TOOL_EXECUTE', target: 'code-analyzer', timestamp: '2026-08-05 10:17' }
  ]);

  const handleApprove = (id: string) => {
    const userToApprove = pendingUsers.find((u) => u.id === id);
    if (userToApprove) {
      setApprovedUsers((prev) => [
        ...prev,
        { id: `usr-${Date.now()}`, name: userToApprove.name, email: userToApprove.email, role: userToApprove.role, status: 'active' }
      ]);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      // Log event
      setAuditLogs((prev) => [
        { id: `log-${Date.now()}`, actor: adminEmail, action: 'USER_APPROVE', target: userToApprove.email, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
        ...prev
      ]);
    }
  };

  const handleReject = (id: string) => {
    const userToReject = pendingUsers.find((u) => u.id === id);
    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    if (userToReject) {
      setAuditLogs((prev) => [
        { id: `log-${Date.now()}`, actor: adminEmail, action: 'USER_REJECT', target: userToReject.email, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
        ...prev
      ]);
    }
  };

  const toggleUserStatus = (id: string) => {
    setApprovedUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          // Log event
          setAuditLogs((l) => [
            { id: `log-${Date.now()}`, actor: adminEmail, action: nextStatus === 'suspended' ? 'USER_SUSPEND' : 'USER_ACTIVATE', target: u.email, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
            ...l
          ]);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const toggleUserRole = (id: string) => {
    setApprovedUsers((prev) =>
      prev.map((u) => {
        if (u.id === id && u.email !== 'aryanarora26110@gmail.com') {
          const nextRole = u.role === 'admin' ? 'member' : 'admin';
          // Log event
          setAuditLogs((l) => [
            { id: `log-${Date.now()}`, actor: adminEmail, action: 'USER_ROLE_CHANGE', target: `${u.email} to ${nextRole}`, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) },
            ...l
          ]);
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  // If user is not admin, show strict Access Denied screen
  if (!isAdmin || adminEmail !== 'aryanarora26110@gmail.com') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0b0c10] text-[#e8e8f0] p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-sm font-bold text-white mb-1">Access Restricted — Admin Only</h2>
        <p className="text-xs text-[#a0a0b8] max-w-sm mb-6 leading-relaxed">
          Admin console access requires authentication as the bootstrapped system owner account (aryanarora26110@gmail.com).
        </p>

        {/* Demo privilege switcher */}
        <button
          onClick={() => {
            setIsAdmin(true);
            setAdminEmail('aryanarora26110@gmail.com');
          }}
          className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-100 hover:text-white border border-red-500/30 font-semibold text-xs transition-all flex items-center gap-2"
        >
          <Key size={14} />
          <span>Authenticate as aryanarora26110@gmail.com</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#0b0c10] text-[#e8e8f0] font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-56 bg-[#0f1015] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-red-400">
            <ShieldCheck size={16} />
            <span>Admin Console</span>
          </div>
          <button
            onClick={() => {
              setIsAdmin(false);
              setAdminEmail('guest@example.com');
            }}
            className="text-[10px] text-[#6c6c82] hover:text-white underline"
            title="Lock Console / Sign Out"
          >
            Lock
          </button>
        </div>

        <div className="flex-1 p-2.5 space-y-1">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'approvals'
                ? 'bg-red-500/10 text-white border-l-2 border-red-500'
                : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <UserCheck size={14} className="text-red-400" />
            <span>Pending Signups ({pendingUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-red-500/10 text-white border-l-2 border-red-500'
                : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Lock size={14} className="text-cyan-400" />
            <span>User Directory ({approvedUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'audit'
                ? 'bg-red-500/10 text-white border-l-2 border-red-500'
                : 'text-[#a0a0b8] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Activity size={14} className="text-amber-400" />
            <span>Audit Trail Logs</span>
          </button>
        </div>

        <div className="p-3 border-t border-white/5 bg-[#0a0a0f] text-[10px] text-[#6c6c82]">
          <div>Logged in as:</div>
          <div className="text-white truncate font-medium mt-0.5">{adminEmail}</div>
        </div>
      </div>

      {/* Main Admin Dashboard */}
      <div className="flex-1 flex flex-col bg-[#0b0c10] overflow-hidden">
        {activeTab === 'approvals' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a0a0b8] mb-1">User Registration Approvals</h3>
            <p className="text-xs text-[#6c6c82] mb-4">
              Review and grant workspace access to pending registration requests.
            </p>

            {pendingUsers.length === 0 ? (
              <div className="p-8 text-center bg-white/2 rounded-xl border border-white/5 text-xs text-[#6c6c82]">
                No pending signup requests. All users have been reviewed.
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
                      <div className="text-[10px] text-[#6c6c82]">{user.email} — Requested {user.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1 transition-all"
                      >
                        <Check size={13} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="px-3 py-1 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/20 text-[11px] font-semibold flex items-center gap-1 transition-all"
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a0a0b8] mb-1">Workspace User Directory</h3>
            <p className="text-xs text-[#6c6c82] mb-4">Manage roles and revoke workspace access instantly.</p>

            <div className="space-y-2">
              {approvedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{user.name}</span>
                      {user.email === 'aryanarora26110@gmail.com' && (
                        <span className="text-[8px] px-1 py-0.5 rounded bg-red-500/10 text-red-400 font-bold border border-red-500/20 uppercase">SYSTEM CREATOR</span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#6c6c82] mt-0.5">{user.email}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role toggler */}
                    <button
                      onClick={() => toggleUserRole(user.id)}
                      disabled={user.email === 'aryanarora26110@gmail.com'}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                        user.role === 'admin' 
                          ? 'bg-red-500/15 text-red-400 border border-red-500/20' 
                          : 'bg-white/5 text-[#a0a0b8] hover:bg-white/10'
                      }`}
                    >
                      {user.role}
                    </button>

                    {/* Suspend/Revoke button */}
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      disabled={user.email === 'aryanarora26110@gmail.com'}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        user.status === 'suspended'
                          ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20'
                          : 'bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20'
                      }`}
                    >
                      {user.status === 'suspended' ? 'Activate' : 'Revoke Access'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#a0a0b8] mb-1">System Audit Trail Logs</h3>
            <p className="text-xs text-[#6c6c82] mb-4">Track administrative, security, and data access events.</p>

            <div className="space-y-2 font-mono">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-white/2 border border-white/5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-red-400 font-bold mb-1">
                    <span>[{log.action}] {log.target}</span>
                    <span className="text-[#6c6c82] font-normal">{log.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-[#6c6c82]">Actor: {log.actor}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

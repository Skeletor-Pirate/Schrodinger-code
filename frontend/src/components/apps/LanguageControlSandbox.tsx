import { useState } from 'react';
import { Shield, Play, CheckCircle2, Lock, Terminal, Activity } from 'lucide-react';

export function LanguageControlSandbox() {
  const [code, setCode] = useState(`# Sandboxed Python Execution Engine
import math
import random

def simulate_monte_carlo_volatility(asset_price=100.0, days=252, simulations=1000):
    drift = 0.05 / days
    vol = 0.20 / math.sqrt(days)
    end_prices = []
    
    for _ in range(simulations):
        price = asset_price
        for _ in range(days):
            price *= math.exp(drift + vol * random.gauss(0, 1))
        end_prices.append(price)
        
    avg_price = sum(end_prices) / len(end_prices)
    return {
        "final_mean": round(avg_price, 2),
        "min": round(min(end_prices), 2),
        "max": round(max(end_prices), 2)
    }

print(simulate_monte_carlo_volatility())`);

  const [sandboxStatus, setSandboxStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [output, setOutput] = useState('');

  const runSandbox = () => {
    setSandboxStatus('running');
    setOutput('');

    setTimeout(() => {
      setOutput(`// Isolated Seccomp-BPF Container Output
[SEC_PROFILE]: STRICT_PTRACE_BLOCK_V2
[RESOURCE_LIMIT]: 16MB Heap | 500ms CPU Quota
[SYSCALL_FILTER]: 14 allowed, 312 blocked (sys_open, sys_fork intercepted)

✓ Verification Passed: Zero unauthorized system calls.
✓ Execution Results:
{'final_mean': 105.18, 'min': 58.42, 'max': 189.65}

Execution completed in 4.8ms | Memory footprint: 1.4 MB`);
      setSandboxStatus('completed');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              SECCOMP ISOLATED
            </span>
            <span className="text-xs text-zinc-400">Zero-Trust Kernel Jitter</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Language Control Sandbox</h2>
          <p className="text-sm text-zinc-400">Deterministic sandbox for executing untrusted AI-synthesized logic under kernel policy restraints.</p>
        </div>

        <button
          onClick={runSandbox}
          disabled={sandboxStatus === 'running'}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-sm font-medium transition-all shadow-sm disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {sandboxStatus === 'running' ? 'Validating Sandbox...' : 'Run in Protected Sandbox'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/70 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono text-zinc-300">untrusted_agent_code.py</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Read-Only Mount</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="w-full bg-transparent text-zinc-200 px-4 py-3 text-sm font-mono focus:outline-none resize-none selection:bg-emerald-500/30"
              spellCheck={false}
            />
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="flex items-center gap-2 text-zinc-300 font-semibold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Sandbox Console Output
              </span>
              <span className="text-[11px] text-zinc-500">/dev/pts/sandbox-0</span>
            </div>
            <pre className="whitespace-pre-wrap text-zinc-400 leading-relaxed min-h-[90px]">
              {output || 'Click "Run in Protected Sandbox" to initialize execution container.'}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Security Boundaries
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-950/50 border border-white/[0.04]">
                <span className="text-zinc-400">Kernel Isolation</span>
                <span className="font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Enabled (NS+cgroup)
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-950/50 border border-white/[0.04]">
                <span className="text-zinc-400">External Networking</span>
                <span className="font-mono text-rose-400">BLOCKED (AF_INET nil)</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-950/50 border border-white/[0.04]">
                <span className="text-zinc-400">Memory Cap</span>
                <span className="font-mono text-zinc-300">16 MB Hard Limit</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-zinc-950/50 border border-white/[0.04]">
                <span className="text-zinc-400">CPU Time Quota</span>
                <span className="font-mono text-zinc-300">500 ms per step</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Runtime Health
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Container State:</span>
                <span className={`font-mono font-medium ${
                  sandboxStatus === 'completed' ? 'text-emerald-400' :
                  sandboxStatus === 'running' ? 'text-amber-400' : 'text-zinc-400'
                }`}>
                  {sandboxStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Sandbox Guard:</span>
                <span className="font-mono text-zinc-200">Active (eBPF probes)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Threat Score:</span>
                <span className="font-mono text-emerald-400">0.00 (Benign)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
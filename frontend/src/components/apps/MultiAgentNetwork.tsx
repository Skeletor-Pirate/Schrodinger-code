import { useState, useEffect } from 'react';
import { AgentState } from '../../types';
import { Play, RotateCcw, CheckCircle2, Loader2, Sparkles, Layers } from 'lucide-react';

export function MultiAgentNetwork() {
  const [agents, setAgents] = useState<AgentState[]>([
    { name: 'Planner', role: 'Task Decomposition', status: 'completed', output: 'Synthesizing target requirements into 5 sub-graphs', color: '#6366f1' },
    { name: 'Quant Agent', role: 'Financial Math', status: 'completed', output: 'Formulating Black-Scholes PDE & Jump Diffusion parameters', color: '#8b5cf6' },
    { name: 'Systems Agent', role: 'Memory Optimization', status: 'running', output: 'Profiling cache line alignments & vectorizing loops', color: '#06b6d4' },
    { name: 'Risk Agent', role: 'Drawdown Invariant', status: 'idle', output: 'Awaiting synthesized AST for VaR stress validation', color: '#f59e0b' },
    { name: 'QA Engineer', role: 'Boundary Testing', status: 'idle', output: 'Generating property-based test suites', color: '#10b981' },
    { name: 'Synthesizer', role: 'Final Binary Merge', status: 'idle', output: 'Pending upstream verification pass', color: '#ec4899' },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const runPipeline = () => {
    setIsRunning(true);
    // Reset all to running sequentially
    let step = 0;
    const interval = setInterval(() => {
      setAgents(prev => prev.map((agent, i) => {
        if (i < step) return { ...agent, status: 'completed' as const };
        if (i === step) return { ...agent, status: 'running' as const, output: `Executing ${agent.name} sub-graph node...` };
        return { ...agent, status: 'idle' as const };
      }));

      step++;
      if (step > 6) {
        clearInterval(interval);
        setIsRunning(false);
        setAgents(prev => prev.map(a => ({ ...a, status: 'completed' as const })));
      }
    }, 700);
  };

  const resetPipeline = () => {
    setAgents([
      { name: 'Planner', role: 'Task Decomposition', status: 'completed', output: 'Synthesizing target requirements into 5 sub-graphs', color: '#6366f1' },
      { name: 'Quant Agent', role: 'Financial Math', status: 'completed', output: 'Formulating Black-Scholes PDE & Jump Diffusion parameters', color: '#8b5cf6' },
      { name: 'Systems Agent', role: 'Memory Optimization', status: 'running', output: 'Profiling cache line alignments & vectorizing loops', color: '#06b6d4' },
      { name: 'Risk Agent', role: 'Drawdown Invariant', status: 'idle', output: 'Awaiting synthesized AST for VaR stress validation', color: '#f59e0b' },
      { name: 'QA Engineer', role: 'Boundary Testing', status: 'idle', output: 'Generating property-based test suites', color: '#10b981' },
      { name: 'Synthesizer', role: 'Final Binary Merge', status: 'idle', output: 'Pending upstream verification pass', color: '#ec4899' },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              LANGGRAPH STATEGRAPH
            </span>
            <span className="text-xs text-zinc-400">Cyclic Multi-Agent Coordination</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Multi-Agent Network Architecture</h2>
          <p className="text-sm text-zinc-400">Directed acyclic state graph orchestrating 6 autonomous domain-specialized agents.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetPipeline}
            disabled={isRunning}
            className="p-2 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Stepping Graph...' : 'Execute Full Graph'}
          </button>
        </div>
      </div>

      {/* Agent Workflow Cards */}
      <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          State Machine Execution Trace
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, index) => (
            <div
              key={agent.name}
              className={`rounded-xl border p-4 transition-all ${
                agent.status === 'running' 
                  ? 'border-indigo-500/60 bg-indigo-950/20 shadow-lg shadow-indigo-500/10' 
                  : agent.status === 'completed'
                  ? 'border-emerald-500/30 bg-zinc-900/60'
                  : 'border-white/[0.06] bg-zinc-950/40 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-500">0{index + 1}</span>
                  <span className="font-semibold text-sm text-zinc-100">{agent.name}</span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                  agent.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  agent.status === 'running' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {agent.status.toUpperCase()}
                </span>
              </div>

              <div className="text-xs font-mono text-indigo-300/80 mb-2">{agent.role}</div>
              <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px] bg-zinc-950/60 p-2 rounded-lg border border-white/[0.04]">
                {agent.output}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {agents.filter(a => a.status === 'completed').length} / 6
          </div>
          <div className="text-xs text-zinc-400 mt-1">Completed Nodes</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-400">
            {agents.filter(a => a.status === 'running').length}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Active Thread</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-zinc-400">
            {agents.filter(a => a.status === 'idle').length}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Pending Invariant Checks</div>
        </div>
      </div>
    </div>
  );
}
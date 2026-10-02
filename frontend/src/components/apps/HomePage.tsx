import { useState, useMemo } from 'react';
import { 
  Cpu, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  FileCode2, 
  Zap,
  Atom,
  TrendingUp,
  Terminal,
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { QuantumCore3D } from '../QuantumCore3D';

interface Props {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onDocsLoad: (content: string) => void;
  onNavigate?: (id: number) => void;
}

export function HomePage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'systems' | 'telemetry'>('all');
  const [interactiveVfsPath, setInteractiveVfsPath] = useState('/quant/black_scholes_simd.cpp');

  const flagshipEngines = [
    { id: 3, name: 'VirtualFsExplorer', category: 'systems', tag: 'FUSE VFS', metric: '0.04ms Cache', desc: 'On-the-fly generative filesystem backed by LLMs & LRU cache' },
    { id: 4, name: 'SandboxRunner', category: 'ai', tag: 'RLVR Policy', metric: '+0.942 PRM', desc: 'Process Reward Model & verification invariant evaluation' },
    { id: 5, name: 'MultiAgentNetwork', category: 'ai', tag: 'LangGraph', metric: '6 Cores', desc: 'Cyclic DAG state graph coordinating autonomous agent workers' },
    { id: 9, name: 'CppAdvancedPanel', category: 'systems', tag: 'SIMD AVX', metric: '21.4x Speedup', desc: 'Automated Python-to-C++20 AST JIT compilation engine' },
    { id: 13, name: 'SpatialTopology3D', category: 'telemetry', tag: 'WebGL 2.0', metric: '60 FPS', desc: 'High-dimensional latent policy manifold interactive projection' },
    { id: 19, name: 'LanguageControlSandbox', category: 'systems', tag: 'Seccomp-BPF', metric: '14 Syscalls', desc: 'Zero-trust kernel sandbox with deterministic memory quota' },
    { id: 17, name: 'BacktestTerminal', category: 'telemetry', tag: 'Quant Engine', metric: 'Sharpe 2.14', desc: 'High-frequency algorithmic trading backtester & risk analyzer' },
    { id: 23, name: 'ArchitectureProtocol', category: 'systems', tag: 'Core Schema', metric: 'Spec v1.0', desc: 'Full-stack systems protocol specification & memory mapping' },
  ];

  const filteredEngines = useMemo(() => {
    if (activeTab === 'all') return flagshipEngines;
    return flagshipEngines.filter(e => e.category === activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto">
      {/* Flagship Hero Stage */}
      <section className="relative pt-6 sm:pt-12 text-center space-y-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-[11px] font-mono tracking-widest text-[#86868b] uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff] animate-pulse"></span>
            Superposition Systems Architecture // v1.0.4
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-[#f5f5f7] leading-[1.05]"
          >
            Schrödinger's <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f5f5f7] to-[#86868b]">
              Codebase.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Where code exists in mathematical superposition until verified. 
            A high-assurance engineering platform combining <span className="text-[#f5f5f7] font-medium">Generative RLVR Filesystems</span>, 
            <span className="text-[#f5f5f7] font-medium"> LangGraph Agent Swarms</span>, and 
            <span className="text-[#f5f5f7] font-medium"> bare-metal C++ SIMD compilation</span>.
          </motion.p>
        </div>

        {/* Interactive 3D Quantum Core Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-4xl mx-auto rounded-3xl border border-white/[0.08] bg-[#070709] shadow-apple-card overflow-hidden"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2997ff]/10 rounded-full blur-[100px] pointer-events-none" />

          {/* 3D WebGL Canvas */}
          <div className="h-[360px] sm:h-[420px] w-full">
            <QuantumCore3D />
          </div>

          {/* Floating HUD Caption */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-white/[0.08] bg-black/70 backdrop-blur-xl text-xs font-mono text-[#86868b]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#30d158]"></span>
              <span className="text-[#f5f5f7]">State Vector:</span>
              <span>|Ψ⟩ = 0.707|Clean Invariant⟩ + 0.707|AVX-512 SIMD⟩</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>Coherence: 99.98%</span>
              <span className="text-zinc-600">•</span>
              <span>Purity: 1.000</span>
            </div>
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate && onNavigate(3)} // Launch VFS Explorer
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#f5f5f7] hover:bg-white text-black font-semibold text-sm tracking-tight shadow-md transition-all active:scale-[0.98]"
          >
            Launch Interactive Workstation
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate && onNavigate(23)} // Architecture Protocol
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f5f7] font-medium text-sm tracking-tight transition-all active:scale-[0.98]"
          >
            Inspect Systems Spec
          </button>
        </div>
      </section>

      {/* Monumental Hardware Telemetry Specs (Apple Pro Style) */}
      <section className="border-y border-white/[0.08] py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="space-y-1.5 sm:border-r border-white/[0.06] sm:pr-6">
            <div className="spec-number text-4xl sm:text-5xl lg:text-6xl text-[#f5f5f7]">21.4x</div>
            <div className="text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider">C++ SIMD JIT Boost</div>
            <p className="text-xs text-[#86868b] leading-relaxed">AVX-512 auto-vectorization across quant matrix kernels</p>
          </div>

          <div className="space-y-1.5 sm:border-r border-white/[0.06] sm:pr-6">
            <div className="spec-number text-4xl sm:text-5xl lg:text-6xl text-[#30d158]">0.02ms</div>
            <div className="text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider">JIT Loop Latency</div>
            <p className="text-xs text-[#86868b] leading-relaxed">Deterministic hot-loop execution with zero garbage collection</p>
          </div>

          <div className="space-y-1.5 sm:border-r border-white/[0.06] sm:pr-6">
            <div className="spec-number text-4xl sm:text-5xl lg:text-6xl text-[#2997ff]">6 Cores</div>
            <div className="text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider">LangGraph Consensus</div>
            <p className="text-xs text-[#86868b] leading-relaxed">Planner, Quant, Systems, Risk, QA, and Synthesizer state machine</p>
          </div>

          <div className="space-y-1.5">
            <div className="spec-number text-4xl sm:text-5xl lg:text-6xl text-[#ffd60a]">100%</div>
            <div className="text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider">Verifiable Rewards</div>
            <p className="text-xs text-[#86868b] leading-relaxed">Process Reward Model (PRM) combined with real financial returns</p>
          </div>
        </div>
      </section>

      {/* Flagship Bento Engineering Pillars */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#2997ff] uppercase">CORE ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f5f7] mt-1">
              Industrial-Grade Systems Foundations.
            </h2>
          </div>
          <p className="text-xs text-[#86868b] max-w-md sm:text-right">
            Every layer engineered for microsecond determinism, strict memory safety, and verifiable RL feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Large Span FUSE Virtual Filesystem */}
          <div 
            onClick={() => onNavigate && onNavigate(3)}
            className="md:col-span-2 rounded-3xl border border-white/[0.08] bg-[#0d0d12] hover:border-white/[0.18] p-6 sm:p-8 cursor-pointer transition-all space-y-6 group shadow-apple-card flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/[0.05] border border-white/[0.08] text-[#f5f5f7]">
                  FUSE VIRTUAL FILESYSTEM
                </span>
                <span className="text-xs text-[#2997ff] flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform">
                  Interactive Mount <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#f5f5f7] group-hover:text-white transition-colors">
                Generative RLVR Filesystem Layer
              </h3>
              <p className="text-sm text-[#86868b] leading-relaxed max-w-xl">
                Operates directly at the kernel boundary via FUSE. Files are synthesized on-the-fly through LangGraph agents, resident in memory with strict LRU eviction bounds and zero disk wear.
              </p>
            </div>

            {/* Interactive Terminal Mock Preview */}
            <div className="rounded-xl border border-white/[0.06] bg-[#060608] p-4 font-mono text-xs text-[#86868b] space-y-1.5">
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/[0.04]">
                <span className="text-zinc-400">/vfs/mount/stats</span>
                <span className="text-[#30d158]">Active (14 inodes)</span>
              </div>
              <div className="text-zinc-300">$ cat /vfs/quant/black_scholes_simd.cpp</div>
              <div className="text-[#2997ff]">[AVX-512 SIMD Kernel: 8 doubles/register, 0.02ms latency]</div>
              <div className="text-zinc-500">Cache hit ratio: 94.2% | GC eviction: LRU (1,024 MB bound)</div>
            </div>
          </div>

          {/* Pillar 2: LangGraph Agent Swarm */}
          <div 
            onClick={() => onNavigate && onNavigate(5)}
            className="rounded-3xl border border-white/[0.08] bg-[#0d0d12] hover:border-white/[0.18] p-6 sm:p-8 cursor-pointer transition-all space-y-6 group shadow-apple-card flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/[0.05] border border-white/[0.08] text-[#f5f5f7]">
                  LANGGRAPH DAG
                </span>
                <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:text-[#2997ff] group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-xl font-bold text-[#f5f5f7] group-hover:text-white transition-colors">
                6-Tier Agent Consensus Swarm
              </h3>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Autonomous state machine: Planner decomposes, Quant formulates, Systems optimizes, Risk validates, QA tests, and Synthesizer compiles.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {['Planner Core', 'Quant Engine', 'Systems JIT', 'Risk Invariant'].map((node, i) => (
                <div key={node} className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/[0.04] text-xs font-mono">
                  <span className="text-zinc-300">0{i+1} {node}</span>
                  <span className="text-[#30d158] text-[10px]">VERIFIED</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 3: SIMD C++ Transpiler */}
          <div 
            onClick={() => onNavigate && onNavigate(9)}
            className="rounded-3xl border border-white/[0.08] bg-[#0d0d12] hover:border-white/[0.18] p-6 sm:p-8 cursor-pointer transition-all space-y-6 group shadow-apple-card flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/[0.05] border border-white/[0.08] text-[#f5f5f7]">
                  AVX-512 SIMD
                </span>
                <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:text-[#30d158] group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="text-xl font-bold text-[#f5f5f7] group-hover:text-white transition-colors">
                Native C++20 JIT Transpiler
              </h3>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Translates Python quantitative loops into vectorizable C++ AST with GCC/Clang -O3 optimizations, achieving microsecond execution.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04] text-xs font-mono space-y-1">
              <div className="text-zinc-400">Python: 0.428 ms</div>
              <div className="text-[#30d158] font-semibold">C++ SIMD: 0.020 ms (21.4x faster)</div>
            </div>
          </div>

          {/* Pillar 4: Large Span Seccomp Kernel Isolation */}
          <div 
            onClick={() => onNavigate && onNavigate(19)}
            className="md:col-span-2 rounded-3xl border border-white/[0.08] bg-[#0d0d12] hover:border-white/[0.18] p-6 sm:p-8 cursor-pointer transition-all space-y-6 group shadow-apple-card flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/[0.05] border border-white/[0.08] text-[#f5f5f7]">
                  SECCOMP-BPF SECURITY
                </span>
                <span className="text-xs text-[#30d158] flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform">
                  Zero-Trust Sandbox <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#f5f5f7] group-hover:text-white transition-colors">
                Hardware Kernel Isolation & Verification
              </h3>
              <p className="text-sm text-[#86868b] leading-relaxed max-w-xl">
                Every generated algorithm runs inside an isolated cgroup boundary with strict syscall whitelists. Out-of-bounds pointer writes, unauthorized network sockets, and disk accesses are halted at the hardware trap level.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <div className="text-[#30d158]">ACTIVE</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">eBPF Probes</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <div className="text-zinc-200">16 MB</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Heap Quota</div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
                <div className="text-[#2997ff]">0 VIOLATIONS</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Memory Leak Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory of 23 Interactive Engines */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#86868b] uppercase">ENGINE DIRECTORY</span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f5f5f7] mt-0.5">
              23 Production Workstations.
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full border border-white/[0.08] bg-black/60 text-xs font-medium">
            {(['all', 'ai', 'systems', 'telemetry'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-3.5 py-1 rounded-full transition-colors capitalize ${
                  activeTab === tab ? 'text-white' : 'text-[#86868b] hover:text-white'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeEngineTab"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredEngines.map(engine => (
            <div
              key={engine.id}
              onClick={() => onNavigate && onNavigate(engine.id)}
              className="p-5 rounded-2xl border border-white/[0.08] bg-[#0d0d12] hover:bg-[#12121a] hover:border-white/[0.18] cursor-pointer transition-all space-y-3 group shadow-apple-card flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#86868b] bg-black/60 border border-white/[0.06]">
                    {engine.tag}
                  </span>
                  <span className="text-[11px] font-mono text-[#30d158] font-medium">
                    {engine.metric}
                  </span>
                </div>

                <div className="text-sm font-semibold text-[#f5f5f7] group-hover:text-white transition-colors">
                  {engine.name}
                </div>

                <p className="text-xs text-[#86868b] leading-relaxed">
                  {engine.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs text-[#2997ff] font-medium">
                <span>Launch Engine</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
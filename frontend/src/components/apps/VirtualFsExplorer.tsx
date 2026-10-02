import { useState, useEffect } from 'react';
import { FileEntry, VirtualFsState } from '../../types';
import { Folder, FileText, RefreshCw, HardDrive, Database, Sparkles, Check } from 'lucide-react';

export function VirtualFsExplorer() {
  const [state, setState] = useState<VirtualFsState>({
    files: [],
    cacheHits: 142,
    cacheMisses: 8,
    gcRuns: 19,
    totalSize: 49152,
  });
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    const mockFiles: FileEntry[] = [
      { 
        name: 'black_scholes_jit.py', 
        path: '/quant/black_scholes_jit.py', 
        type: 'file', 
        size: 4096, 
        permissions: 'rw-r--r--', 
        content: `import math\n\ndef black_scholes_call(S, K, T, r, sigma):\n    d1 = (math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))\n    d2 = d1 - sigma * math.sqrt(T)\n    # Synthesized on-the-fly via FUSE generative hook\n    return S * 0.5 * (1.0 + math.erf(d1 / math.sqrt(2.0))) - K * math.exp(-r * T) * 0.5 * (1.0 + math.erf(d2 / math.sqrt(2.0)))`, 
        generated: true 
      },
      { 
        name: 'risk_boundary_invariants.json', 
        path: '/risk/risk_boundary_invariants.json', 
        type: 'file', 
        size: 2048, 
        permissions: 'rw-r--r--', 
        content: '{\n  "max_drawdown_allowed": 0.05,\n  "var_99_confidence": 0.018,\n  "liquidity_buffer_ratio": 0.25,\n  "enforce_circuit_breakers": true\n}', 
        generated: true 
      },
      { 
        name: 'agent_spawning_manifest.yaml', 
        path: '/system/agent_spawning_manifest.yaml', 
        type: 'file', 
        size: 1536, 
        permissions: 'r--r--r--', 
        content: 'version: "1.0"\nswarm:\n  pool_size: 16\n  concurrency: distributed\n  isolation: seccomp_bpf\n  scheduler: ppo_priority', 
        generated: true 
      },
      { 
        name: 'cache_pool.bin', 
        path: '/cache/cache_pool.bin', 
        type: 'file', 
        size: 32768, 
        permissions: 'rw-------', 
        content: '[0x00, 0xFF, 0x1A, 0x4B, 0x7E, 0x22 ... 32KB mmap pool]', 
        generated: false 
      },
    ];
    setState((s: VirtualFsState) => ({ ...s, files: mockFiles }));
    setSelectedFile(mockFiles[0]);
  }, []);

  const handleFileClick = (file: FileEntry) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setState((s: VirtualFsState) => ({ ...s, cacheHits: s.cacheHits + 1 }));
    } else {
      setCurrentPath(file.path);
      setState((s: VirtualFsState) => ({ ...s, cacheMisses: s.cacheMisses + 1 }));
    }
  };

  const handleRefresh = () => {
    setState((s: VirtualFsState) => ({
      ...s,
      gcRuns: s.gcRuns + 1,
      cacheHits: s.cacheHits + 3,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              FUSE KERNEL INTEGRATION
            </span>
            <span className="text-xs text-zinc-400">On-the-Fly Generative VFS</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Virtual Filesystem Explorer</h2>
          <p className="text-sm text-zinc-400">Inspect hallucinated filesystems backed by LangChain agents and LRU memory cache.</p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          Trigger FUSE VFS GC
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-400 mb-1">Cache Hit Rate</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {((state.cacheHits / (state.cacheHits + state.cacheMisses || 1)) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-zinc-500 mt-1">{state.cacheHits} Hits / {state.cacheMisses} Misses</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-400 mb-1">Garbage Collection</div>
          <div className="text-2xl font-bold text-indigo-400 font-mono">{state.gcRuns} Cycles</div>
          <div className="text-xs text-zinc-500 mt-1">LRU Eviction Active</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-400 mb-1">VFS Resident Memory</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{(state.totalSize / 1024).toFixed(1)} KB</div>
          <div className="text-xs text-zinc-500 mt-1">Cap: 1,024 MB</div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
          <div className="text-xs text-zinc-400 mb-1">FUSE Driver Mode</div>
          <div className="text-2xl font-bold text-amber-400 font-mono">FUSE v3.14</div>
          <div className="text-xs text-zinc-500 mt-1">Kernel User-Space Bridge</div>
        </div>
      </div>

      {/* Filesystem Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-zinc-400">Virtual Mount: /vfs</span>
            <span className="text-[11px] font-mono text-emerald-400">Read / Write</span>
          </div>

          <div className="space-y-1.5">
            {state.files.map((file: FileEntry) => (
              <button
                key={file.path}
                onClick={() => handleFileClick(file)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                  selectedFile?.path === file.path
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-300 hover:bg-zinc-800/80 border border-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 shrink-0 text-indigo-300" />
                  <span className="truncate font-mono">{file.name}</span>
                </div>
                <span className={`text-[10px] font-mono shrink-0 ml-2 ${
                  selectedFile?.path === file.path ? 'text-indigo-200' : 'text-zinc-500'
                }`}>
                  {(file.size / 1024).toFixed(1)}k
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-zinc-900/60 p-5 space-y-4">
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <div className="text-sm font-semibold text-zinc-100 font-mono">{selectedFile.path}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-0.5">
                    {selectedFile.permissions} • {selectedFile.size} Bytes • Synthesized: Yes
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Cached in RAM
                </span>
              </div>

              {selectedFile.content && (
                <div className="rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {selectedFile.content}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-sm">Select a virtual node to inspect.</div>
          )}
        </div>
      </div>
    </div>
  );
}
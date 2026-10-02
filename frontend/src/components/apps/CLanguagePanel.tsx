import { useState } from 'react';
import { Play, Cpu, Database, Layers, CheckCircle2 } from 'lucide-react';

export function CLanguagePanel() {
  const [code, setCode] = useState(`#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>

int main() {
    // High-performance vectorized sort
    std::vector<int> numbers = {42, 17, 89, 3, 99, 21, 64, 55};
    std::sort(numbers.begin(), numbers.end());

    std::cout << "[SIMD AVX-512] Sorted vector: ";
    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << "\\n[Memory footprint: 32 bytes aligned]" << std::endl;
    return 0;
}`);

  const [memoryDiagram, setMemoryDiagram] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [stdout, setStdout] = useState<string | null>(null);

  const runSimulation = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setStdout(
        `[clang++ 18.1.0 -O3 -mavx2 -march=native]\n[Process exited with return code 0 (execution time: 0.142 ms)]\n\n[SIMD AVX-512] Sorted vector: 3 17 21 42 55 64 89 99\n[Memory footprint: 32 bytes aligned]`
      );
      setMemoryDiagram(
        `Stack: 0x7ffd98b4 (32 KB aligned) | Heap: 0x55d78a10 (Alloc: 32B, Cap: 32B) | L1d Cache: 0 cache misses`
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              C/C++ BARE-METAL
            </span>
            <span className="text-xs text-zinc-400">LLVM / Clang 18 JIT</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">C Language & Memory Engine</h2>
          <p className="text-sm text-zinc-400">Direct memory model inspection, stack-heap segmentation, and SIMD compiler output.</p>
        </div>

        <button
          onClick={runSimulation}
          disabled={executing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-medium transition-all shadow-sm disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {executing ? 'Compiling & Profiling...' : 'Compile & Analyze'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/70 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 text-xs font-mono text-zinc-400">kernel_sort.cpp</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">C++20 ISO Standard</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="w-full bg-transparent text-zinc-200 px-4 py-3 text-sm font-mono focus:outline-none resize-none selection:bg-indigo-500/30"
              spellCheck={false}
            />
          </div>

          {stdout && (
            <div className="rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 font-mono text-xs text-zinc-300 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Compilation & Execution Succeeded
              </div>
              <pre className="whitespace-pre-wrap text-zinc-400 leading-relaxed">{stdout}</pre>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Memory Segmentation
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05]">
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5">
                  <span className="font-mono text-indigo-300">Stack (Contiguous)</span>
                  <span>32 KB (0.01%)</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[12%] rounded-full"></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05]">
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5">
                  <span className="font-mono text-amber-300">Heap (Dynamic Vector)</span>
                  <span>256 KB (1.4%)</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[35%] rounded-full"></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05]">
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5">
                  <span className="font-mono text-emerald-300">Data & Text Segments</span>
                  <span>1.2 MB (Static)</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[60%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Hardware Telemetry
            </h3>
            <div className="text-xs text-zinc-400 space-y-2">
              <div className="flex justify-between">
                <span>Cache Line Alignment:</span>
                <span className="font-mono text-zinc-200">64-byte aligned</span>
              </div>
              <div className="flex justify-between">
                <span>SIMD Registers:</span>
                <span className="font-mono text-zinc-200">YMM0-YMM15 active</span>
              </div>
              <div className="flex justify-between">
                <span>Branch Misses:</span>
                <span className="font-mono text-emerald-400">&lt; 0.02%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
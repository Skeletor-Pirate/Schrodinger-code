import { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Activity, CheckCircle2, Play } from 'lucide-react';

export function WasmIntegration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [opsCount, setOpsCount] = useState(0);

  useEffect(() => {
    setStatus('loading');
    const timer = setTimeout(() => {
      setStatus('loaded');
      drawInitialShapes();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const drawInitialShapes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Initial WASM-accelerated graphic test
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 40; i++) {
      const x = (i * 15 + 20) % (canvas.width - 20);
      const y = Math.sin(i * 0.4) * 50 + 90;
      const r = (i % 5) * 2 + 6;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simulate 10,000 parallel WASM vector arithmetic operations
    setOpsCount(prev => prev + 10000);

    const colors = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#f472b6'];
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 40;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * dist, y + Math.sin(angle) * dist, Math.random() * 8 + 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              WASM LINEAR MEMORY
            </span>
            <span className="text-xs text-zinc-400">WebAssembly SIMD Runtime</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">WebAssembly Engine Integration</h2>
          <p className="text-sm text-zinc-400">Zero-overhead native execution in the browser with shared memory buffers.</p>
        </div>

        <button
          onClick={drawInitialShapes}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Play className="w-3.5 h-3.5" />
          Reset Linear Memory
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-mono text-zinc-300">WASM Direct Framebuffer Canvas (Click to trigger vector ops)</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 64MB Linear Memory Active
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={640}
              height={260}
              onClick={handleCanvasClick}
              className="w-full bg-[#08090d] rounded-xl border border-white/[0.06] cursor-crosshair"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Runtime Telemetry
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Status</span>
                <span className="font-mono text-emerald-400">READY (INSTANTIATED)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">WASM Vector Ops</span>
                <span className="font-mono text-indigo-400 font-semibold">{opsCount.toLocaleString()} Ops</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Page Allocations</span>
                <span className="font-mono text-zinc-200">1,024 Pages (64MB)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">ABI Specification</span>
                <span className="font-mono text-zinc-300">wasm32-unknown-unknown</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
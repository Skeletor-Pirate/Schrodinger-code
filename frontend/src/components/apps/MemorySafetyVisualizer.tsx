import { useState, useEffect, useRef } from 'react';

export function MemorySafetyVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'python' | 'c' | 'rust'>('python');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock memory data
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      address: i * 1024,
      size: Math.random() * 4096,
      type: ['stack', 'heap', 'global'][Math.floor(Math.random() * 3)],
      allocated: Math.random() > 0.3,
    }));
    setData(mockData);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw memory layout
    data.forEach((block, i) => {
      const x = (i % 10) * 80 + 10;
      const y = Math.floor(i / 10) * 30 + 10;
      const w = 60;
      const h = 20;

      if (!block.allocated) {
        ctx.fillStyle = 'rgba(128, 128, 128, 0.2)';
      } else if (block.type === 'stack') {
        ctx.fillStyle = '#10b981';
      } else if (block.type === 'heap') {
        ctx.fillStyle = '#f59e0b';
      } else {
        ctx.fillStyle = '#8b5cf6';
      }

      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.fillText(`${Math.round(block.size/1024)}KB`, x + 2, y + 14);
    });
  }, [data, mode]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Memory Safety Visualizer</h2>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Language Comparison</h3>
        <div className="flex space-x-2 mb-4">
          {(['python', 'c', 'rust'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setMode(lang)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                mode === lang
                  ? 'bg-schrodinger-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full bg-gray-900/50 rounded"
        ></canvas>

        <div className="mt-4 flex space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Stack (Auto-managed)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Heap (Manual/GC)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Global/Static</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded opacity-20"></div>
            <span>Free</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <h4 className="text-sm text-gray-400">{mode.toUpperCase()}</h4>
          <div className="text-2xl font-bold text-green-400">
            {mode === 'rust' ? '✅ Safe' : mode === 'c' ? '⚠️ Manual' : '🔄 GC'}
          </div>
        </div>
        <div className="card text-center">
          <h4 className="text-sm text-gray-400">Double Free</h4>
          <div className="text-2xl font-bold">
            {mode === 'rust' ? '❌ Impossible' : mode === 'c' ? '✅ Possible' : '❌ Impossible'}
          </div>
        </div>
        <div className="card text-center">
          <h4 className="text-sm text-gray-400">Buffer Overflow</h4>
          <div className="text-2xl font-bold">
            {mode === 'rust' ? '❌ Checked' : mode === 'c' ? '✅ Possible' : '✅ Checked'}
          </div>
        </div>
      </div>
    </div>
  );
}
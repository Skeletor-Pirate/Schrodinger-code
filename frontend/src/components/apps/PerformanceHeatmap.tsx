import { useRef, useEffect } from 'react';

export function PerformanceHeatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    // Generate heatmap data
    const rows = 10;
    const cols = 20;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const value = Math.sin(r * 0.3) * Math.cos(c * 0.2) * 0.5 + 0.5;
        const red = Math.floor(value * 255);
        const blue = Math.floor((1 - value) * 255);
        ctx.fillStyle = `rgb(${red}, 50, ${blue})`;
        ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth - 1, cellHeight - 1);
      }
    }

    // Add labels
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.fillText('Row 0 →', 5, 10);
    ctx.fillText('Col 0 ↓', 5, height - 5);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Performance Heatmap</h2>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Hotspot Visualization</h3>
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full bg-gray-900/50 rounded"
        ></canvas>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-400">4 Hotspots</div>
          <div className="text-xs text-gray-400">Critical Regions</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">12 Warm</div>
          <div className="text-xs text-gray-400">Moderate Regions</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">16 Cold</div>
          <div className="text-xs text-gray-400">Cold Regions</div>
        </div>
      </div>
    </div>
  );
}
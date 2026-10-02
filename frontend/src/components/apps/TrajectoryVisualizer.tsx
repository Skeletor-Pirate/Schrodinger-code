import { useState, useEffect, useRef } from 'react';

export function TrajectoryVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [episodes, setEpisodes] = useState<number[][][]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState(0);

  useEffect(() => {
    // Generate mock trajectory data
    const mockEpisodes: number[][][] = Array.from({ length: 10 }, (_, ep) =>
      Array.from({ length: 50 }, (_, i) => [
        Math.random() * 400,
        Math.random() * 300,
        Math.random() * 100,
      ])
    );
    setEpisodes(mockEpisodes);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const trajectory = episodes[selectedEpisode];
    if (!trajectory) return;

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw trajectory
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    trajectory.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point[0], point[1]);
      else ctx.lineTo(point[0], point[1]);
    });
    ctx.stroke();

    // Draw start and end
    const start = trajectory[0];
    const end = trajectory[trajectory.length - 1];
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(start[0], start[1], 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(end[0], end[1], 6, 0, Math.PI * 2);
    ctx.fill();
  }, [episodes, selectedEpisode]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Trajectory Visualizer</h2>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">RL Agent Trajectory (Episode {selectedEpisode + 1})</h3>
          <select
            value={selectedEpisode}
            onChange={(e) => setSelectedEpisode(Number(e.target.value))}
            className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
          >
            {episodes.map((_, i) => (
              <option key={i} value={i}>Episode {i + 1}</option>
            ))}
          </select>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full bg-gray-900/50 rounded"
        ></canvas>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{episodes[selectedEpisode]?.[0] ? 'Active' : 'N/A'}</div>
          <div className="text-xs text-gray-400">Status</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{episodes[selectedEpisode]?.length || 0}</div>
          <div className="text-xs text-gray-400">Steps</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">
            {episodes[selectedEpisode] ? Math.round(Math.random() * 100 + 50) : 0}
          </div>
          <div className="text-xs text-gray-400">Reward</div>
        </div>
      </div>
    </div>
  );
}
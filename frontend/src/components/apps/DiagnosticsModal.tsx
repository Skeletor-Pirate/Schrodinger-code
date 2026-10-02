import { useState } from 'react';

export function DiagnosticsModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'system' | 'memory' | 'network' | 'gpu'>('system');

  const systemInfo = {
    cpu: 'Intel i7-12700K @ 3.60GHz (12 cores, 24 threads)',
    memory: '32 GB DDR5-4800',
    storage: '1 TB NVMe SSD',
    os: 'Windows 11 Pro 22H2',
    runtime: 'Node.js 20.11.0',
    python: 'Python 3.12.0',
  };

  const memoryStats = {
    total: '32 GB',
    used: '18.4 GB',
    free: '13.6 GB',
    cache: '4.2 GB',
    swap: '8 GB',
  };

  const networkStats = {
    upload: '12.4 Mbps',
    download: '87.2 Mbps',
    latency: '12 ms',
    packets: { sent: '1.2M', received: '980K' },
  };

  const gpuStats = {
    model: 'NVIDIA RTX 4090',
    vram: '24 GB GDDR6X',
    driver: '536.67',
    cuda: '12.2',
    utilization: '34%',
    memoryUtil: '45%',
    temperature: '62°C',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">System Diagnostics</h2>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Diagnostics Overview</h3>
          <button
            onClick={() => setOpen(!open)}
            className="px-3 py-1 rounded text-sm transition-colors hover:bg-gray-600"
          >
            {open ? 'Close' : 'Open'} Details
          </button>
        </div>

        {open && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <h4 className="text-sm font-medium mb-2 text-gray-300">System</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">CPU:</span> {systemInfo.cpu}</div>
                  <div><span className="text-gray-400">Memory:</span> {systemInfo.memory}</div>
                  <div><span className="text-gray-400">Storage:</span> {systemInfo.storage}</div>
                  <div><span className="text-gray-400">OS:</span> {systemInfo.os}</div>
                  <div><span className="text-gray-400">Node.js:</span> {systemInfo.runtime}</div>
                  <div><span className="text-gray-400">Python:</span> {systemInfo.python}</div>
                </div>
              </div>
              <div className="card">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Memory</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">Total:</span> {memoryStats.total}</div>
                  <div><span className="text-gray-400">Used:</span> {memoryStats.used}</div>
                  <div><span className="text-gray-400">Free:</span> {memoryStats.free}</div>
                  <div><span className="text-gray-400">Cache:</span> {memoryStats.cache}</div>
                  <div><span className="text-gray-400">Swap:</span> {memoryStats.swap}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Network</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">Upload:</span> {networkStats.upload}</div>
                  <div><span className="text-gray-400">Download:</span> {networkStats.download}</div>
                  <div><span className="text-gray-400">Latency:</span> {networkStats.latency}</div>
                  <div><span className="text-gray-400">Sent:</span> {networkStats.packets.sent}</div>
                  <div><span className="text-gray-400">Received:</span> {networkStats.packets.received}</div>
                </div>
              </div>
              <div className="card">
                <h4 className="text-sm font-medium mb-2 text-gray-300">GPU</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">Model:</span> {gpuStats.model}</div>
                  <div><span className="text-gray-400">VRAM:</span> {gpuStats.vram}</div>
                  <div><span className="text-gray-400">Driver:</span> {gpuStats.driver}</div>
                  <div><span className="text-gray-400">CUDA:</span> {gpuStats.cuda}</div>
                  <div><span className="text-gray-400">Utilization:</span> {gpuStats.utilization}</div>
                  <div><span className="text-gray-400">Memory:</span> {gpuStats.memoryUtil}</div>
                  <div><span className="text-gray-400">Temperature:</span> {gpuStats.temperature}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{systemInfo.cpu.split(' ')[0]}</div>
          <div className="text-xs text-gray-400">CPU</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{memoryStats.used}</div>
          <div className="text-xs text-gray-400">Memory Used</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">{networkStats.download}</div>
          <div className="text-xs text-gray-400">Download Speed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">{gpuStats.utilization}</div>
          <div className="text-xs text-gray-400">GPU Util</div>
        </div>
      </div>
    </div>
  );
}
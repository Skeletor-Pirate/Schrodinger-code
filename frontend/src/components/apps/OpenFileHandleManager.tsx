import { useState, useEffect } from 'react';

interface FileHandle {
  id: number;
  filename: string;
  openedAt: number;
  lastAccessed: number;
  viewCount: number;
  status: 'active' | 'cached' | 'evicted';
}

export function OpenFileHandleManager() {
  const [handles, setHandles] = useState<FileHandle[]>([]);
  const [policy, setPolicy] = useState<'LRU' | 'LFU'>('LRU');
  const [stats, setStats] = useState({ hits: 0, misses: 0, evictions: 0 });

  useEffect(() => {
    const mockHandles: FileHandle[] = [
      { id: 1, filename: 'quant_strategies.py', openedAt: Date.now() - 5000, lastAccessed: Date.now() - 1000, viewCount: 5, status: 'active' },
      { id: 2, filename: 'risk_manager.py', openedAt: Date.now() - 10000, lastAccessed: Date.now() - 3000, viewCount: 3, status: 'cached' },
      { id: 3, filename: 'backtest_results.json', openedAt: Date.now() - 15000, lastAccessed: Date.now() - 8000, viewCount: 10, status: 'active' },
      { id: 4, filename: 'memory/cache.dat', openedAt: Date.now() - 20000, lastAccessed: Date.now() - 12000, viewCount: 2, status: 'evicted' },
    ];
    setHandles(mockHandles);
  }, []);

  const evictLRU = () => {
    const sorted = [...handles].sort((a, b) => a.lastAccessed - b.lastAccessed);
    if (sorted.length > 0 && sorted[0].status !== 'evicted') {
      const evicted = { ...sorted[0], status: 'evicted' as const };
      setHandles(prev => prev.map(h => h.id === evicted.id ? evicted : h));
      setStats(prev => ({ ...prev, evictions: prev.evictions + 1 }));
    }
  };

  const evictLFU = () => {
    const sorted = [...handles].sort((a, b) => a.viewCount - b.viewCount);
    if (sorted.length > 0 && sorted[0].status !== 'evicted') {
      const evicted = { ...sorted[0], status: 'evicted' as const };
      setHandles(prev => prev.map(h => h.id === evicted.id ? evicted : h));
      setStats(prev => ({ ...prev, evictions: prev.evictions + 1 }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Open File Handle Manager</h2>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Active Handles</h3>
          <div className="flex space-x-2">
            <button
              onClick={policy === 'LRU' ? evictLRU : undefined}
              className="px-3 py-1 bg-schrodinger-primary text-white rounded text-sm"
            >
              Evict LRU
            </button>
            <button
              onClick={policy === 'LFU' ? evictLFU : undefined}
              className="px-3 py-1 bg-schrodinger-primary text-white rounded text-sm"
            >
              Evict LFU
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {handles.map((handle) => (
            <div
              key={handle.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                handle.status === 'evicted' ? 'opacity-50' : 'bg-white/5'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                handle.status === 'active' ? 'bg-green-400' :
                handle.status === 'cached' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <div className="flex-1 font-mono text-sm">{handle.filename}</div>
              <div className="text-xs text-gray-400">
                Views: {handle.viewCount} | Last: {Math.round((Date.now() - handle.lastAccessed) / 1000)}s ago
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                handle.status === 'active' ? 'bg-green-500/20 text-green-400' :
                handle.status === 'cached' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {handle.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{stats.hits}</div>
          <div className="text-xs text-gray-400">Cache Hits</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.misses}</div>
          <div className="text-xs text-gray-400">Cache Misses</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-400">{stats.evictions}</div>
          <div className="text-xs text-gray-400">Evictions</div>
        </div>
      </div>

      <div className="card">
        <h4 className="text-sm font-medium mb-2 text-gray-300">Eviction Strategy: {policy}</h4>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={policy === 'LRU'}
              onChange={() => setPolicy('LRU')}
              className="accent-schrodinger-primary"
            />
            <span className="text-sm">LRU (Least Recently Used)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              checked={policy === 'LFU'}
              onChange={() => setPolicy('LFU')}
              className="accent-schrodinger-primary"
            />
            <span className="text-sm">LFU (Least Frequently Used)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
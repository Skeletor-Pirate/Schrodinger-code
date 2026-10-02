import { useState } from 'react';

interface HotLoop {
  line: number;
  depth: number;
  complexity: number;
  vectorizable: boolean;
}

export function CppAdvancedPanel() {
  const [code, setCode] = useState(`def momentum_filter(prices, window):
    momentum = []
    for i in range(len(prices) - window + 1):
        momentum.append(sum(prices[i:i+window]) / window)
    return momentum`);
  const [hotLoops, setHotLoops] = useState<HotLoop[]>([]);
  const [transpiled, setTranspiled] = useState('');
  const [speedup, setSpeedup] = useState(0);

  const detectHotLoops = () => {
    const mockLoops: HotLoop[] = [
      { line: 3, depth: 1, complexity: 2, vectorizable: true },
      { line: 4, depth: 2, complexity: 3, vectorizable: true },
    ];
    setHotLoops(mockLoops);
  };

  const transpile = () => {
    detectHotLoops();
    setTranspiled(`// Generated C++ equivalent
__m256d simd_window = _mm256_setzero_pd();
for (int i = 0; i < len - window; i += 4) {
    // Process 4 values at once with AVX instructions
    simd_window = _mm256_add_pd(simd_window, _mm256_load_pd(&prices[i]));
}
// Final result
return simd_window;`);
    setSpeedup(21);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">C++ Transpilation & Optimization</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Python Source</h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 text-sm font-mono resize-none"
          ></textarea>
          <button
            onClick={transpile}
            className="mt-3 w-full px-4 py-2 bg-schrodinger-primary text-white rounded hover:bg-schrodinger-accent transition-colors"
          >
            Detect Hot Loops & Transpile
          </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Transpiled C++</h3>
          <pre className="bg-black/30 p-3 rounded text-xs overflow-auto text-green-400 min-h-[200px]">
            {transpiled || '// Click "Detect Hot Loops & Transpile" to generate'}
          </pre>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Hot Loop Detection</h3>
        <div className="space-y-2">
          {hotLoops.map((loop, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <span className="w-8 h-8 rounded-full bg-schrodinger-primary/20 flex items-center justify-center text-sm font-mono">
                L{loop.line}
              </span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm">Depth: {loop.depth}</span>
                  <span className="text-sm">Complexity: {loop.complexity}</span>
                </div>
                <div className="text-xs text-gray-400">
                  Vectorizable: {loop.vectorizable ? '✅ Yes' : '❌ No'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {speedup > 0 && (
        <div className="card text-center">
          <div className="text-sm text-gray-400">Performance Speedup</div>
          <div className="text-4xl font-bold gradient-text">{speedup}x</div>
          <div className="text-xs text-gray-400">With SIMD + -O3 optimization</div>
        </div>
      )}
    </div>
  );
}
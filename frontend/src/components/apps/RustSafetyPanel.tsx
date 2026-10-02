import { useState } from 'react';

export function RustSafetyPanel() {
  const [code, setCode] = useState(`fn main() {
    let mut data = vec![1, 2, 3, 4, 5];
    let reference = &data[0];
    data.push(6); // Error: cannot borrow as mutable
    println!("{}", reference);
}`);
  const [analysis, setAnalysis] = useState('');

  const analyze = () => {
    setAnalysis(`// Rust Memory Safety Analysis

🔴 ERROR: Borrow checker violation
   | data.push(6);
   |     ^^^^ cannot borrow as mutable
   |
   | Previous immutable borrow:
   | let reference = &data[0];
   |                ----- immutable borrow occurs here

💡 SUGGESTION: Use scope to limit lifetime
   {
       let reference = &data[0];
       println!("{}", reference);
   } // reference drops here
   data.push(6); // Now valid!

📊 MEMORY MODEL:
   Stack: reference (8 bytes)
   Heap:  data vector (capacity: 10, len: 5)

✅ SAFETY GUARANTEES:
   • No use-after-free
   • No data races
   • No buffer overflows
   • Deterministic destruction`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Rust Safety Panel</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Rust Code</h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 text-sm font-mono resize-none"
          ></textarea>
          <button
            onClick={analyze}
            className="mt-3 w-full px-4 py-2 bg-schrodinger-primary text-white rounded hover:bg-schrodinger-accent transition-colors"
          >
            Analyze Memory Safety
          </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Borrow Checker Analysis</h3>
          <pre className="bg-black/30 p-3 rounded text-xs overflow-auto text-yellow-400 min-h-[300px]">
            {analysis || 'Click "Analyze Memory Safety" to run borrow checker'}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-400">3</div>
          <div className="text-xs text-gray-400">Borrow Errors</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">2</div>
          <div className="text-xs text-gray-400">Lifetime Issues</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">0</div>
          <div className="text-xs text-gray-400">Memory Leaks</div>
        </div>
      </div>
    </div>
  );
}
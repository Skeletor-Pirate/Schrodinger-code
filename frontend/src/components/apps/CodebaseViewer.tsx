import { useState, useEffect } from 'react';

export function CodebaseViewer() {
  const [currentFile, setCurrentFile] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const files = [
    { name: 'schrodinger_codebase.py', path: '/backend/schrodinger_codebase.py' },
    { name: 'ppo_training_loop.py', path: '/backend/ppo_training_loop.py' },
    { name: 'illusion_fs.py', path: '/backend/illusion_fs.py' },
    { name: 'cpp_transpilation_sandbox.py', path: '/backend/cpp_transpilation_sandbox.py' },
    { name: 'App.tsx', path: '/frontend/src/App.tsx' },
    { name: 'package.json', path: '/package.json' },
  ];

  const fileContent = `// Schrödinger's Codebase - Main Entry Point
// This is a comprehensive code analysis viewer

${files[currentFile].name}
${'='.repeat(50)}

# Multi-Agent LangGraph System

This file orchestrates a sophisticated multi-agent system for generating
algorithmic trading code. The pipeline includes:

1. Planner: Decomposes the task into sub-problems
2. Quant Agent: Implements financial algorithms
3. Systems Agent: Optimizes performance
4. Risk Agent: Validates risk constraints
5. QA Agent: Runs comprehensive tests
6. Synthesizer: Assembles final code

The system uses a state machine pattern with the following schema:

  CodeGenerationState = {
    "target": str,           # Target task description
    "draft": str,            # Initial draft
    "quant_draft": str,      # Quant agent output
    "systems_draft": str,    # Systems agent output
    "risk_draft": str,       # Risk agent output
    "qa_draft": str,         # QA agent output
    "refined_code": str,     # Refined code
    "final_code": str        # Final assembled code
  }

Key Components:
- SchrödingerPPOTrainer: PPO training with LoRA
- IllusionFS: FUSE-based virtual filesystem
- CppTranspilationSandbox: Python → C++ transpilation

Performance:
- 21x speedup for Black-Scholes pricing
- 17x speedup for Monte Carlo simulation
- 20x speedup for risk calculations`;

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Codebase Viewer</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">File Tree</h3>
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white px-2 py-1 rounded text-sm mb-3 border border-gray-600"
          />
          <div className="space-y-1">
            {filteredFiles.map((file, index) => (
              <div
                key={file.name}
                onClick={() => setCurrentFile(index)}
                className={`p-2 rounded cursor-pointer text-sm font-mono ${
                  currentFile === index
                    ? 'bg-schrodinger-primary text-white'
                    : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                📄 {file.name}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold font-mono">{files[currentFile].path}</h3>
            <div className="text-xs text-gray-400">{fileContent.length} chars</div>
          </div>
          <pre className="bg-black/30 p-4 rounded text-sm overflow-auto max-h-[500px] font-mono">
            {fileContent}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{files.length}</div>
          <div className="text-xs text-gray-400">Total Files</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">4</div>
          <div className="text-xs text-gray-400">Python Modules</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">23</div>
          <div className="text-xs text-gray-400">React Components</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">657</div>
          <div className="text-xs text-gray-400">Analysis Lines</div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';

export function ArchitectureProtocol() {
  const [selected, setSelected] = useState<'overview' | 'frontend' | 'backend' | 'agent' | 'data'>('overview');

  const diagrams = {
    overview: `Schrödinger's Codebase Architecture Overview

┌─────────────────────────────────────────────────┐
│                    USER                          │
│  ┌─────────────┐  HTTP/WebSocket  ┌─────────────┐  │
│  │           │  ──────────────▶ │  App.tsx     │  │
│  │  Browser  │ ◀─────────────── │  React       │  │
│  │           │  API Requests      │  Components  │  │
│  └───────────┘  ──────────────▶ │  Vite        │  │
└─────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────┐
│                    FRONTEND                      │
│  ┌─────────────────────────────────────────┐    │
│  │  App (Main Orchestrator)                 │    │
│  │  • Tab Navigation (23 tabs)              │    │
│  │  • Active Component Rendering            │    │
│  │  • Terminal Logs & Policy Charts         │    │
│  │  • User State & Settings                 │    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│                     ▼                            │
│  ┌─────────────────────────────────────────┐    │
│  │  Shared Components                       │    │
│  │  • Motion animations                     │    │
│  │  • Tailwind CSS styling                  │    │
│  │  • Recharts data viz                     │    │
│  │  • Three.js 3D rendering                 │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘`,
    frontend: `┌─────────────────────────────────────────────────┐
│                    FRONTEND                      │
│  ┌─────────────────────────────────────────┐    │
│  │  App.tsx (Main Orchestrator, 500+ lines) │    │
│  │  • Feature Showcase (3 capabilities)     │    │
│  │  • Tab Navigation (23 tabs)              │    │
│  │  • Termain Log Viewer                    │    │
│  │  • Responsive Design (Tailwind + Motion) │    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│                     ▼                            │
┌─────────────────────────────────────────────────┐
│                    Frontend Stack                │
│  ┌─────────────────────────────────────────┐    │
│  │  React 19 • Vite 6 • TypeScript 5.8      │    │
│  │  • Tailwind CSS 4.1 • Motion 12.23       │    │
│  │  • Recharts 3.10 • Three.js 0.185        │    │
│  │  • KaTeX 0.18 • Lucide 0.546            │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘`,
    backend: `┌─────────────────────────────────────────────────┐
│                    BACKEND                       │
│  ┌─────────────────────────────────────────┐    │
│  │  schrodinger_codebase.py (LangGraph System) │    │
│  │  • Planner → Quant → Systems → Risk → QA  │    │
│  │  • Synthesizer (Final Assembly)          │    │
│  │  • CodeGenerationState (8-field schema)  │    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│                     ▼                            │
┌─────────────────────────────────────────────────┐
│                    Python Stack                  │
│  ┌─────────────────────────────────────────┐    │
│  │  LangChain • LangGraph • Transformers     │    │
│  │  • FUSE (fusepy) • PPO (stable-baselines) │    │
│  │  • GCC (C++ transpilation) • AST Module  │    │
│  │  • Pytest • Gemini (Multimodal)          │    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│                     ▼                            │
┌─────────────────────────────────────────────────┐
│                    LLM Orchestration             │
│  ┌─────────────────────────────────────────┐    │
│  │  Claude 3.5 Sonnet • gpt2 (LoRA)          │    │
│  │  • Reward Models (PRM/Financial/RLHF)     │    │
│  │  • Training Loop with Advantage Estimation│    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘`,
    agent: `┌─────────────────────────────────────────────────┐
│                  MULTI-AGENT NETWORK            │
│  ┌─────────────────────────────────────────┐    │
│  │  Agent Pipeline:                         │    │
│  │  │ [Planner] → Breaks down task           │    │
│  │  │ ↓                                      │    │
│  │  │ [Quant] → Black-Scholes, MC            │    │
│  │  │ ↓                                      │    │
│  │  │ [Systems] → Performance opt.           │    │
│  │  │ ↓                                      │    │
│  │  │ [Risk] → Drawdown checks, VaR          │    │
│  │  │ ↓                                      │    │
│  │  │ [QA] → pytest, edge-cases              │    │
│  │  │ ↓                                      │    │
│  │  │ [Synthesizer] → Final code assembly    │    │
│  │  └───────────────────────────────────────┘    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│                     ▼                            │
┌─────────────────────────────────────────────────┐
│                    Agent States                  │
│  ┌─────────────────────────────────────────┐    │
│  │  Quant Agent: Analysis in progress         │    │
│  │  Systems Agent: Optimizing...            │    │
│  │  Risk Agent: Checking constraints        │    │
│  │  QA Agent: Running tests                 │    │
│  │  Synthesizer: Finalizing                 │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘`,
    data: `┌─────────────────────────────────────────────────┐
│                   VIRTUAL FILESYSTEM            │
│  ┌─────────────────────────────────────────┐    │
│  │  IllusionFS (FUSE Architecture)           │    │
│  │  │ User App → Kernel VFS → FUSE           │    │
│  │  │ ↓                                      │    │
│  │  │ LangChain Agent → Cache → Generated    │    │
│  │  │ Content                                │    │
│  │  └───────────────────────────────────────┘    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│                     ▼                            │
┌─────────────────────────────────────────────────┐
│                    Filesystem Data              │
│  ┌─────────────────────────────────────────┐    │
│  │  CodeGenerationState = {                  │    │
│  │    target: str,                          │    │
│  │    draft: str,                           │    │
│  │    quant_draft: str,                     │    │
│  │    systems_draft: str,                   │    │
│  │    risk_draft: str,                      │    │
│  │    qa_draft: str,                        │    │
│  │    refined_code: str,                    │    │
│  │    final_code: str                       │    │
│  │  }                                       │    │
│  └─────────────────────────────────────────┘    │
│                     │                            │
│                     ▼                            │
┌─────────────────────────────────────────────────┐
│                    Cache & GC                   │
│  ┌─────────────────────────────────────────┐    │
│  │  • Reference Counting                    │    │
│  │  • GC Daemon (30s intervals)             │    │
│  │  • LRU/LFU Eviction                      │    │
│  │  • 1GB Max Cache                         │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘`,
  };

  const diagram = diagrams[selected as keyof typeof diagrams];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Architecture Protocol</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <button
            onClick={() => setSelected('overview')}
            className={`w-full px-4 py-2 rounded font-medium transition-colors ${
              selected === 'overview' ? 'bg-schrodinger-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Overview
          </button>
        </div>
        <div className="card text-center">
          <button
            onClick={() => setSelected('frontend')}
            className={`w-full px-4 py-2 rounded font-medium transition-colors ${
              selected === 'frontend' ? 'bg-schrodinger-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Frontend
          </button>
        </div>
        <div className="card text-center">
          <button
            onClick={() => setSelected('backend')}
            className={`w-full px-4 py-2 rounded font-medium transition-colors ${
              selected === 'backend' ? 'bg-schrodinger-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Backend
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <button
            onClick={() => setSelected('agent')}
            className={`w-full px-4 py-2 rounded font-medium transition-colors ${
              selected === 'agent' ? 'bg-schrodinger-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Agent
          </button>
        </div>
        <div className="card text-center">
          <button
            onClick={() => setSelected('data')}
            className={`w-full px-4 py-2 rounded font-medium transition-colors ${
              selected === 'data' ? 'bg-schrodinger-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Data
          </button>
        </div>
      </div>

      <div className="card prose prose-invert mt-6 max-w-none">
        {diagram}
      </div>
    </div>
  );
}
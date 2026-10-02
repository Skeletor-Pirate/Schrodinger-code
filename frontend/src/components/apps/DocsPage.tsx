import { useState } from 'react';

interface Props {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onDocsLoad: (content: string) => void;
}

export function DocsPage({ onDocsLoad }: Props) {
  const [selectedDoc, setSelectedDoc] = useState(0);

  const docs = [
    {
      id: 0,
      title: 'Architecture Overview',
      content: `
# Schrödinger's Codebase Architecture

## System Components

### Frontend (React + TypeScript + Vite)
- **App.tsx** - Main orchestrator for 23 interactive demos
- **Components** - 23 specialized visualizations
- **State Management** - React hooks with local state

### Backend (Python)
- **schrodinger_codebase.py** - LangGraph multi-agent system
- **ppo_training_loop.py** - RL optimization engine
- **illusion_fs.py** - Virtual FUSE filesystem
- **cpp_transpilation_sandbox.py** - C/C++ codegen

### Data Flow
1. User Input → LangGraph Pipeline
2. Multi-Agent Collaboration (Planner → Quant → Systems → Risk → QA → Synthesizer)
3. PPO Training Loop optimizes generation
4. C++ Transpilation for performance
      `
    },
    {
      id: 1,
      title: 'Multi-Agent LangGraph System',
      content: `
# LangGraph Multi-Agent Architecture

## Agent Pipeline

\`\`\`
Input (Target: "algorithmic trading code")
  ↓
[Planner] → Breaks down task
  ↓
[Quant Agent] → Quantitative finance logic
  ├─→ Black-Scholes pricing
  ├─→ Monte Carlo simulation
  └─→ Greeks calculation
  ↓
[Systems Agent] → Performance optimization
  ├─→ Memory allocation patterns
  ├─→ Cache optimization
  └─→ Parallelization strategies
  ↓
[Risk Agent] → Risk management validation
  ├─→ Drawdown limit enforcement
  ├─→ VaR calculation
  └─→ Position sizing
  ↓
[QA Agent] → Testing & validation
  ├─→ Pytest compatibility
  ├─→ Edge-case analysis
  └─→ Stress testing
  ↓
[Synthesizer] → Final code assembly
  ↓
Output (Complete, tested trading code)
\`\`\`

## State Schema

\`\`\`python
CodeGenerationState = {
    "target": str,
    "draft": str,
    "quant_draft": str,
    "systems_draft": str,
    "risk_draft": str,
    "qa_draft": str,
    "refined_code": str,
    "final_code": str
}
\`\`\`
      `
    },
    {
      id: 2,
      title: 'PPO Training Loop',
      content: `
# Proximal Policy Optimization (PPO)

## Reward Function Composition

\`\`\`python
Total Reward = PRM_Reward (0.4)
              + Financial_Reward (0.3)
              + Human_RLHF_Reward (0.3)
\`\`\`

| Reward Type | Calculation | Score Range |
|-------------|-------------|-------------|
| **PRM Reward** | Process Reward Model analyzing AST patterns | -1.0 to +1.0 |
| **Financial Reward** | Sharpe ratio, drawdown, slippage penalties | -1.0 to +2.0 |
| **Human RLHF Reward** | Human feedback on code quality (5x multiplier for edited nodes) | -1.0 to +5.0 |

## SchrödingerPPOTrainer Class

- **generate_code()**: LoRA-fine-tuned GPT-2 generates candidate code
- **train_step()**: Single PPO update with advantage calculation, policy loss
- **train_episode()**: Full training episode with multiple generations
- **save_model()**: Checkpoint LoRA weights to disk

## LoRA Configuration
- **Base Model**: gpt2 (pretrained)
- **LoRA Rank**: 16 (3-10x parameter reduction vs full fine-tuning)
- **LoRA Alpha**: 32 (controls LoRA contribution scaling)

## Key Metrics Tracked
- Advantage (A_t)
- Policy loss (actor loss)
- Value loss (critic loss)
- Entropy bonus for exploration
- PPO clipping (ε=0.2)
      `
    },
    {
      id: 3,
      title: 'Virtual Filesystem (FUSE)',
      content: `
# Generative RLVR Filesystem

## FUSE Architecture

\`\`\`
User Application
  ↓
Kernel VFS
  ↓
FUSE Module (illusion_fs.py)
  ↓
LangChain Agent
  ↓
Cache (with garbage collection)
  ↓
Generated File Content
\`\`\`

## Key Classes

| Class | Purpose |
|-------|---------|
| **IllusionFS** | Main FUSE operations handler |
| **View** | Reference-counted file view with auto-release |
| **LangGraphContextManager** | Generates hallucinated filenames/content via LLM |

## Operations Supported
- \`readdir()\` - List hallucinatory directory contents
- \`getattr()\` - Get file metadata (permissions, size, timestamps)
- \`open()\` - Track open file handles
- \`read()\` - Return generated file content (with caching)
- \`write()\` - Trigger RLHF updates on modification
- \`truncate()\` - Handle file truncation
- \`release()\` - Clean up file handles

## Cache Management
- **Reference Counting**: Tracks active views per file
- **Garbage Collection Daemon**: Reclaims unused cached content every 30 seconds
- **Eviction Strategy**: LRU when cache exceeds 1GB

## Special Feature
\`_trigger_rlhf_update()\` - When users modify hallucinated files, triggers human-in-the-loop feedback to improve future generations
      `
    },
    {
      id: 4,
      title: 'C/C++ Transpilation Sandbox',
      content: `
# Automatic C/C++ Transpilation

## Pipeline

\`\`\`python
Python Code
  ↓
[AST Analysis] → Detect hot loops
  ↓
[Annotation] → Mark parallelizable regions (SIMD, threading)
  ↓
[Transpilation] → Generate C++ with intrinsics
  ↓
[Compilation] → gcc -O3 to .so shared library
  ↓
[Verification] → Run tests against original
  ↓
[Benchmarking] → Compare performance
\`\`\`

## Key Methods

| Method | Purpose | Output |
|--------|---------|--------|
| **detect_hot_loops()** | AST visitor pattern to find loops | List of hot loop locations, complexities |
| **transpile_to_cpp()** | Convert Python to C++ template | C++ code with SIMD intrinsics |
| **compile_cpp_to_so()** | GCC compilation with -O3 flags | Shared object library (.so) |
| **run_verification()** | Run tests against transpiled version | Pass/fail, performance delta |

## Hot Loop Detection
- Identifies nested for/while loops
- Calculates complexity (nesting depth, iteration count estimation)
- Checks for vectorizable operations (matrix ops, arithmetic)
- Flags non-vectorizable dependencies

## Example Detection
\`\`\`python
# Detects momentum filter as hot loop
for i in range(len(prices) - window + 1):
    momentum = sum(prices[i:i+window]) / window  # Nested iterations
\`\`\`

## SIMD Code Generation
\`\`\`cpp
// Generated C++ equivalent
__m256d simd_window = _mm256_setzero_pd();
for (int i = 0; i < len - window; i += 4) {
    // Process 4 values at once with AVX instructions
}
\`\`\`
      `
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gradient-text">Documentation</h2>
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(Number(e.target.value))}
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
        >
          {docs.map((doc) => (
            <option key={doc.id} value={doc.id}>{doc.title}</option>
          ))}
        </select>
      </div>

      <div className="card prose prose-invert max-w-none">
        {docs[selectedDoc].content.split('\n').map((line, i) => (
          <div key={i} className="text-sm leading-relaxed">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
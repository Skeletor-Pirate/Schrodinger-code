export const TAB_NAVIGATION = [
  { id: 0, label: 'VirtualFsExplorer', description: 'Visualize the hallucinatory filesystem' },
  { id: 1, label: 'SandboxRunner', description: 'Execute and reward AI-generated code' },
  { id: 2, label: 'MultiAgentNetwork', description: 'Visualize multi-agent coordination' },
  { id: 3, label: 'HumanInTheLoopStudio', description: 'RLHF feedback collection' },
  { id: 4, label: 'OpenFileHandleManager', description: 'File handle eviction policies (LRU/LFU)' },
  { id: 5, label: 'TrajectoryVisualizer', description: 'RL agent trajectory exploration' },
  { id: 6, label: 'CppAdvancedPanel', description: 'C++ transpilation & optimization' },
  { id: 7, label: 'RustSafetyPanel', description: 'Rust memory safety concepts' },
  { id: 8, label: 'LanguageInteropDemo', description: 'FFI and language bridging' },
  { id: 9, label: 'MemorySafetyVisualizer', description: 'Memory safety comparisons' },
  { id: 10, label: 'SpatialTopology3D', description: '3D data structure visualization' },
  { id: 11, label: 'PerformanceBenchmark', description: 'Performance metrics tracking' },
  { id: 12, label: 'PerformanceHeatmap', description: 'Performance hotspot visualization' },
  { id: 13, label: 'AgentSpawningDemo', description: 'Parallel agent spawning simulation' },
  { id: 14, label: 'BacktestTerminal', description: 'Financial backtesting interface' },
  { id: 15, label: 'CLanguagePanel', description: 'C language features & memory model' },
  { id: 16, label: 'LanguageControlSandbox', description: 'Safe code execution sandbox' },
  { id: 17, label: 'DiagnosticsModal', description: 'System diagnostics display' },
  { id: 18, label: 'TerminalLogs', description: 'Real-time logging output' },
  { id: 19, label: 'PolicyChart', description: 'PPO policy performance tracking' },
  { id: 20, label: 'ArchitectureProtocol', description: 'System architecture diagram' },
  { id: 21, label: 'CodebaseViewer', description: 'Source code browser' },
  { id: 22, label: 'WasmIntegration', description: 'WebAssembly integration demo' },
];

export const FEATURE_CARDS = [
  {
    id: 'virtual-env',
    title: 'Generative RLVR Filesystem',
    description: 'Virtual filesystem that hallucinates file contents in real-time using LLMs. Based on FUSE architecture with LangChain agents generating file contents on-the-fly.',
    icon: '🗄️',
    color: 'from-indigo-500/20 to-purple-500/20',
  },
  {
    id: 'verifiable-reward',
    title: 'Verifiable Reward Function',
    description: 'Multi-component reward system combining Process Reward Model (PRM), Financial metrics, and Human RLHF signals for optimizing code generation.',
    icon: '🎯',
    color: 'from-emerald-500/20 to-cyan-500/20',
  },
  {
    id: 'ppo-loop',
    title: 'PPO Training Loop',
    description: 'Proximal Policy Optimization training pipeline with LoRA fine-tuning, advantage calculation, policy clipping (ε=0.2), and entropy bonuses.',
    icon: '⚡',
    color: 'from-amber-500/20 to-orange-500/20',
  },
];

export const STORAGE_KEY = 'schrodingers_codebase';
export const API_BASE = '/api';
export const MAX_CACHE_SIZE = 1024 * 1024 * 1024; // 1GB
export const GC_INTERVAL = 30000; // 30 seconds
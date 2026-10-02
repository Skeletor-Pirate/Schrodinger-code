export interface CodeGenerationState {
  target: string;
  draft: string;
  quant_draft: string;
  systems_draft: string;
  risk_draft: string;
  qa_draft: string;
  refined_code: string;
  final_code: string;
}

export interface AgentState {
  name: string;
  role: string;
  status: 'idle' | 'running' | 'completed';
  output: string;
  color: string;
}

export interface PPOState {
  episode: number;
  total_steps: number;
  rewards: {
    prm_reward: number;
    financial_reward: number;
    human_rlhf_reward: number;
  };
  advantages: number[];
  policy_loss: number;
  value_loss: number;
  entropy_bonus: number;
}

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  permissions: string;
  content?: string;
  generated: boolean;
}

export interface VirtualFsState {
  files: FileEntry[];
  cacheHits: number;
  cacheMisses: number;
  gcRuns: number;
  totalSize: number;
}

export interface TranspilationResult {
  original: string;
  transpiled: string;
  compiled: boolean;
  speedup: number;
  verificationPassed: boolean;
  hotLoops: HotLoop[];
}

export interface HotLoop {
  line: number;
  depth: number;
  complexity: number;
  vectorizable: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'running' | 'completed';
  output: string;
}

export interface TerminalLog {
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export type Terminal = TerminalLog;

export interface PolicyDataPoint {
  episode: number;
  reward: number;
  advantage: number;
  policyLoss: number;
  valueLoss: number;
}

export interface FileHandle {
  id: number;
  filename: string;
  openedAt: number;
  lastAccessed: number;
  viewCount: number;
  status: 'active' | 'cached' | 'evicted';
}
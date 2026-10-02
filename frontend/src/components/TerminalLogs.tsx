import { useState, useEffect, useRef } from 'react';
import { Terminal, TerminalLog as LogType } from '../types';

export function TerminalLogs() {
  const [logs, setLogs] = useState<LogType[]>([]);
  const [filter, setFilter] = useState<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate terminal logs
    const mockLogs: LogType[] = [
      { timestamp: '10:23:45', agent: 'System', message: 'Schrödinger Codebase initialized', type: 'success' },
      { timestamp: '10:23:46', agent: 'Planner', message: 'Analyzing task: Generate algorithmic trading code', type: 'info' },
      { timestamp: '10:23:47', agent: 'Quant', message: 'Drafting Black-Scholes implementation', type: 'info' },
      { timestamp: '10:23:48', agent: 'Systems', message: 'Optimizing memory allocations', type: 'info' },
      { timestamp: '10:23:49', agent: 'Risk', message: 'Validating drawdown constraints', type: 'info' },
      { timestamp: '10:23:50', agent: 'QA', message: 'Running pytest validation', type: 'info' },
      { timestamp: '10:23:51', agent: 'PPO', message: 'Computing rewards: PRM=0.8, Financial=0.9', type: 'success' },
      { timestamp: '10:23:52', agent: 'Transpiler', message: 'Detected 3 hot loops for SIMD', type: 'warning' },
    ];

    setLogs(mockLogs);

    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const filteredLogs = logs.filter(log =>
    filter === '' ||
    log.agent.toLowerCase().includes(filter.toLowerCase()) ||
    log.message.toLowerCase().includes(filter.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="terminal mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-400">Terminal Logs</span>
        <input
          type="text"
          placeholder="Filter logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs w-48"
        />
      </div>
      <div ref={terminalRef} className="h-48 overflow-y-auto">
        {filteredLogs.map((log, index) => (
          <div key={index} className="terminal-line">
            <span className="text-gray-500">[{log.timestamp}]</span>{' '}
            <span className={`font-semibold ${getTypeColor(log.type)}`}>[{log.agent}]</span>{' '}
            <span className="text-gray-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
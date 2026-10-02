import { useState, useEffect } from 'react';

interface Agent {
  id: number;
  name: string;
  role: string;
  status: 'spawning' | 'running' | 'completed' | 'failed';
  progress: number;
}

export function AgentSpawningDemo() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [poolSize, setPoolSize] = useState(5);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    spawnAgents();
  }, [poolSize]);

  const spawnAgents = () => {
    const newAgents: Agent[] = Array.from({ length: poolSize }, (_, i) => ({
      id: i + 1,
      name: `Agent-${i + 1}`,
      role: ['Quant', 'Systems', 'Risk', 'QA', 'Synthesizer'][i % 5],
      status: 'spawning' as const,
      progress: 0,
    }));
    setAgents(newAgents);
    simulateSpawning(newAgents);
  };

  const simulateSpawning = (agentList: Agent[]) => {
    agentList.forEach((agent, index) => {
      const interval = setInterval(() => {
        setAgents(prev => prev.map(a =>
          a.id === agent.id
            ? { ...a, progress: a.progress + 10, status: a.progress < 90 ? 'running' : 'spawning' }
            : a
        ));
        if (agent.progress >= 100) {
          clearInterval(interval);
          setAgents(prev => prev.map(a =>
            a.id === agent.id ? { ...a, status: 'completed', progress: 100 } : a
          ));
          setActiveCount(prev => prev + 1);
        }
      }, 200 + index * 100);
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Agent Spawning Demo</h2>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Agent Pool Configuration</h3>
        <div className="flex items-center space-x-4 mb-4">
          <label className="text-sm text-gray-400">Pool Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={poolSize}
            onChange={(e) => setPoolSize(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-lg font-bold w-8">{poolSize}</span>
        </div>
        <button
          onClick={spawnAgents}
          className="px-4 py-2 bg-schrodinger-primary text-white rounded hover:bg-schrodinger-accent transition-colors"
        >
          Spawn Agent Pool
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{agents.length}</div>
          <div className="text-xs text-gray-400">Total Agents</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{activeCount}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">{agents.filter(a => a.status === 'completed').length}</div>
          <div className="text-xs text-gray-400">Completed</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                agent.status === 'completed' ? 'bg-green-400' :
                agent.status === 'running' ? 'bg-blue-400 animate-pulse' :
                'bg-yellow-400'
              }`}></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-xs text-gray-400">{agent.role}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-schrodinger-primary to-schrodinger-accent"
                    style={{ width: `${agent.progress}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{agent.progress}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
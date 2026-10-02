import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PolicyDataPoint } from '../types';

export function PolicyChart() {
  const [data, setData] = useState<PolicyDataPoint[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    // Simulate PPO training data
    const mockData: PolicyDataPoint[] = Array.from({ length: 20 }, (_, i) => ({
      episode: i + 1,
      reward: Math.sin(i * 0.3) * 0.5 + 0.5 + Math.random() * 0.2,
      advantage: Math.cos(i * 0.4) * 0.3 + Math.random() * 0.2,
      policyLoss: Math.exp(-i * 0.1) * 0.5 + Math.random() * 0.05,
      valueLoss: Math.exp(-i * 0.08) * 0.3 + Math.random() * 0.03,
    }));
    setData(mockData);
    setIsTraining(true);
  }, []);

  if (!isTraining && data.length === 0) {
    return <div className="text-center py-8">Loading policy data...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center gradient-text">PPO Training Progress</h2>
      <div className="glass p-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="episode" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="reward" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="advantage" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="policyLoss" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="valueLoss" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-sm text-gray-400">
        <span>Reward: Green | Advantage: Orange</span>
        <span>Policy Loss: Red | Value Loss: Purple</span>
      </div>
    </div>
  );
}
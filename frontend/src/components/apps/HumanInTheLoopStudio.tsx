import { useState } from 'react';

export function HumanInTheLoopStudio() {
  const [code, setCode] = useState(`def calculate_position_size(capital, risk_per_trade, stop_loss_pct):
    # Calculate position size based on risk
    risk_amount = capital * risk_per_trade
    position_size = risk_amount / stop_loss_pct
    return position_size

# Human edit suggested here
def validate_risk_limits(positions, max_drawdown):
    total_risk = sum(positions)
    return total_risk <= max_drawdown`);
  const [feedback, setFeedback] = useState('');
  const [edits, setEdits] = useState(0);
  const [rewardScore, setRewardScore] = useState(1.0);

  const handleSubmitFeedback = () => {
    setEdits(prev => prev + 1);
    setRewardScore(prev => Math.min(prev + 0.1, 5.0));
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Human-in-the-Loop Studio</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Code Editor</h3>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={12}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 text-sm font-mono resize-none"
          ></textarea>
          <div className="mt-3 text-xs text-gray-400">
            Highlight lines and add feedback to improve generation
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Feedback Panel</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback on the code..."
            rows={6}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 text-sm resize-none"
          ></textarea>
          <button
            onClick={handleSubmitFeedback}
            className="mt-3 w-full px-4 py-2 bg-schrodinger-primary text-white rounded hover:bg-schrodinger-accent transition-colors"
          >
            Submit Feedback (5x multiplier)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{edits}</div>
          <div className="text-xs text-gray-400">Human Edits</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-400">{rewardScore.toFixed(1)}</div>
          <div className="text-xs text-gray-400">RLHF Score</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">{(rewardScore * 0.3).toFixed(2)}</div>
          <div className="text-xs text-gray-400">Reward Contribution</div>
        </div>
      </div>
    </div>
  );
}
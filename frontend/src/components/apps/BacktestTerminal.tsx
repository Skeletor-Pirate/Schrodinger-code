import { useState, useEffect } from 'react';

export function BacktestTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState({ sharpe: 0, drawdown: 0, winRate: 0, trades: 0 });

  const runBacktest = () => {
    setRunning(true);
    setLogs(['[INIT] Starting backtest...', '[LOAD] Loading price data...']);

    const steps = [
      '[DATA] Loaded 50,000 bars (1min OHLCV)',
      '[STRATEGY] Initializing momentum strategy',
      '[TRADE] Entry: LONG AAPL @ 150.25',
      '[TRADE] Exit: LONG AAPL @ 152.80 (+1.7%)',
      '[TRADE] Entry: SHORT TSLA @ 245.10',
      '[TRADE] Exit: SHORT TSLA @ 241.50 (+1.5%)',
      '[METRICS] Calculating Sharpe ratio...',
      '[METRICS] Calculating max drawdown...',
      '[METRICS] Computing win rate...',
      '[COMPLETE] Backtest finished successfully',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < steps.length) {
        setLogs(prev => [...prev, steps[index]]);
        index++;
      } else {
        clearInterval(interval);
        setRunning(false);
        setResults({
          sharpe: 1.85,
          drawdown: 8.2,
          winRate: 64.5,
          trades: 147,
        });
      }
    }, 200);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text">Backtest Terminal</h2>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Terminal</h3>
          <button
            onClick={runBacktest}
            disabled={running}
            className="px-4 py-2 bg-schrodinger-primary text-white rounded hover:bg-schrodinger-accent transition-colors disabled:opacity-50"
          >
            {running ? 'Running...' : 'Run Backtest'}
          </button>
        </div>

        <div className="terminal h-80 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="terminal-line">
              <span className="text-gray-500 font-mono">[{new Date().toLocaleTimeString()}]</span>{' '}
              <span className="text-green-400">{log}</span>
            </div>
          ))}
          {!running && logs.length === 0 && (
            <div className="text-gray-500">Click "Run Backtest" to start</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{results.sharpe}</div>
          <div className="text-xs text-gray-400">Sharpe Ratio</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-400">{results.drawdown}%</div>
          <div className="text-xs text-gray-400">Max Drawdown</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{results.winRate}%</div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-400">{results.trades}</div>
          <div className="text-xs text-gray-400">Total Trades</div>
        </div>
      </div>
    </div>
  );
}
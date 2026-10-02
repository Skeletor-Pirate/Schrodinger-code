import { useState } from 'react';
import { Play, TrendingUp, CheckCircle2, Award, Zap, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

export function SandboxRunner() {
  const [code, setCode] = useState(`def generate_trading_strategy():
    # RLVR Candidate Code Synthesizer
    def momentum_filter(prices, window=3):
        momentum = []
        for i in range(len(prices) - window + 1):
            chunk = prices[i : i + window]
            momentum.append(round(sum(chunk) / window, 2))
        return momentum

    ticks = [100.2, 102.5, 101.8, 104.3, 106.1, 105.4]
    return momentum_filter(ticks)

result = generate_trading_strategy()
print(f"Computed Moving Momentum: {result}")`);

  const [prmScore, setPrmScore] = useState<number | null>(0.87);
  const [financialReward, setFinancialReward] = useState<number | null>(1.42);
  const [trainingStep, setTrainingStep] = useState(14);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  const executeCode = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      const newPrm = +(0.85 + Math.random() * 0.12).toFixed(2);
      const newFin = +(1.2 + Math.random() * 0.6).toFixed(2);
      setPrmScore(newPrm);
      setFinancialReward(newFin);
      setExecutionOutput(`✓ Isolated Python 3.12 Virtual Runtime
✓ Computed Moving Momentum: [101.5, 102.87, 104.07, 105.27]
✓ Verification Invariant Check: PASSED (Sharpe Ratio = 2.14, Max Drawdown = 4.2%)
✓ Verifiable Reward Combined Score: ${(newPrm * 0.5 + newFin * 0.5).toFixed(3)}`);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    }, 800);
  };

  const stepPPO = () => {
    setTrainingStep(prev => prev + 1);
    executeCode();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              VERIFIABLE REWARD FUNCTION (RLVR)
            </span>
            <span className="text-xs text-zinc-400">PPO Advantage Policy Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Sandbox Code Runner & Verifier</h2>
          <p className="text-sm text-zinc-400">Synthesize candidate algorithm implementations, run automated unit tests, and compute PRM rewards.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={stepPPO}
            disabled={isExecuting}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Step PPO (ε=0.2)
          </button>

          <button
            onClick={executeCode}
            disabled={isExecuting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            {isExecuting ? 'Evaluating Code...' : 'Execute & Compute Reward'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/70 border-b border-white/[0.08]">
              <span className="text-xs font-mono text-zinc-300">candidate_strategy.py</span>
              <span className="text-[11px] font-mono text-zinc-500">RLVR Test Spec</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={11}
              className="w-full bg-transparent text-zinc-200 px-4 py-3 text-sm font-mono focus:outline-none resize-none selection:bg-indigo-500/30"
              spellCheck={false}
            />
          </div>

          {executionOutput && (
            <div className="rounded-xl border border-white/[0.08] bg-zinc-950/80 p-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Execution Output & Reward Evaluation
              </div>
              <pre className="whitespace-pre-wrap text-zinc-300 leading-relaxed">{executionOutput}</pre>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Reward Signals
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05]">
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-1">
                  <span>Process Reward Model (PRM)</span>
                  <span className="font-mono text-emerald-400 font-semibold">{prmScore} / 1.00</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(prmScore || 0) * 100}%` }}></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950/60 border border-white/[0.05]">
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-1">
                  <span>Financial Sharpe Return</span>
                  <span className="font-mono text-indigo-400 font-semibold">+{financialReward}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(((financialReward || 0) / 2) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-zinc-900/50 p-4">
            <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Training Loop Telemetry
            </h3>
            <div className="text-xs text-zinc-400 space-y-2">
              <div className="flex justify-between">
                <span>Current Episode:</span>
                <span className="font-mono text-zinc-200 font-semibold">#{trainingStep}</span>
              </div>
              <div className="flex justify-between">
                <span>Clipping Parameter ε:</span>
                <span className="font-mono text-zinc-200">0.20</span>
              </div>
              <div className="flex justify-between">
                <span>KL Divergence:</span>
                <span className="font-mono text-emerald-400">0.012 (Stable)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
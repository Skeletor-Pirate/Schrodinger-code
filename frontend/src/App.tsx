import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, 
  Search, 
  Terminal, 
  TrendingUp,
  X,
  ArrowLeft,
  Sliders,
  ChevronDown,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Activity,
  Boxes,
  Compass
} from 'lucide-react';

import AppRenderer from './components/AppRenderer';
import { TerminalLogs } from './components/TerminalLogs';
import { PolicyChart } from './components/PolicyChart';
import { TAB_NAVIGATION } from './config/apps';

interface EngineItem {
  id: number;
  label: string;
  category: 'core' | 'ai' | 'systems' | 'telemetry';
  description: string;
  tag: string;
}

export default function App() {
  // 0: Flagship Home, 1: Docs, 2: Settings, 3+: TAB_NAVIGATION[id - 3]
  const [activeComponent, setActiveComponent] = useState(0);
  const [showTerminalDrawer, setShowTerminalDrawer] = useState(false);
  const [showPolicyDrawer, setShowPolicyDrawer] = useState(false);
  const [showEngineSwitcher, setShowEngineSwitcher] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 26 comprehensive engines & pages
  const allEngines: EngineItem[] = useMemo(() => {
    const list: EngineItem[] = [
      { id: 0, label: 'Flagship Overview', category: 'core', description: 'Product overview & core specs', tag: 'Core' },
      { id: 23, label: 'Architecture Protocol', category: 'core', description: 'End-to-end systems architecture spec', tag: 'Protocol' },
      { id: 1, label: 'Technical Docs', category: 'core', description: 'Systems documentation & schemas', tag: 'Docs' },
      { id: 2, label: 'Platform Settings', category: 'core', description: 'LLM hyperparameters & environment', tag: 'Config' },
    ];

    TAB_NAVIGATION.forEach((tab) => {
      let category: 'ai' | 'systems' | 'telemetry' = 'systems';
      if (['MultiAgentNetwork', 'SandboxRunner', 'TrajectoryVisualizer', 'PolicyChart', 'AgentSpawningDemo', 'HumanInTheLoopStudio'].includes(tab.label)) {
        category = 'ai';
      } else if (['SpatialTopology3D', 'PerformanceBenchmark', 'PerformanceHeatmap', 'BacktestTerminal', 'LanguageControlSandbox', 'DiagnosticsModal', 'TerminalLogs', 'CodebaseViewer'].includes(tab.label)) {
        category = 'telemetry';
      } else {
        category = 'systems';
      }

      list.push({
        id: tab.id + 3,
        label: tab.label.replace(/([A-Z])/g, ' $1').trim(),
        category,
        description: tab.description,
        tag: category.toUpperCase(),
      });
    });

    return list;
  }, []);

  const activeEngine = useMemo(() => {
    return allEngines.find(e => e.id === activeComponent) || allEngines[0];
  }, [allEngines, activeComponent]);

  const filteredEngines = useMemo(() => {
    if (!searchQuery.trim()) return allEngines;
    const q = searchQuery.toLowerCase();
    return allEngines.filter(e => 
      e.label.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q)
    );
  }, [allEngines, searchQuery]);

  const selectEngine = (id: number) => {
    setActiveComponent(id);
    setShowEngineSwitcher(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = activeComponent === 0;

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col font-sans selection:bg-[#2997ff]/20">
      {/* Precision Apple-Style Frosted Top Bar */}
      <header className="sticky top-0 z-40 h-14 border-b border-white/[0.08] bg-black/75 backdrop-blur-2xl px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => selectEngine(0)}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center group-hover:border-white/[0.3] transition-colors">
              <Atom className="w-4 h-4 text-[#f5f5f7]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight text-[#f5f5f7] group-hover:text-white transition-colors">
                Schrödinger's Codebase
              </span>
              <span className="text-[10px] font-mono text-[#86868b] hidden sm:inline">
                RLVR // v1.0.4
              </span>
            </div>
          </button>
        </div>

        {/* Center Nav Link Pills (Apple style) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[#86868b]">
          <button
            onClick={() => selectEngine(0)}
            className={`px-3 py-1.5 rounded-full transition-colors ${isHome ? 'text-white bg-white/[0.08]' : 'hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => selectEngine(23)} // Architecture Protocol
            className={`px-3 py-1.5 rounded-full transition-colors ${activeComponent === 23 ? 'text-white bg-white/[0.08]' : 'hover:text-white'}`}
          >
            Architecture
          </button>
          <button
            onClick={() => selectEngine(1)} // Docs
            className={`px-3 py-1.5 rounded-full transition-colors ${activeComponent === 1 ? 'text-white bg-white/[0.08]' : 'hover:text-white'}`}
          >
            Documentation
          </button>
          <button
            onClick={() => selectEngine(2)} // Settings
            className={`px-3 py-1.5 rounded-full transition-colors ${activeComponent === 2 ? 'text-white bg-white/[0.08]' : 'hover:text-white'}`}
          >
            Settings
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2">
          {/* Quick Engine Switcher Dropdown */}
          <button
            onClick={() => setShowEngineSwitcher(!showEngineSwitcher)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#f5f5f7] transition-all"
          >
            <Boxes className="w-3.5 h-3.5 text-[#2997ff]" />
            <span className="hidden xs:inline">Engines (23)</span>
            <ChevronDown className={`w-3 h-3 text-[#86868b] transition-transform ${showEngineSwitcher ? 'rotate-180' : ''}`} />
          </button>

          {/* Terminal Drawer Toggle */}
          <button
            onClick={() => setShowTerminalDrawer(!showTerminalDrawer)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 ${
              showTerminalDrawer 
                ? 'bg-white/15 border-white/20 text-white' 
                : 'border-white/[0.08] bg-white/[0.03] text-[#86868b] hover:text-white'
            }`}
            title="Toggle Live Terminal Stream"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logs</span>
          </button>

          {/* PPO Graph Toggle */}
          <button
            onClick={() => setShowPolicyDrawer(!showPolicyDrawer)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 ${
              showPolicyDrawer 
                ? 'bg-[#30d158]/20 border-[#30d158]/40 text-[#30d158]' 
                : 'border-white/[0.08] bg-white/[0.03] text-[#86868b] hover:text-white'
            }`}
            title="Toggle PPO Convergence Telemetry"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PPO</span>
          </button>
        </div>
      </header>

      {/* Engine Switcher Modal Palette */}
      <AnimatePresence>
        {showEngineSwitcher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
            onClick={() => setShowEngineSwitcher(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -10 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#0d0d12] shadow-apple-card overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/[0.08] flex items-center gap-3">
                <Search className="w-4 h-4 text-[#86868b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to filter 23 interactive engines..."
                  className="w-full bg-transparent text-sm text-[#f5f5f7] placeholder-[#86868b] focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setShowEngineSwitcher(false)}
                  className="p-1 text-[#86868b] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
                {filteredEngines.map(engine => (
                  <button
                    key={engine.id}
                    onClick={() => selectEngine(engine.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                      activeComponent === engine.id 
                        ? 'bg-white/[0.1] border border-white/[0.12] text-white' 
                        : 'hover:bg-white/[0.05] text-[#86868b] hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#f5f5f7]">{engine.label}</div>
                      <div className="text-[11px] text-[#86868b]">{engine.description}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/[0.06] text-zinc-400">
                      {engine.tag}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb strip if inside a specific workstation engine */}
      {!isHome && (
        <div className="border-b border-white/[0.06] bg-[#070709] px-4 sm:px-8 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => selectEngine(0)}
              className="inline-flex items-center gap-1.5 text-[#86868b] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Flagship Overview</span>
            </button>
            <span className="text-zinc-700">/</span>
            <span className="font-semibold text-[#f5f5f7]">{activeEngine.label}</span>
          </div>

          <button
            onClick={() => setShowEngineSwitcher(true)}
            className="text-xs text-[#2997ff] hover:underline flex items-center gap-1"
          >
            <span>Switch Engine</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Flagship Content Area */}
      <main className="flex-1 px-4 sm:px-8 py-8 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeComponent}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <AppRenderer 
              activeComponent={activeComponent} 
              isLoaded={isLoaded} 
              onNavigate={(id) => selectEngine(id)} 
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Docked Drawers */}
      {/* Terminal Drawer */}
      <AnimatePresence>
        {showTerminalDrawer && (
          <motion.div
            initial={{ y: 250, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 250, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#070709] border-t border-white/[0.1] shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-6 py-2.5 border-b border-white/[0.08] bg-black/60">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#2997ff]" />
                <span className="text-xs font-mono font-medium text-[#f5f5f7]">System Execution Log Stream</span>
              </div>
              <button
                onClick={() => setShowTerminalDrawer(false)}
                className="text-[#86868b] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto p-4 max-w-5xl mx-auto">
              <TerminalLogs />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Policy Chart Drawer */}
      <AnimatePresence>
        {showPolicyDrawer && (
          <motion.div
            initial={{ y: 250, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 250, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#070709] border-t border-white/[0.1] shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-6 py-2.5 border-b border-white/[0.08] bg-black/60">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#30d158]" />
                <span className="text-xs font-mono font-medium text-[#f5f5f7]">PPO Reward Convergence & Actor-Critic Losses</span>
              </div>
              <button
                onClick={() => setShowPolicyDrawer(false)}
                className="text-[#86868b] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-4 max-w-5xl mx-auto">
              <PolicyChart />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
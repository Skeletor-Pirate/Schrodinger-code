import { useState, useMemo } from 'react';
import { HomePage } from './apps/HomePage';
import { DocsPage } from './apps/DocsPage';
import { SettingsPage } from './apps/SettingsPage';

// Core components
import { VirtualFsExplorer } from './apps/VirtualFsExplorer';
import { SandboxRunner } from './apps/SandboxRunner';
import { MultiAgentNetwork } from './apps/MultiAgentNetwork';
import { HumanInTheLoopStudio } from './apps/HumanInTheLoopStudio';
import { OpenFileHandleManager } from './apps/OpenFileHandleManager';
import { TrajectoryVisualizer } from './apps/TrajectoryVisualizer';
import { CppAdvancedPanel } from './apps/CppAdvancedPanel';
import { RustSafetyPanel } from './apps/RustSafetyPanel';
import { LanguageInteropDemo } from './apps/LanguageInteropDemo';
import { MemorySafetyVisualizer } from './apps/MemorySafetyVisualizer';
import { SpatialTopology3D } from './apps/SpatialTopology3D';
import { PerformanceBenchmark } from './apps/PerformanceBenchmark';
import { PerformanceHeatmap } from './apps/PerformanceHeatmap';
import { AgentSpawningDemo } from './apps/AgentSpawningDemo';
import { BacktestTerminal } from './apps/BacktestTerminal';
import { CLanguagePanel } from './apps/CLanguagePanel';
import { LanguageControlSandbox } from './apps/LanguageControlSandbox';
import { DiagnosticsModal } from './apps/DiagnosticsModal';
import { CodebaseViewer } from './apps/CodebaseViewer';
import { WasmIntegration } from './apps/WasmIntegration';
import { ArchitectureProtocol } from './apps/ArchitectureProtocol';
import { TerminalLogs } from './TerminalLogs';
import { PolicyChart } from './PolicyChart';

interface AppRendererProps {
  activeComponent: number;
  isLoaded: boolean;
  onNavigate?: (id: number) => void;
}

export function AppRenderer({ activeComponent, isLoaded, onNavigate }: AppRendererProps) {
  const [, setDocsContent] = useState('');
  const [settings, setSettings] = useState({
    apiKey: '',
    model: 'claude-3-5-sonnet',
    temperature: 0.7,
    maxTokens: 2048,
  });

  // 23 specialized applications
  const appComponents = useMemo(() => [
    VirtualFsExplorer,        // 0
    SandboxRunner,            // 1
    MultiAgentNetwork,        // 2
    HumanInTheLoopStudio,     // 3
    OpenFileHandleManager,    // 4
    TrajectoryVisualizer,     // 5
    CppAdvancedPanel,         // 6
    RustSafetyPanel,          // 7
    LanguageInteropDemo,      // 8
    MemorySafetyVisualizer,   // 9
    SpatialTopology3D,        // 10
    PerformanceBenchmark,     // 11
    PerformanceHeatmap,       // 12
    AgentSpawningDemo,        // 13
    BacktestTerminal,         // 14
    CLanguagePanel,           // 15
    LanguageControlSandbox,   // 16
    DiagnosticsModal,         // 17
    TerminalLogs,             // 18
    PolicyChart,              // 19
    ArchitectureProtocol,     // 20
    CodebaseViewer,           // 21
    WasmIntegration,          // 22
  ], []);

  // System overview pages
  const pageComponents = useMemo(() => [
    HomePage,
    DocsPage,
    SettingsPage,
  ], []);

  if (activeComponent < 0) {
    const PageComponent = pageComponents[0];
    return <PageComponent settings={settings} onSettingsChange={setSettings} onDocsLoad={setDocsContent} onNavigate={onNavigate} />;
  }

  if (activeComponent < 3) {
    const PageComponent = pageComponents[activeComponent];
    return <PageComponent settings={settings} onSettingsChange={setSettings} onDocsLoad={setDocsContent} onNavigate={onNavigate} />;
  }

  // App components index shifted by 3 (activeComponent 3 -> app 0)
  const appIndex = activeComponent - 3;
  if (appIndex >= 0 && appIndex < appComponents.length) {
    const Component = appComponents[appIndex];
    return <Component />;
  }

  // Fallback to Home
  const Fallback = pageComponents[0];
  return <Fallback settings={settings} onSettingsChange={setSettings} onDocsLoad={setDocsContent} onNavigate={onNavigate} />;
}

export default AppRenderer;
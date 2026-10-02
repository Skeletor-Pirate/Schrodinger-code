import { useState } from 'react';

interface Props {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onDocsLoad: (content: string) => void;
}

export function SettingsPage({ settings, onSettingsChange }: Props) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-bold gradient-text">Settings</h2>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4">LLM Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Model</label>
            <select
              value={localSettings.model}
              onChange={(e) => handleChange('model', e.target.value)}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
            >
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">API Key</label>
            <input
              type="password"
              value={localSettings.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="Enter your API key"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Temperature: {localSettings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={localSettings.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Max Tokens: {localSettings.maxTokens}
            </label>
            <input
              type="range"
              min="512"
              max="8192"
              step="512"
              value={localSettings.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4">PPO Training Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Learning Rate: {3e-4}
            </label>
            <input
              type="range"
              min="1e-5"
              max="1e-3"
              step="1e-5"
              value={3e-4}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Clip Epsilon (ε): 0.2
            </label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={0.2}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Entropy Coefficient: 0.01
            </label>
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={0.01}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              LoRA Rank: 16
            </label>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={16}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Cache Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Max Cache Size: 1 GB
            </label>
            <input
              type="range"
              min="100"
              max="4096"
              step="100"
              value={1024}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              GC Interval: 30 seconds
            </label>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={30}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Eviction Policy: LRU
            </label>
            <select className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600">
              <option value="LRU">LRU (Least Recently Used)</option>
              <option value="LFU">LFU (Least Frequently Used)</option>
              <option value="FIFO">FIFO (First In First Out)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => onSettingsChange(localSettings)}
          className="px-6 py-3 bg-schrodinger-primary text-white rounded-lg hover:bg-schrodinger-accent transition-colors font-semibold flex-1"
        >
          Save Settings
        </button>
        <button
          onClick={() => {
            setLocalSettings({
              apiKey: '',
              model: 'claude-3-5-sonnet',
              temperature: 0.7,
              maxTokens: 2048,
            });
          }}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold flex-1"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
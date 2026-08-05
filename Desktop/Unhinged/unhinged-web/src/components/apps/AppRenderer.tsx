'use client';

import React from 'react';
import { AppId } from '../../types';
import { ChatApp } from './ChatApp';
import { ObsidianBrainApp } from './ObsidianBrainApp';
import { AgentStudioApp } from './AgentStudioApp';
import { PluginStoreApp } from './PluginStoreApp';
import { HackathonApp } from './HackathonApp';
import { AdminPanelApp } from './AdminPanelApp';
import { SettingsApp } from './SettingsApp';
import { OmniSearchApp } from './OmniSearchApp';
import { ProfileApp } from './ProfileApp';

interface AppRendererProps {
  appId: AppId;
}

export const AppRenderer: React.FC<AppRendererProps> = ({ appId }) => {
  switch (appId) {
    case 'chat':
      return <ChatApp />;
    case 'files':
      return <ObsidianBrainApp />;
    case 'studio':
      return <AgentStudioApp />;
    case 'marketplace':
      return <PluginStoreApp />;
    case 'hackathons':
      return <HackathonApp />;
    case 'admin':
      return <AdminPanelApp />;
    case 'settings':
      return <SettingsApp />;
    case 'search':
      return <OmniSearchApp />;
    case 'profile':
      return <ProfileApp />;
    default:
      return (
        <div className="flex items-center justify-center h-full bg-[#0d0d14] text-[#a0a0b8] text-xs">
          Application window content loaded.
        </div>
      );
  }
};

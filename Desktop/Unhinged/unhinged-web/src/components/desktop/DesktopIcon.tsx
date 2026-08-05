'use client';

import React from 'react';
import { AppId } from '../../types';
import { useDesktopStore } from '../../store/desktopStore';
import { APPS } from '../../config/apps';
import { DynamicIcon } from '../DynamicIcon';

interface DesktopIconProps {
  appId: AppId;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ appId }) => {
  const { openWindow } = useDesktopStore();
  const appDef = APPS[appId];

  if (!appDef) return null;

  return (
    <button
      onDoubleClick={() => openWindow(appId)}
      onTouchEnd={() => openWindow(appId)} // double click alternative for touch
      className="desktop-icon group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200 border border-transparent hover:bg-white/5 hover:border-white/10 active:scale-95 focus:outline-none"
      title={appDef.description}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#161622]/40 border border-white/5 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-lg"
        style={{
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
        }}
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `radial-gradient(135deg, ${appDef.color}20, ${appDef.color}10)`,
            border: `1px solid ${appDef.color}30`
          }}
        >
          <DynamicIcon name={appDef.icon} size={20} color={appDef.color} />
        </div>
      </div>
      <span 
        className="desktop-icon-label text-[11px] font-medium text-[#e8e8f0] text-center max-w-[80px] truncate select-none"
        style={{
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.8), 0 2px 6px rgba(0, 0, 0, 0.5)'
        }}
      >
        {appDef.name}
      </span>
    </button>
  );
};

'use client';

import React, { useRef } from 'react';
import { Rnd } from 'react-rnd';
import { WindowState } from '../../types';
import { useDesktopStore } from '../../store/desktopStore';
import { DynamicIcon } from '../DynamicIcon';
import { APPS } from '../../config/apps';

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ windowState, children }) => {
  const {
    id,
    appId,
    title,
    x,
    y,
    width,
    height,
    isMinimized,
    isMaximized,
    zIndex,
    isClosing
  } = windowState;

  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId
  } = useDesktopStore();

  const appDef = APPS[appId];
  const isActive = activeWindowId === id;

  if (isMinimized) return null;

  return (
    <Rnd
      size={isMaximized ? { width: '100vw', height: 'calc(100vh - 52px)' } : { width, height }}
      position={isMaximized ? { x: 0, y: 0 } : { x, y }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      minWidth={appDef?.minWidth || 300}
      minHeight={appDef?.minHeight || 200}
      bounds="parent"
      dragHandleClassName="window-titlebar-drag"
      onDragStart={() => focusWindow(id)}
      onDragStop={(e, d) => {
        updateWindowPosition(id, d.x, d.y);
      }}
      onResizeStart={() => focusWindow(id)}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateWindowSize(id, ref.offsetWidth, ref.offsetHeight);
        updateWindowPosition(id, position.x, position.y);
      }}
      style={{
        zIndex,
        display: isClosing ? 'none' : 'flex',
        flexDirection: 'column',
        transition: isMaximized ? 'width 0.2s, height 0.2s, transform 0.2s' : 'none'
      }}
      className={`window glass ${isActive ? 'active shadow-xl border-[#6c5ce7]/30' : 'shadow-md'} overflow-hidden rounded-xl border border-white/5 flex flex-col`}
    >
      {/* Titlebar */}
      <div
        className="window-titlebar flex items-center justify-between px-4 select-none shrink-0 bg-[#0d0d14]/90 border-b border-white/5"
        style={{ height: '36px' }}
        onMouseDown={() => focusWindow(id)}
        onDoubleClick={() => maximizeWindow(id)}
      >
        {/* Left Side: Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="window-titlebar-btn close"
            aria-label="Close window"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="window-titlebar-btn minimize"
            aria-label="Minimize window"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            className="window-titlebar-btn maximize"
            aria-label="Maximize window"
          />
        </div>

        {/* Center: Title & Icon (Drag Handle) */}
        <div className="window-titlebar-drag flex-1 h-full flex items-center justify-center gap-2 cursor-default font-medium text-xs text-[#a0a0b8]">
          <DynamicIcon name={appDef?.icon || 'HelpCircle'} size={14} color={appDef?.color} />
          <span>{title}</span>
        </div>

        {/* Right Side: Spacer */}
        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div 
        className="window-content flex-1 overflow-hidden flex flex-col bg-[#0b0b11]"
        onMouseDown={() => focusWindow(id)}
      >
        {children}
      </div>
    </Rnd>
  );
};

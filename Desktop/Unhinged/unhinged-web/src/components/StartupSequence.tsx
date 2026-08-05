'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Audio from './audio-player'; // We'll create this component

export const StartupSequence = () => {
  const [showStartup, setShowStartup] = useState(true);
  const [showDesktop, setShowDesktop] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes openUh {
        0% {
          opacity: 0;
          transform: scale(0.2) rotate(-15deg);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.2) rotate(5deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }
    `;
    document.head.appendChild(style);

    // Sequence: show startup for 3 seconds, then show desktop
    const timer = setTimeout(() => {
      setShowStartup(false);
      setShowDesktop(true);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (showStartup) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999]">
        <div className="relative w-32 h-32">
          <Image
            src="/uh-logo.svg"
            alt="Uh Logo"
            width={64}
            height={64}
            className="transition-transform duration-300 ease-out"
          />
          {/* Animated "Uh" text that appears to open */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="text-5xl font-bold text-white tracking-wider"
              style={{
                opacity: 0.8,
                transform: 'scale(0.8)',
                animation: 'openUh 1.5s ease-out forwards'
              }}
            >
              Uh
            </div>
          </div>
          <Audio src="/unhinged-sound.mp3" autoPlay={true} />
        </div>
        <div className="mt-8 text-white text-sm">
          Unhinged OS
        </div>
      </div>
    );
  }

  if (showDesktop) {
    return null; // Return null to let the main app render
  }

  return null;
};
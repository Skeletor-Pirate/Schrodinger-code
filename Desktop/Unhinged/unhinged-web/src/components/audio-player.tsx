'use client';

import { useEffect, useRef } from 'react';

interface AudioProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
}

export const Audio = ({ src, autoPlay = false, loop = false, volume = 0.5 }: AudioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.src = src;
    audioRef.current.loop = loop;
    audioRef.current.volume = volume;

    if (autoPlay) {
      const playPromise = audioRef.current.play();

      // Handle autoplay restrictions
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
          })
          .catch((error) => {
            console.warn('Autoplay was prevented:', error);
            // We could show a UI to enable sound here if needed
          });
      }
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [src, autoPlay, loop, volume]);

  // We don't render anything visible for the audio element
  return (
    <audio ref={audioRef} style={{ display: 'none' }} />
  );
};

export default Audio;
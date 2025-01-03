import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Controls } from './Controls';
import { useVideoPlayback } from '../../hooks/useVideoPlayback';
import { LoadingSpinner } from '../LoadingSpinner';
import { useVideoFormats } from '../../hooks/useVideoFormats';

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  
  const {
    isFullscreen,
    isMuted,
    handleToggleFullscreen,
    handleToggleMute,
  } = useVideoPlayback(videoRef, containerRef);

  const { initializeVideo } = useVideoFormats();

  useEffect(() => {
    if (!videoRef.current) return;
    setIsLoading(true);
    setError(undefined);

    const cleanup = initializeVideo(videoRef.current, src, {
      onLoadStart: () => setIsLoading(true),
      onCanPlay: () => setIsLoading(false),
      onError: () => {
        setError('视频加载失败，请尝试其他频道');
        setIsLoading(false);
      }
    });

    return cleanup;
  }, [src, initializeVideo]);

  return (
    <div ref={containerRef} className="relative group bg-black aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls={false}
        autoPlay
        playsInline
        muted={isMuted}
      />
      
      {isLoading && <LoadingSpinner />}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-black/50">
          <p>{error}</p>
        </div>
      )}

      <Controls
        videoRef={videoRef}
        isFullscreen={isFullscreen}
        isMuted={isMuted}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleMute={handleToggleMute}
      />
    </div>
  );
};
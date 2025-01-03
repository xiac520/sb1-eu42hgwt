import React from 'react';
import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { CastButton } from '../CastButton';

interface ControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isFullscreen: boolean;
  isMuted: boolean;
  onToggleFullscreen: () => void;
  onToggleMute: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  videoRef,
  isFullscreen,
  isMuted,
  onToggleFullscreen,
  onToggleMute,
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end space-x-2">
      <button
        onClick={onToggleMute}
        className="p-2 text-white hover:bg-gray-700/50 rounded-full transition-colors"
        title={isMuted ? '取消静音' : '静音'}
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>
      <CastButton videoElement={videoRef.current} />
      <button
        onClick={onToggleFullscreen}
        className="p-2 text-white hover:bg-gray-700/50 rounded-full transition-colors"
        title={isFullscreen ? '退出全屏' : '全屏'}
      >
        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
      </button>
    </div>
  );
};
import React, { useState } from 'react';
import { Cast, MonitorOff } from 'lucide-react'; // Changed CastOff to MonitorOff

interface CastButtonProps {
  videoElement: HTMLVideoElement | null;
}

export const CastButton: React.FC<CastButtonProps> = ({ videoElement }) => {
  const [isCasting, setIsCasting] = useState(false);

  const startCasting = async () => {
    if (!videoElement) return;

    try {
      // iOS AirPlay
      if (videoElement.webkitShowPlaybackTargetPicker) {
        videoElement.webkitShowPlaybackTargetPicker();
        setIsCasting(true);
      }
      // Picture-in-Picture fallback
      else if (document.pictureInPictureEnabled && !document.pictureInPictureElement) {
        await videoElement.requestPictureInPicture();
        setIsCasting(true);
      }
    } catch (error) {
      console.error('投屏失败:', error);
    }
  };

  const stopCasting = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
      setIsCasting(false);
    } catch (error) {
      console.error('停止投屏失败:', error);
    }
  };

  return (
    <button
      onClick={isCasting ? stopCasting : startCasting}
      className="p-2 text-white hover:bg-gray-700/50 rounded-full transition-colors"
      title={isCasting ? '停止投屏' : '开始投屏'}
    >
      {isCasting ? <MonitorOff className="w-6 h-6" /> : <Cast className="w-6 h-6" />}
    </button>
  );
};
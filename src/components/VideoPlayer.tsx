import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { CastButton } from './CastButton';

interface VideoPlayerProps {
  src: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 200 * 1000 * 1000, // 200MB
          maxBufferHole: 0.5,
          lowLatencyMode: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        
        // 错误处理
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('网络错误，尝试恢复...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('媒体错误，尝试恢复...');
                hls.recoverMediaError();
                break;
              default:
                console.error('无法恢复的错误:', data);
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }
    } else {
      video.src = src;
    }

    // 启用 AirPlay
    video.setAttribute('x-webkit-airplay', 'allow');
    video.setAttribute('playsinline', 'true');
    
    return () => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        playsInline
      />
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <CastButton videoElement={videoRef.current} />
      </div>
    </div>
  );
};
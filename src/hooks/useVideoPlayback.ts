import { useCallback, useEffect, useState } from 'react';
import Hls from 'hls.js';

export const useVideoPlayback = (
  videoRef: React.RefObject<HTMLVideoElement>,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('全屏切换失败:', error);
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }, []);

  const initializeHls = useCallback((src: string) => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 200 * 1000 * 1000,
          maxBufferHole: 0.5,
          lowLatencyMode: true,
        });

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('网络错误，尝试恢复...');
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('媒体错误，尝试恢复...');
                hls?.recoverMediaError();
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

    video.setAttribute('x-webkit-airplay', 'allow');
    video.setAttribute('playsinline', 'true');

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return {
    isFullscreen,
    isMuted,
    handleToggleFullscreen,
    handleToggleMute,
    initializeHls,
  };
};
import { useCallback } from 'react';
import Hls from 'hls.js';

interface VideoCallbacks {
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
}

export const useVideoFormats = () => {
  const initializeVideo = useCallback((
    video: HTMLVideoElement,
    src: string,
    callbacks: VideoCallbacks
  ) => {
    let hls: Hls | null = null;
    
    const handleError = () => {
      callbacks.onError?.();
    };

    callbacks.onLoadStart?.();

    // Clear previous source and error handlers
    video.removeEventListener('error', handleError);
    video.src = '';
    
    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 50 * 1000 * 1000, // Reduced to 50MB
          maxBufferHole: 0.5,
          lowLatencyMode: true,
          enableWorker: true,
          progressive: true,
        });

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls?.recoverMediaError();
                break;
              default:
                handleError();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else {
        handleError();
        return () => {};
      }
    } else {
      video.src = src;
    }

    // Enable cross-platform features
    video.setAttribute('x-webkit-airplay', 'allow');
    video.setAttribute('playsinline', 'true');
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', () => callbacks.onCanPlay?.());

    return () => {
      video.removeEventListener('error', handleError);
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return { initializeVideo };
};
import React, { useEffect, useRef, useState } from 'react';

interface WebRTCStreamProps {
  streamId: string;
}

export function WebRTCStream({ streamId }: WebRTCStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let peerConnection: RTCPeerConnection | null = null;

    const initWebRTC = async () => {
      try {
        peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // 假设我们有一个信令服务器来交换SDP和ICE候选
        const signaling = new WebSocket(`wss://your-signaling-server.com/${streamId}`);

        signaling.onmessage = async (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'offer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            signaling.send(JSON.stringify(answer));
          } else if (message.type === 'candidate') {
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
          }
        };

        peerConnection.ontrack = (event) => {
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            signaling.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
          }
        };

      } catch (err) {
        console.error('WebRTC初始化失败:', err);
        setError('无法建立直播连接，请稍后重试。');
      }
    };

    initWebRTC();

    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [streamId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return <video ref={videoRef} autoPlay playsInline controls />;
}


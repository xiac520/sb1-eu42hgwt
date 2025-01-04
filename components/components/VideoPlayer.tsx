'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Channel, isValidStreamingUrl } from '@/utils/m3u-parser'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Maximize, Minimize, Heart, Cpu, Monitor } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface VideoPlayerProps {
  channel: Channel
}

export default function VideoPlayer({ channel }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [watchHistory, setWatchHistory] = useLocalStorage<string[]>('watchHistory', [])
  const [showControls, setShowControls] = useState(true)
  const [isHardwareDecoding, setIsHardwareDecoding] = useLocalStorage<boolean>('hardwareDecoding', true)
  const [hls, setHls] = useState<Hls | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current

      if (Hls.isSupported() && isValidStreamingUrl(channel.url)) {
        const newHls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        })
        
        newHls.loadSource(channel.url)
        newHls.attachMedia(video)
        
        newHls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((error) => {
            console.error('自动播放失败:', error)
          })
        })

        setHls(newHls)

        return () => {
          newHls.destroy()
        }
      } else if (video.canPlayType('application/vnd.apple.mpegurl') || isValidStreamingUrl(channel.url)) {
        video.src = channel.url
        video.play().catch((error) => {
          console.error('自动播放失败:', error)
        })
      }
    }

    // 添加到观看历史
    setWatchHistory(prev => [channel.id, ...prev.filter(id => id !== channel.id)].slice(0, 10))
  }, [channel.url, channel.id, setWatchHistory])

  useEffect(() => {
    if (hls) {
      hls.config.enableSoftwareAES = !isHardwareDecoding
    }
  }, [isHardwareDecoding, hls])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!videoRef.current.muted)
    }
  }

  const toggleFavorite = () => {
    setFavorites(prev => 
      prev.includes(channel.id)
        ? prev.filter(id => id !== channel.id)
        : [...prev, channel.id]
    )
  }

  const toggleHardwareDecoding = () => {
    setIsHardwareDecoding(!isHardwareDecoding)
  }

  const isFavorite = favorites.includes(channel.id)

  return (
    <div 
      className="relative w-full h-full bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        muted={isMuted}
      />
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">{channel.name}</h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                <Heart className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isHardwareDecoding ? <Cpu className="h-6 w-6 text-white" /> : <Monitor className="h-6 w-6 text-white" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={toggleHardwareDecoding}>
                    {isHardwareDecoding ? '切换到软件解码' : '切换到硬件解码'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="h-6 w-6 text-white" /> : <Maximize className="h-6 w-6 text-white" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


'use client'

import { useEffect, useRef, useState } from 'react'
import { useChannel } from '../hooks/use-channel'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sun, Moon, Eye, Cast, Heart, Settings } from 'lucide-react'
import Hls from 'hls.js'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { WebRTCStream } from './webrtc-stream'

const ChannelSettings = dynamic(() => import('./channel-settings'), {
  loading: () => <p>加载中...</p>,
})

interface Quality {
  height: number;
  bitrate: number;
}

export function VideoPlayer() {
  const { selectedChannel, selectedSource, setSelectedSource, toggleFavorite, favorites, quality, setQuality } = useChannel()
  const videoRef = useRef<HTMLVideoElement>(null)
  const { theme, setTheme } = useTheme()
  const [currentQuality, setCurrentQuality] = useState<string>('auto')
  const [availableQualities, setAvailableQualities] = useState<Quality[]>([])

  useEffect(() => {
    if (selectedSource && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          capLevelToPlayerSize: true,
          autoStartLoad: true,
          startLevel: -1, // 自动选择初始质量
          debug: false
        })

        hls.loadSource(selectedSource.url)
        hls.attachMedia(videoRef.current)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const availableQualities = hls.levels.map((level) => ({
            height: level.height,
            bitrate: level.bitrate
          }))
          setAvailableQualities(availableQualities)
        })

        hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
          const newQuality = hls.levels[data.level]
          setCurrentQuality(`${newQuality.height}p`)
        })

        // 手动设置质量
        const setQuality = (qualityIndex: number) => {
          hls.currentLevel = qualityIndex
        }

        return () => {
          hls.destroy()
        }
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = selectedSource.url
      }
    }
  }, [selectedSource, quality])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'eye-care' : 'dark')
  }

  if (!selectedChannel) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-xl text-gray-500">选择一个频道开始观看</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="aspect-video bg-black rounded-t-lg overflow-hidden relative">
          {selectedChannel.isWebRTC ? (
            <WebRTCStream streamId={selectedChannel.id} />
          ) : (
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full"
            >
              您的浏览器不支持视频标签。
            </video>
          )}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {currentQuality}
          </div>
          <div className="absolute top-2 right-2 space-x-2">
            <Button variant="secondary" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : theme === 'light' ? <Eye className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="secondary" size="icon">
              <Cast className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => toggleFavorite(selectedChannel.id)}
            >
              <Heart className={`h-4 w-4 ${favorites.includes(selectedChannel.id) ? 'fill-current' : ''}`} />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>频道设置</DialogTitle>
                  <DialogDescription>
                    调整播放质量和其他设置
                  </DialogDescription>
                </DialogHeader>
                <ChannelSettings
                  quality={quality}
                  onQualityChange={setQuality}
                  availableQualities={availableQualities}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">{selectedChannel.name}</h2>
          <p className="text-sm text-gray-500 mb-4">分组: {selectedChannel.group}</p>
          <Select
            value={selectedSource?.name}
            onValueChange={(value) => setSelectedSource(selectedChannel.sources.find(s => s.name === value) || null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择线路" />
            </SelectTrigger>
            <SelectContent>
              {selectedChannel.sources.map((source, index) => (
                <SelectItem key={index} value={source.name}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}


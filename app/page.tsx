'use client'

import { useState, useEffect } from 'react'
import VideoPlayer from '@/components/VideoPlayer'
import ChannelSidebar from '@/components/ChannelSidebar'
import { Channel } from '@/utils/m3u-parser'

export default function Home() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
      setShowSidebar(window.innerWidth > 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {showSidebar && (
        <ChannelSidebar 
          onSelectChannel={(channel) => {
            setSelectedChannel(channel)
            if (isMobile) setShowSidebar(false)
          }} 
        />
      )}
      <main className={`flex-1 overflow-hidden ${showSidebar && !isMobile ? 'w-[calc(100%-16rem)]' : 'w-full'}`}>
        {selectedChannel ? (
          <VideoPlayer channel={selectedChannel} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-muted-foreground">请选择一个频道开始观看</p>
          </div>
        )}
      </main>
      {isMobile && (
        <button 
          className="fixed bottom-4 left-4 bg-primary text-primary-foreground p-2 rounded-full shadow-lg"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? '隐藏频道' : '显示频道'}
        </button>
      )}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Channel } from '@/utils/m3u-parser'
import ChannelCard from './ChannelCard'
import { Skeleton } from '@/components/ui/skeleton'
import { translateChannelName } from '@/utils/translate'

interface ChannelGridProps {
  url: string
}

export default function ChannelGrid({ url }: ChannelGridProps) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchChannels()
  }, [url])

  async function fetchChannels() {
    try {
      const response = await fetch(`/api/channels?url=${encodeURIComponent(url)}`)
      const data = await response.json()
      // 应用翻译到频道名称
      const translatedData = data.map((channel: Channel) => ({
        ...channel,
        name: translateChannelName(channel.name)
      }))
      setChannels(translatedData)
    } catch (error) {
      console.error('获取频道失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGridCols = () => {
    if (windowWidth < 640) return 'grid-cols-1'
    if (windowWidth < 1024) return 'grid-cols-2'
    return 'grid-cols-3'
  }

  if (loading) {
    return (
      <div className={`grid ${getGridCols()} gap-4`}>
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${getGridCols()} gap-4`}>
      {channels.map((channel) => (
        <ChannelCard key={channel.url} channel={channel} />
      ))}
    </div>
  )
}


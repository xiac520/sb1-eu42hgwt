'use client'

import { useState, useEffect } from 'react'
import { Channel } from '@/utils/m3u-parser'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { translateChannelName } from '@/utils/translate'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { detectIPVersion } from '@/utils/network-detection'

interface ChannelSidebarProps {
  onSelectChannel: (channel: Channel) => void
}

export default function ChannelSidebar({ onSelectChannel }: ChannelSidebarProps) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [favorites] = useLocalStorage<string[]>('favorites', [])
  const [watchHistory] = useLocalStorage<string[]>('watchHistory', [])
  const [categories, setCategories] = useState<string[]>([])
  const [ipVersion, setIpVersion] = useState<'v4' | 'v6'>('v4')

  useEffect(() => {
    async function init() {
      const detectedVersion = await detectIPVersion()
      setIpVersion(detectedVersion)
    }
    init()
  }, [])

  useEffect(() => {
    fetchChannels()
  }, [ipVersion])

  useEffect(() => {
    filterChannels()
  }, [channels, searchTerm, selectedCategory])

  async function fetchChannels() {
    const url = ipVersion === 'v6' ? 'https://live.zbds.top/tv/iptv6.txt' : 'https://live.zbds.top/tv/iptv4.txt'
    try {
      const response = await fetch(`/api/channels?url=${encodeURIComponent(url)}`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setChannels(data)
        const uniqueCategories = Array.from(new Set(data.map(channel => channel.group)))
        setCategories(['全部', ...uniqueCategories])
      } else {
        console.error('Fetched data is not an array:', data)
        setChannels([])
      }
    } catch (error) {
      console.error('获取频道失败:', error)
      setChannels([])
    }
  }

  function filterChannels() {
    if (!Array.isArray(channels)) {
      console.error('Channels is not an array:', channels)
      setFilteredChannels([])
      return
    }

    let filtered = channels

    if (selectedCategory !== '全部') {
      filtered = filtered.filter(channel => channel.group === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(channel => 
        translateChannelName(channel.name).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredChannels(filtered)
  }

  const favoriteChannels = Array.isArray(channels) ? channels.filter(channel => favorites.includes(channel.id)) : []
  const historyChannels = Array.isArray(channels) ? channels.filter(channel => watchHistory.includes(channel.id)) : []

  return (
    <div className="w-64 bg-card border-r h-full flex flex-col">
      <div className="p-4 space-y-4">
        <div className="text-sm text-muted-foreground">
          当前网络: IPv{ipVersion === 'v6' ? '6' : '4'}
        </div>
        <Input
          type="search"
          placeholder="搜索频道..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="favorites">收藏</TabsTrigger>
          <TabsTrigger value="history">历史</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredChannels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onSelectChannel(channel)}
                >
                  {translateChannelName(channel.name)}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="favorites" className="flex-1">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {favoriteChannels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onSelectChannel(channel)}
                >
                  {translateChannelName(channel.name)}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="history" className="flex-1">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {historyChannels.map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onSelectChannel(channel)}
                >
                  {translateChannelName(channel.name)}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}


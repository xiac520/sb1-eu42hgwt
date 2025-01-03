import { useState, useEffect, useCallback } from 'react'
import { fetchWithRetry } from '../utils/fetch-with-retry'

interface Source {
  url: string
  name: string
}

interface Channel {
  id: string
  name: string
  logo: string
  group: string
  sources: Source[]
  isWebRTC?: boolean
}

const CHANNELS_PER_PAGE = 20

export function useChannel() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [quality, setQuality] = useState<'auto' | 'high' | 'medium' | 'low'>('auto')
  const [page, setPage] = useState(1)

  const loadMoreChannels = useCallback(async () => {
    try {
      const response = await fetchWithRetry(`/api/channels?page=${page}&limit=${CHANNELS_PER_PAGE}`, {
        retries: 3,
        retryDelay: 2000,
      });
      const data = await response.json();
      setChannels(prevChannels => [...prevChannels, ...data]);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('获取频道列表失败:', error);
      // 可以在这里添加用户友好的错误提示
    }
  }, [page])

  useEffect(() => {
    loadMoreChannels()

    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }

    const storedQuality = localStorage.getItem('quality') as 'auto' | 'high' | 'medium' | 'low'
    if (storedQuality) {
      setQuality(storedQuality)
    }
  }, [])

  useEffect(() => {
    if (selectedChannel && selectedChannel.sources.length > 0) {
      setSelectedSource(selectedChannel.sources[0])
    }
  }, [selectedChannel])

  const toggleFavorite = (channelId: string) => {
    const newFavorites = favorites.includes(channelId)
      ? favorites.filter(id => id !== channelId)
      : [...favorites, channelId]
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }

  return {
    channels,
    selectedChannel,
    setSelectedChannel,
    selectedSource,
    setSelectedSource,
    favorites,
    toggleFavorite,
    quality,
    setQuality,
    loadMoreChannels,
  }
}


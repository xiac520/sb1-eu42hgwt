'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

interface ChannelCounterProps {
  url: string
}

export default function ChannelCounter({ url }: ChannelCounterProps) {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch(`/api/channel-count?url=${encodeURIComponent(url)}`)
        const data = await response.json()
        setCount(data.count)
      } catch (error) {
        console.error('获取频道数量失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [url])

  return (
    <Badge variant="secondary" className="ml-2">
      {loading ? '...' : count}
    </Badge>
  )
}


'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Channel } from '@/utils/m3u-parser'
import VideoPlayer from './VideoPlayer'
import { Play } from 'lucide-react'
import { categories } from '@/constants/categories'
import { languages } from '@/constants/languages'
import { translateChannelName } from '@/utils/translate'

interface ChannelCardProps {
  channel: Channel
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const getChineseGroupName = (group: string) => {
    const category = categories.find(c => c.name.toLowerCase() === group.toLowerCase())
    if (category) return category.chineseName

    const language = languages.find(l => l.name.toLowerCase() === group.toLowerCase())
    if (language) return language.chineseName

    return group
  }

  return (
    <Card className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/20">
      <div className="relative aspect-video">
        {isPlaying ? (
          <VideoPlayer url={channel.url} />
        ) : (
          <>
            {channel.logo ? (
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">{channel.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="text-white w-12 h-12" />
            </div>
          </>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{translateChannelName(channel.name)}</h3>
        <p className="text-sm text-muted-foreground">{getChineseGroupName(channel.group)}</p>
      </CardContent>
    </Card>
  )
}


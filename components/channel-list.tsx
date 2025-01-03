'use client'

import { useState, useEffect } from 'react'
import { useChannel } from '../hooks/use-channel'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu } from 'lucide-react'

const CHANNELS_PER_PAGE = 20

export function ChannelList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { channels, selectedChannel, setSelectedChannel, favorites, loadMoreChannels } = useChannel()
  const [displayedChannels, setDisplayedChannels] = useState<typeof channels>([])

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView) {
      loadMoreChannels()
    }
  }, [inView, loadMoreChannels])

  useEffect(() => {
    setDisplayedChannels(channels.slice(0, CHANNELS_PER_PAGE))
  }, [channels])

  const filteredChannels = displayedChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className={`${isSidebarOpen ? 'w-64' : 'w-20'} h-full transition-all duration-300 ease-in-out overflow-hidden`}>
      <CardContent className="p-0 h-full">
        <div className="flex items-center justify-between p-4">
          <h1 className={`text-xl font-bold ${isSidebarOpen ? '' : 'hidden'}`}>云上世界</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <div className={`px-4 mb-4 ${isSidebarOpen ? '' : 'hidden'}`}>
          <Input
            type="search"
            placeholder="搜索频道"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="favorites">收藏</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <nav className="space-y-2 px-4">
                {filteredChannels.map(channel => (
                  <Button
                    key={channel.id}
                    variant={selectedChannel?.id === channel.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <img
                      src={channel.logo || '/placeholder.svg?height=20&width=20'}
                      alt=""
                      className="w-5 h-5 mr-2 rounded"
                    />
                    <span className={`${isSidebarOpen ? '' : 'hidden'}`}>{channel.name}</span>
                  </Button>
                ))}
                <div ref={ref} style={{ height: '20px' }}></div>
              </nav>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="favorites">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <nav className="space-y-2 px-4">
                {channels.filter(channel => favorites.includes(channel.id)).map(channel => (
                  <Button
                    key={channel.id}
                    variant={selectedChannel?.id === channel.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <img
                      src={channel.logo || '/placeholder.svg?height=20&width=20'}
                      alt=""
                      className="w-5 h-5 mr-2 rounded"
                    />
                    <span className={`${isSidebarOpen ? '' : 'hidden'}`}>{channel.name}</span>
                  </Button>
                ))}
              </nav>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


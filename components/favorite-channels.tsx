import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface Channel {
  id: string
  name: string
  logo: string
}

interface FavoriteChannelsProps {
  channels: Channel[]
  onSelectChannel: (channel: Channel) => void
  selectedChannelId: string | undefined
}

export function FavoriteChannels({ channels, onSelectChannel, selectedChannelId }: FavoriteChannelsProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <nav className="space-y-2 px-4">
        {channels.map(channel => (
          <Button
            key={channel.id}
            variant={selectedChannelId === channel.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectChannel(channel)}
          >
            <img
              src={channel.logo || '/placeholder.svg?height=20&width=20'}
              alt=""
              className="w-5 h-5 mr-2 rounded"
            />
            <span>{channel.name}</span>
          </Button>
        ))}
      </nav>
    </ScrollArea>
  )
}


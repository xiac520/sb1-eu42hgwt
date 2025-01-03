import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { VideoPlayer } from './components/VideoPlayer';
import { ChannelList } from './components/ChannelList';
import { Channel } from './types/channel';
import { useChannels } from './hooks/useChannels';

export default function App() {
  const { channels, loading, error } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<Channel>();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  React.useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, [channels, selectedChannel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <div
        className={`fixed lg:relative w-64 h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <ChannelList
          channels={channels}
          selectedChannel={selectedChannel}
          onChannelSelect={setSelectedChannel}
        />
      </div>

      <div className="flex-1">
        <div className="h-14 bg-gray-800 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-white text-lg font-medium ml-2">
            云上直播
          </h1>
        </div>

        <div className="aspect-video bg-black">
          {selectedChannel && (
            <VideoPlayer src={selectedChannel.url} />
          )}
        </div>

        {selectedChannel && (
          <div className="p-4">
            <h2 className="text-white text-xl font-medium">
              {selectedChannel.name}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
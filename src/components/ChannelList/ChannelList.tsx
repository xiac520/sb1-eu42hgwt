import React, { useState, useMemo } from 'react';
import { Tv } from 'lucide-react';
import { Channel, ChannelGroup } from '../../types/channel';
import { SearchBar } from '../Search/SearchBar';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel?: Channel;
  onChannelSelect: (channel: Channel) => void;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  selectedChannel,
  onChannelSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndGroupedChannels = useMemo(() => {
    const filtered = channels.filter(channel =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((groups: ChannelGroup[], channel) => {
      const group = channel.group || '未分类';
      const existingGroup = groups.find(g => g.name === group);
      
      if (existingGroup) {
        existingGroup.channels.push(channel);
      } else {
        groups.push({ name: group, channels: [channel] });
      }
      
      return groups;
    }, []);
  }, [channels, searchQuery]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900">
      <SearchBar onSearch={setSearchQuery} />
      <div className="flex-1 overflow-y-auto">
        {filteredAndGroupedChannels.map((group) => (
          <div key={group.name} className="mb-4">
            <h3 className="px-4 py-2 text-gray-400 text-sm font-medium">
              {group.name}
            </h3>
            <div className="space-y-1">
              {group.channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel)}
                  className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-800 ${
                    selectedChannel?.id === channel.id ? 'bg-gray-800' : ''
                  }`}
                >
                  <Tv className="w-5 h-5 text-gray-400" />
                  <span className="text-white text-sm truncate">{channel.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
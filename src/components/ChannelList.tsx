import React from 'react';
import { Tv } from 'lucide-react';
import { Channel, ChannelGroup } from '../types/channel';

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
  const groupedChannels = channels.reduce((groups: ChannelGroup[], channel) => {
    const group = channel.group || '未分类';
    const existingGroup = groups.find(g => g.name === group);
    
    if (existingGroup) {
      existingGroup.channels.push(channel);
    } else {
      groups.push({ name: group, channels: [channel] });
    }
    
    return groups;
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-900">
      {groupedChannels.map((group) => (
        <div key={group.name} className="mb-4">
          <h3 className="px-4 py-2 text-gray-400 text-sm font-medium">
            {group.name}
          </h3>
          <div className="space-y-1">
            {group.channels.map((channel) => (
              <button
                key={channel.id}  // Use unique ID as key instead of name
                onClick={() => onChannelSelect(channel)}
                className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-800 ${
                  selectedChannel?.id === channel.id ? 'bg-gray-800' : ''
                }`}
              >
                <Tv className="w-5 h-5 text-gray-400" />
                <span className="text-white text-sm">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
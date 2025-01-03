import { useState, useEffect } from 'react';
import { Channel } from '../types/channel';
import { ChannelService } from '../services/channelService';

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadChannels = async () => {
      try {
        setLoading(true);
        const service = ChannelService.getInstance();
        const channelList = await service.getChannels();
        setChannels(channelList);
      } catch (err) {
        setError('加载频道列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
  }, []);

  return { channels, loading, error };
};
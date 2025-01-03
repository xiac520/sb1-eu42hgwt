import { Channel } from '../types/channel';

export class ChannelService {
  private static instance: ChannelService;
  private channels: Channel[] = [];

  private constructor() {}

  static getInstance(): ChannelService {
    if (!ChannelService.instance) {
      ChannelService.instance = new ChannelService();
    }
    return ChannelService.instance;
  }

  async getChannels(): Promise<Channel[]> {
    try {
      const response = await fetch('/api/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      
      this.channels = await response.json();
      return this.channels;
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      throw error;
    }
  }
}
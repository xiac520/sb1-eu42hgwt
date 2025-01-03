import { Channel } from '../types/channel';

// Use relative path since we're deploying to the same domain
const API_URL = '/api/channels';

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
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      
      this.channels = data;
      return this.channels;
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      return [];
    }
  }
}
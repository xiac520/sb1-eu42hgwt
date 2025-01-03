import { Channel } from '../types/channel';

const API_URL = '/api/channels';
const RETRY_DELAY = 3000; // 3 seconds

export class ChannelService {
  private static instance: ChannelService;
  private channels: Channel[] = [];
  private retryCount = 0;
  private maxRetries = 3;

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
      this.retryCount = 0; // Reset retry count on success
      return this.channels;
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying (${this.retryCount}/${this.maxRetries})...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.getChannels();
      }
      
      throw error;
    }
  }
}
import { ChannelService } from '../services/channelService';
import { CONFIG } from '../config';
import type { Env } from '../types';

export class ApiHandler {
  constructor(private readonly env: Env) {}

  async handleRequest(): Promise<Response> {
    try {
      const cached = await this.env.CHANNELS.get(CONFIG.CACHE_KEY);
      if (cached) {
        return this.createResponse(cached);
      }

      const channelService = new ChannelService(this.env);
      const channels = await channelService.fetchAndCacheChannels();
      return this.createResponse(JSON.stringify(channels));
    } catch (error) {
      return new Response('Failed to fetch channels', { status: 500 });
    }
  }

  private createResponse(body: string): Response {
    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': `public, max-age=${CONFIG.CACHE_TTL}`,
      },
    });
  }
}
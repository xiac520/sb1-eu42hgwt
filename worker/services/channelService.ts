import { parseM3U } from '../../src/utils/m3uParser';
import { CONFIG } from '../config';
import type { Env } from '../types';

export class ChannelService {
  constructor(private readonly env: Env) {}

  async fetchAndCacheChannels() {
    try {
      const channels = await this.fetchIPv6Channels();
      await this.cacheChannels(channels);
      return channels;
    } catch (error) {
      return this.fetchIPv4Channels();
    }
  }

  private async fetchIPv6Channels() {
    const response = await fetch(this.env.IPV6_URL);
    if (!response.ok) throw new Error('IPv6 fetch failed');
    return parseM3U(await response.text());
  }

  private async fetchIPv4Channels() {
    const response = await fetch(this.env.IPV4_URL);
    if (!response.ok) throw new Error('IPv4 fetch failed');
    const channels = parseM3U(await response.text());
    await this.cacheChannels(channels);
    return channels;
  }

  private async cacheChannels(channels: any) {
    await this.env.CHANNELS.put(
      CONFIG.CACHE_KEY,
      JSON.stringify(channels),
      { expirationTtl: CONFIG.CACHE_TTL }
    );
  }
}
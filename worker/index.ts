import { parseM3U } from '../src/utils/m3uParser';

interface Env {
  CACHE_KEY: string;
  IPV6_URL: string;
  IPV4_URL: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    try {
      const ipv6Response = await fetch(env.IPV6_URL);
      const channelList = parseM3U(await ipv6Response.text());
      
      // Store in KV
      await env.CHANNELS.put(env.CACHE_KEY, JSON.stringify(channelList));
    } catch (error) {
      // Fallback to IPv4 if IPv6 fails
      try {
        const ipv4Response = await fetch(env.IPV4_URL);
        const channelList = parseM3U(await ipv4Response.text());
        await env.CHANNELS.put(env.CACHE_KEY, JSON.stringify(channelList));
      } catch (err) {
        console.error('Failed to update channels:', err);
      }
    }
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const channels = await env.CHANNELS.get(env.CACHE_KEY);
    
    return new Response(channels, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
import { parseM3U } from '../../src/utils/m3uParser';

const CACHE_KEY = 'tv_channels_cache';
const IPV6_URL = 'https://live.zbds.top/tv/iptv6.m3u';
const IPV4_URL = 'https://live.zbds.top/tv/iptv4.m3u';

export async function onRequest(context) {
  try {
    // Try to get from cache first
    const cached = await context.env.CHANNELS.get(CACHE_KEY);
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // If not in cache, fetch and store
    const ipv6Response = await fetch(IPV6_URL);
    if (!ipv6Response.ok) {
      throw new Error('IPv6 fetch failed');
    }

    const channelList = parseM3U(await ipv6Response.text());
    await context.env.CHANNELS.put(CACHE_KEY, JSON.stringify(channelList));

    return new Response(JSON.stringify(channelList), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    // Fallback to IPv4
    try {
      const ipv4Response = await fetch(IPV4_URL);
      const channelList = parseM3U(await ipv4Response.text());
      await context.env.CHANNELS.put(CACHE_KEY, JSON.stringify(channelList));

      return new Response(JSON.stringify(channelList), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (err) {
      return new Response('Failed to fetch channels', { status: 500 });
    }
  }
}
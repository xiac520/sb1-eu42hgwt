import { parseM3U } from '../../src/utils/m3uParser';

const IPV6_URL = 'https://live.zbds.top/tv/iptv6.m3u';
const IPV4_URL = 'https://live.zbds.top/tv/iptv4.m3u';
const CACHE_KEY = 'channels';
const CACHE_TTL = 86400; // 24 hours

export async function onRequest(context) {
  const { env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600',
  };

  try {
    // Try to get from cache first
    const cached = await env.CHANNELS.get(CACHE_KEY);
    if (cached) {
      return new Response(cached, { headers });
    }

    // If not in cache, fetch and cache the data
    const channels = await fetchChannels();
    const jsonData = JSON.stringify(channels);
    
    // Cache the results
    await env.CHANNELS.put(CACHE_KEY, jsonData, {
      expirationTtl: CACHE_TTL
    });
    
    return new Response(jsonData, { headers });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch channels' }), 
      { status: 500, headers }
    );
  }
}

async function fetchChannels() {
  // Try IPv6 first
  try {
    const response = await fetch(IPV6_URL);
    if (response.ok) {
      const text = await response.text();
      return parseM3U(text);
    }
  } catch (error) {
    console.error('IPv6 fetch failed:', error);
  }

  // Fallback to IPv4
  const response = await fetch(IPV4_URL);
  if (!response.ok) {
    throw new Error('Both IPv6 and IPv4 fetches failed');
  }

  const text = await response.text();
  return parseM3U(text);
}
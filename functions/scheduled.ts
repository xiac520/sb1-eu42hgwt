interface Env {
  CHANNELS: KVNamespace;
}

const IPV6_URL = 'https://live.zbds.top/tv/iptv6.m3u';
const IPV4_URL = 'https://live.zbds.top/tv/iptv4.m3u';

export const onSchedule: PagesFunction<Env> = async (context) => {
  const { env } = context;

  try {
    // Try IPv6 first
    let response = await fetch(IPV6_URL);
    if (!response.ok) {
      // Fallback to IPv4
      response = await fetch(IPV4_URL);
    }

    if (!response.ok) {
      throw new Error('Failed to fetch channel list');
    }

    const m3u = await response.text();
    const channels = parseM3U(m3u);
    
    // Store in KV with 24h TTL
    await env.CHANNELS.put('channels', JSON.stringify(channels), {
      expirationTtl: 86400 // 24 hours
    });

    return new Response('Channel list updated successfully');
  } catch (error) {
    return new Response('Failed to update channel list', { status: 500 });
  }
}
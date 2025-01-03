import { parseM3U } from '../../src/utils/m3uParser';
import { CONFIG } from '../../worker/config';

export async function onRequest(context) {
  const { env } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600',
  };

  try {
    // Try to get from cache first
    const cached = await env.CHANNELS.get(CONFIG.CACHE_KEY);
    if (cached) {
      return new Response(cached, { headers });
    }

    // If not in cache, fetch from IPv6 first
    const ipv6Response = await fetch(CONFIG.IPV6_URL);
    if (ipv6Response.ok) {
      const channelList = parseM3U(await ipv6Response.text());
      const jsonData = JSON.stringify(channelList);
      
      // Cache the results
      await env.CHANNELS.put(CONFIG.CACHE_KEY, jsonData, {
        expirationTtl: CONFIG.CACHE_TTL
      });
      
      return new Response(jsonData, { headers });
    }

    // Fallback to IPv4
    const ipv4Response = await fetch(CONFIG.IPV4_URL);
    if (!ipv4Response.ok) {
      throw new Error('Both IPv6 and IPv4 fetches failed');
    }

    const channelList = parseM3U(await ipv4Response.text());
    const jsonData = JSON.stringify(channelList);
    
    await env.CHANNELS.put(CONFIG.CACHE_KEY, jsonData, {
      expirationTtl: CONFIG.CACHE_TTL
    });

    return new Response(jsonData, { headers });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch channels' }), 
      { 
        status: 500,
        headers 
      }
    );
  }
}
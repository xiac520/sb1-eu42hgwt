interface Env {
  CHANNELS: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  
  // Only handle /api/channels requests
  if (new URL(request.url).pathname !== '/api/channels') {
    return context.next();
  }

  try {
    // Try to get from KV
    const cached = await env.CHANNELS.get('channels');
    if (cached) {
      return new Response(cached, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    // If not in cache, return empty array with error status
    return new Response(JSON.stringify([]), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch channels' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      // Handle API routes
      return env.ASSETS.fetch(request);
    }
    
    // Serve static assets
    return env.ASSETS.fetch(request);
  }
};


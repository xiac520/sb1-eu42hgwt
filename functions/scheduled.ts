export async function scheduled(event, env, ctx) {
  const response = await fetch('https://your-pages-domain/api/channels');
  if (!response.ok) {
    console.error('Failed to update channels');
  }
}
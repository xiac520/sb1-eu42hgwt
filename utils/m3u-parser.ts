export interface Channel {
  id: string;
  name: string;
  url: string;
  group: string;
  logo?: string;
}

export async function parseTXT(url: string): Promise<Channel[]> {
  const response = await fetch(url)
  const content = await response.text()
  const channels: Channel[] = []

  const lines = content.split('\n')
  for (const line of lines) {
    const [name, url] = line.split(',')
    if (name && url) {
      channels.push({
        id: `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        url: url.trim(),
        group: '未分类', // Default group for TXT format
      })
    }
  }

  return channels
}

export function isValidStreamingUrl(url: string): boolean {
  return url.startsWith('http') || url.startsWith('https') || url.includes('://')
}


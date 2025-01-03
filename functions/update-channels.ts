import { parse } from 'm3u-parser'

interface Env {
  iptv: KVNamespace
}

interface Channel {
  id: string
  name: string
  logo: string
  group: string
  sources: Array<{
    url: string
    name: string
  }>
}

function decodeGBK(text: string): string {
  const decoder = new TextDecoder('gbk')
  const encoder = new TextEncoder()
  return decoder.decode(encoder.encode(text))
}

export const onSchedule: PagesFunction<Env> = async (event, env) => {
  const response = await fetch('http://175.178.251.183:6689/live.m3u')
  const m3uContent = await response.text()

  const playlist = parse(m3uContent)
  const channelsMap = new Map<string, Channel>()

  playlist.forEach((item, index) => {
    const name = decodeGBK(item.name)
    const group = decodeGBK(item.group)
    const logo = item.tvg?.logo || ''

    if (!channelsMap.has(name)) {
      channelsMap.set(name, {
        id: index.toString(),
        name,
        logo,
        group,
        sources: []
      })
    }

    const channel = channelsMap.get(name)!
    const sourceUrl = item.url.replace(/^https?:/, '')
    const sourceName = sourceUrl.split('$')[1] || `线路 ${channel.sources.length + 1}`
    channel.sources.push({ url: sourceUrl, name: decodeGBK(sourceName) })
  })

  const channels = Array.from(channelsMap.values())

  await env.iptv.put('channelList', JSON.stringify(channels))

  return new Response('频道列表更新成功', { status: 200 })
}


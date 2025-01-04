import { NextResponse } from 'next/server'
import { parseTXT } from '@/utils/m3u-parser'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url') || 'https://live.zbds.top/tv/iptv6.txt'

  try {
    const channels = await parseTXT(url)
    return NextResponse.json(channels)
  } catch (error) {
    console.error('获取频道列表失败:', error)
    return NextResponse.json({ error: '获取频道列表失败' }, { status: 500 })
  }
}


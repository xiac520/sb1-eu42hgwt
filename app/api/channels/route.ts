import { NextResponse } from 'next/server'
import { parseTXT } from '@/utils/m3u-parser'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url') || 'https://live.zbds.top/tv/iptv6.txt'

  try {
    const channels = await parseTXT(url)
    return new NextResponse(JSON.stringify(channels), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('获取频道列表失败:', error)
    return new NextResponse(JSON.stringify({ error: '获取频道列表失败' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}


import { NextResponse } from 'next/server'
import { parseM3U } from '@/utils/m3u-parser'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: '未提供URL参数' }, { status: 400 })
  }

  try {
    const channels = await parseM3U(url)
    return NextResponse.json({ count: channels.length })
  } catch (error) {
    console.error('获取频道数量失败:', error)
    return NextResponse.json({ error: '获取频道数量失败' }, { status: 500 })
  }
}


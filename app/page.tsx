import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { ChannelList } from '../components/channel-list'
import { VideoPlayer } from '../components/video-player'
import { EPG } from '../components/epg'

const ChannelSettings = dynamic(() => import('../components/channel-settings'), {
  loading: () => <p>加载中...</p>,
})

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Suspense fallback={<div>加载频道列表...</div>}>
        <ChannelList />
      </Suspense>
      <main className="flex-1 overflow-hidden p-4">
        <Suspense fallback={<div>加载播放器...</div>}>
          <VideoPlayer />
        </Suspense>
        <Suspense fallback={<div>加载节目表...</div>}>
          <EPG />
        </Suspense>
      </main>
    </div>
  )
}


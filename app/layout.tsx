import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '云上世界 - 您的在线IPTV直播平台',
  description: '云上世界为您提供高质量的IPTV直播服务，包括多个频道和节目。随时随地观看您喜爱的电视节目。',
  keywords: 'IPTV, 直播, 电视, 在线观看, 云上世界',
  openGraph: {
    title: '云上世界 - 您的在线IPTV直播平台',
    description: '云上世界为您提供高质量的IPTV直播服务，包括多个频道和节目。随时随地观看您喜爱的电视节目。',
    url: 'https://iptv.dnscron.com',
    siteName: '云上世界',
    locale: 'zh_CN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
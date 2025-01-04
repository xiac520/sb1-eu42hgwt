'use client'

import { useState, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ChannelCounter from './ChannelCounter'
import { categories } from '@/constants/categories'
import { languages } from '@/constants/languages'

interface FilterBarProps {
  onUrlChange: (url: string) => void
}

export default function FilterBar({ onUrlChange }: FilterBarProps) {
  const [type, setType] = useState<'category' | 'language'>('category')
  const [selectedUrl, setSelectedUrl] = useState(categories[0].url)
  const [searchTerm, setSearchTerm] = useState('')
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSelect = (url: string) => {
    setSelectedUrl(url)
    onUrlChange(url)
  }

  const items = type === 'category' ? categories : languages
  const filteredItems = items.filter(item => 
    item.chineseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isMobile = windowWidth < 768

  return (
    <div className="space-y-4 bg-card rounded-lg p-4">
      <Tabs value={type} onValueChange={(value) => setType(value as 'category' | 'language')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="category">按类别</TabsTrigger>
          <TabsTrigger value="language">按语言</TabsTrigger>
        </TabsList>
      </Tabs>
      <Input
        type="search"
        placeholder={`搜索${type === 'category' ? '类别' : '语言'}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      <ScrollArea className={isMobile ? "h-48" : "h-[calc(100vh-200px)]"} >
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
          {filteredItems.map((item) => (
            <Button
              key={item.url}
              variant={selectedUrl === item.url ? 'secondary' : 'ghost'}
              onClick={() => handleSelect(item.url)}
              className="w-full justify-between"
            >
              <span className="truncate">{item.chineseName}</span>
              <ChannelCounter url={item.url} />
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}


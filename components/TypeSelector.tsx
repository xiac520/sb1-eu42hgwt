'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TypeSelectorProps {
  type: 'category' | 'language'
  onTypeChange: (type: 'category' | 'language') => void
}

export default function TypeSelector({ type, onTypeChange }: TypeSelectorProps) {
  return (
    <Tabs value={type} onValueChange={(value) => onTypeChange(value as 'category' | 'language')}>
      <TabsList>
        <TabsTrigger value="category">按类别</TabsTrigger>
        <TabsTrigger value="language">按语言</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}


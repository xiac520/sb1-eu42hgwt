import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface Program {
  id: string
  title: string
  startTime: string
  endTime: string
  description: string
}

interface EPGProps {
  channelId: string
}

export function EPG({ channelId }: EPGProps) {
  const [programs, setPrograms] = useState<Program[]>([])

  useEffect(() => {
    // 这里应该从API获取EPG数据
    // 现在我们只是模拟一些数据
    const mockPrograms: Program[] = [
      {
        id: '1',
        title: '早间新闻',
        startTime: '06:00',
        endTime: '07:00',
        description: '最新早间新闻概览'
      },
      {
        id: '2',
        title: '生活大爆炸',
        startTime: '07:00',
        endTime: '08:00',
        description: '科学天才们的日常生活'
      },
      {
        id: '3',
        title: '美食节目',
        startTime: '08:00',
        endTime: '09:00',
        description: '探索各国美食文化'
      },
    ]
    setPrograms(mockPrograms)
  }, [channelId])

  return (
    <div className="space-y-4">
      {programs.map(program => (
        <Card key={program.id}>
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold">{program.title}</h4>
            <p className="text-sm text-gray-500">{program.startTime} - {program.endTime}</p>
            <p className="mt-2">{program.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


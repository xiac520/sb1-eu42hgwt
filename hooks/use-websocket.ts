import { useEffect, useRef, useState } from 'react'

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    wsRef.current = new WebSocket(url)

    wsRef.current.onopen = () => setIsConnected(true)
    wsRef.current.onclose = () => setIsConnected(false)
    wsRef.current.onmessage = (event) => setLastMessage(JSON.parse(event.data))

    return () => {
      wsRef.current?.close()
    }
  }, [url])

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }

  return { isConnected, lastMessage, sendMessage }
}


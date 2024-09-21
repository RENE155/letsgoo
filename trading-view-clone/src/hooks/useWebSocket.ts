import { useEffect, useRef } from 'react'
import { CandleData } from '@/types'

export function useWebSocket(symbol: string | null, onMessage: (newCandle: CandleData) => void) {
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!symbol) return

    const ws = new WebSocket('wss://stream.bybit.com/v5/public/linear')
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({
        op: 'subscribe',
        args: [`klineV2.1.${symbol}`]
      }))
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.topic === `klineV2.1.${symbol}`) {
        const kline = message.data[0]
        const newCandle = {
          time: parseInt(kline.start) / 1000,
          open: parseFloat(kline.open),
          high: parseFloat(kline.high),
          low: parseFloat(kline.low),
          close: parseFloat(kline.close),
        }
        onMessage(newCandle)
      }
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [symbol, onMessage])
}
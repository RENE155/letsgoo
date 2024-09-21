import { RestClientV5 } from 'bybit-api'

const client = new RestClientV5({
  testnet: true,
  key: 'vLMxOosnpfT5Ga28Rc',
  secret: 'O6lHepfsHMwMj8QzTkekBIPlToJSjj0fHrfF',
})

export const fetchTopGainers = async () => {
  const response = await client.getTickers({ category: 'linear' })
  return response.result.list
    .sort((a: any, b: any) => parseFloat(b.price24hPcnt) - parseFloat(a.price24hPcnt))
    .slice(0, 5)
    .map((coin: any) => ({
      symbol: coin.symbol,
      price: parseFloat(coin.lastPrice),
      change: parseFloat(coin.price24hPcnt) * 100,
    }))
}

export const fetchChartData = async (symbol: string) => {
  const response = await client.getKline({
    category: 'linear',
    symbol,
    interval: '1',
    start: Date.now() - 60 * 60 * 1000,
    end: Date.now(),
  })
  return response.result.list
    .map((candle: any) => ({
      time: (parseInt(candle[0]) / 1000) as number,
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
    }))
    .sort((a: { time: number }, b: { time: number }) => a.time - b.time)
}
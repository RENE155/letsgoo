'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createChart, ColorType, CrosshairMode, LineStyle, IChartApi, ISeriesApi, Time } from 'lightweight-charts'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { ChevronDown, BarChart2, Bell, Rewind, Undo, Redo, Maximize2, Lock } from 'lucide-react'
import { RestClientV5 } from 'bybit-api'

const client = new RestClientV5({
  testnet: true,
  key: 'vLMxOosnpfT5Ga28Rc',
  secret: 'O6lHepfsHMwMj8QzTkekBIPlToJSjj0fHrfF',
})

const ws = new WebSocket('wss://stream.bybit.com/v5/public/linear')

interface CoinData {
  symbol: string
  price: number
  change: number
}

interface CandleData {
  time: Time
  open: number
  high: number
  low: number
  close: number
}

export default function TradingViewClone() {
  const [topGainers, setTopGainers] = useState<CoinData[]>([])
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null)
  const [chartData, setChartData] = useState<CandleData[]>([])
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  useEffect(() => {
    const fetchTopGainers = async () => {
      try {
        const response = await client.getTickers({ category: 'linear' })
        const sortedData = response.result.list
          .sort((a: any, b: any) => parseFloat(b.price24hPcnt) - parseFloat(a.price24hPcnt))
          .slice(0, 5)
          .map((coin: any) => ({
            symbol: coin.symbol,
            price: parseFloat(coin.lastPrice),
            change: parseFloat(coin.price24hPcnt) * 100,
          }))
        setTopGainers(sortedData)
      } catch (error) {
        console.error('Error fetching top gainers:', error)
      }
    }

    fetchTopGainers()
    const interval = setInterval(fetchTopGainers, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchChartData = async () => {
      if (selectedCoin) {
        try {
          const response = await client.getKline({
            category: 'linear',
            symbol: selectedCoin.symbol,
            interval: '1',
            start: Date.now() - 60 * 60 * 1000, // last 1 hour
            end: Date.now(),
          })
          const data = response.result.list
            .map((candle: any) => ({
              time: (parseInt(candle[0]) / 1000) as Time,
              open: parseFloat(candle[1]),
              high: parseFloat(candle[2]),
              low: parseFloat(candle[3]),
              close: parseFloat(candle[4]),
            }))
            .sort((a: { time: Time }, b: { time: Time }) => parseInt(a.time as string) - parseInt(b.time as string)) // Sort data in ascending order by time
          setChartData(data)
        } catch (error) {
          console.error('Error fetching chart data:', error)
        }
      }
    }

    fetchChartData()
    const interval = setInterval(fetchChartData, 5000)

    return () => clearInterval(interval)
  }, [selectedCoin])

  useEffect(() => {
    if (chartContainerRef.current) {
      const handleResize = () => {
        if (chartRef.current) {
          chartRef.current.applyOptions({ width: chartContainerRef.current?.clientWidth })
        }
      }

      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#131722' },
          textColor: '#D9D9D9',
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        rightPriceScale: {
          borderColor: '#2B2B43',
        },
        timeScale: {
          borderColor: '#2B2B43',
          timeVisible: true,
          secondsVisible: false,
        },
      })

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      })

      chartRef.current = chart
      seriesRef.current = candlestickSeries

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chart.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (seriesRef.current && chartData.length > 0) {
      seriesRef.current.setData(chartData)
    }
  }, [chartData])

  useEffect(() => {
    if (selectedCoin) {
      ws.onopen = () => {
        ws.send(JSON.stringify({
          op: 'subscribe',
          args: [`klineV2.1.${selectedCoin.symbol}`]
        }))
      }

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.topic === `klineV2.1.${selectedCoin.symbol}`) {
          const kline = message.data[0]
          const newCandle = {
            time: (parseInt(kline.start) / 1000) as Time,
            open: parseFloat(kline.open),
            high: parseFloat(kline.high),
            low: parseFloat(kline.low),
            close: parseFloat(kline.close),
          }
          setChartData(prevData => [...prevData, newCandle])
        }
      }

      return () => {
        ws.close()
      }
    }
  }, [selectedCoin])

  const handleCoinSelect = (coin: CoinData) => {
    setSelectedCoin(coin)
  }

  return (
    <div className="container mx-auto p-4 bg-[#1E222D] text-white">
      <h1 className="text-2xl font-bold mb-4">TradingView Clone</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1 bg-[#131722] border-gray-700">
          <CardHeader>
            <CardTitle>Top 5 Derivatives Gainers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topGainers.map((coin) => (
                  <TableRow key={coin.symbol} onClick={() => handleCoinSelect(coin)} className="cursor-pointer">
                    <TableCell>{coin.symbol}</TableCell>
                    <TableCell>${coin.price.toFixed(2)}</TableCell>
                    <TableCell className={coin.change >= 0 ? "text-green-500" : "text-red-500"}>
                      {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-2 bg-[#131722] border-gray-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span>{selectedCoin?.symbol}</span>
                <ChevronDown className="w-5 h-5" />
                <span className="text-sm text-gray-400">15m</span>
                <span className="text-sm text-gray-400">BINANCE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm"><BarChart2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm"><Bell className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm">Indicators</Button>
                <Button variant="ghost" size="sm">Alert</Button>
                <Button variant="ghost" size="sm"><Rewind className="w-4 h-4" /></Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold">{selectedCoin?.price.toFixed(2)}</span>
              <span className={`text-lg ${selectedCoin?.change && selectedCoin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {selectedCoin?.change !== undefined ? (selectedCoin.change >= 0 ? '+' : '') + selectedCoin.change.toFixed(2) + '%' : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <span className="text-red-500 mr-1">{(selectedCoin?.price ?? 0 - 0.01).toFixed(2)}</span>
                  SELL
                </Button>
                <Button variant="outline" size="sm">
                  <span className="text-green-500 mr-1">{(selectedCoin?.price ?? 0 + 0.01).toFixed(2)}</span>
                  BUY
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm"><Undo className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm"><Redo className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm"><Maximize2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm"><Lock className="w-4 h-4" /></Button>
              </div>
            </div>
            <div ref={chartContainerRef} className="w-full h-[400px]" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 bg-[#131722] border-gray-700">
        <CardHeader>
          <CardTitle>Deep Analysis of {selectedCoin?.symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This is where you would display a deep analysis of {selectedCoin?.symbol}. In a real application, 
            this could include technical indicators, fundamental analysis, news sentiment, and more. 
            For the purposes of this demo, we're using placeholder text.
          </p>
          <p className="mt-2">
            Current price: ${selectedCoin?.price.toFixed(2)}
          </p>
          <p>
            24h change: {selectedCoin?.change !== undefined ? (selectedCoin.change >= 0 ? '+' : '') + selectedCoin.change.toFixed(2) + '%' : 'N/A'}
          </p>
          <Button className="mt-4">View Full Analysis</Button>
        </CardContent>
      </Card>
    </div>
  )
}
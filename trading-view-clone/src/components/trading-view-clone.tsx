'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table'
import { Button } from "@/components/ui/button"

// Mock data for top gainers
const mockTopGainers = [
  { symbol: 'BTCUSDT', price: 30000, change: 5.2 },
  { symbol: 'ETHUSDT', price: 2000, change: 4.8 },
  { symbol: 'BNBUSDT', price: 300, change: 3.9 },
  { symbol: 'ADAUSDT', price: 0.5, change: 3.5 },
  { symbol: 'DOGEUSDT', price: 0.08, change: 3.2 },
]

// Mock data for chart
const mockChartData = [
  { time: '00:00', price: 29000 },
  { time: '04:00', price: 29500 },
  { time: '08:00', price: 29800 },
  { time: '12:00', price: 30200 },
  { time: '16:00', price: 30100 },
  { time: '20:00', price: 30000 },
]

export default function TradingViewClone() {
  const [selectedCoin, setSelectedCoin] = useState(mockTopGainers[0])
  const [chartData, setChartData] = useState(mockChartData)

  useEffect(() => {
    // In a real application, you would fetch real-time data here
    const interval = setInterval(() => {
      // Simulate data update
      setChartData(prevData => [
        ...prevData.slice(1),
        { time: new Date().toLocaleTimeString(), price: prevData[prevData.length - 1].price + Math.random() * 100 - 50 }
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleCoinSelect = (coin: { symbol: string; price: number; change: number }) => {
    setSelectedCoin(coin)
    // In a real application, you would fetch new data for the selected coin here
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TradingView Clone</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top 5 Gainers</CardTitle>
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
                {mockTopGainers.map((coin) => (
                  <TableRow key={coin.symbol} onClick={() => handleCoinSelect(coin)} className="cursor-pointer">
                    <TableCell>{coin.symbol}</TableCell>
                    <TableCell>${coin.price.toFixed(2)}</TableCell>
                    <TableCell className="text-green-500">+{coin.change}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{selectedCoin.symbol} Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Deep Analysis of {selectedCoin.symbol}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This is where you would display a deep analysis of {selectedCoin.symbol}. In a real application, 
            this could include technical indicators, fundamental analysis, news sentiment, and more. 
            For the purposes of this demo, we're using placeholder text.
          </p>
          <p className="mt-2">
            Current price: ${selectedCoin.price.toFixed(2)}
          </p>
          <p>
            24h change: +{selectedCoin.change}%
          </p>
          <Button className="mt-4">View Full Analysis</Button>
        </CardContent>
      </Card>
    </div>
  )
}
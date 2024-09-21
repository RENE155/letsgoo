'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { ChevronDown, BarChart2, Bell, Rewind, Undo, Redo, Maximize2, Lock } from 'lucide-react'
import { TopGainersTable } from './TopGainersTable'
import { ChartComponent } from './ChartComponent'
import { useSelectedCoin, SelectedCoinProvider } from '../context/SelectedCoinContext'

function TradingViewCloneContent() {
  const { selectedCoin } = useSelectedCoin()

  return (
    <div className="container mx-auto p-4 bg-[#1E222D] text-white">
      <h1 className="text-2xl font-bold mb-4">TradingView Clone</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TopGainersTable />

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
            <ChartComponent />
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
            For the purposes of this demo, we're using placeholder text. testas
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

export default function TradingViewClone() {
  return (
    <SelectedCoinProvider>
      <TradingViewCloneContent />
    </SelectedCoinProvider>
  )
}
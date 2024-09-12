'use client'

import React, { useState, useEffect } from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { RestClientV5 } from 'bybit-api';

const client = new RestClientV5({
  testnet: true,
  key: 'vLMxOosnpfT5Ga28Rc',
  secret: 'O6lHepfsHMwMj8QzTkekBIPlToJSjj0fHrfF',
});

interface CoinData {
  symbol: string;
  price: number;
  change: number;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function TradingViewClone() {
  const [topGainers, setTopGainers] = useState<CoinData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<CandleData[]>([]);

  useEffect(() => {
    const fetchTopGainers = async () => {
      try {
        const response = await client.getTickers({ category: 'linear' });
        const sortedData = response.result.list
          .sort((a: any, b: any) => parseFloat(b.price24hPcnt) - parseFloat(a.price24hPcnt))
          .slice(0, 5)
          .map((coin: any) => ({
            symbol: coin.symbol,
            price: parseFloat(coin.lastPrice),
            change: parseFloat(coin.price24hPcnt) * 100,
          }));
        setTopGainers(sortedData);
        if (!selectedCoin) setSelectedCoin(sortedData[0]);
      } catch (error) {
        console.error('Error fetching top gainers:', error);
      }
    };

    fetchTopGainers();
    const interval = setInterval(fetchTopGainers, 5000);

    return () => clearInterval(interval);
  }, []);

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
          });
          const data = response.result.list.map((candle: any) => ({
            time: new Date(parseInt(candle[0])).toLocaleTimeString(),
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
          }));
          setChartData(data);
        } catch (error) {
          console.error('Error fetching chart data:', error);
        }
      }
    };

    fetchChartData();
    const interval = setInterval(fetchChartData, 5000);

    return () => clearInterval(interval);
  }, [selectedCoin]);

  const handleCoinSelect = (coin: CoinData) => {
    setSelectedCoin(coin);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TradingView Clone</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1">
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

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>{selectedCoin?.symbol} Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="low" fill="#8884d8" />
                <Bar dataKey="high" fill="#82ca9d" />
                <Line type="monotone" dataKey="open" stroke="#ff7300" />
                <Line type="monotone" dataKey="close" stroke="#387908" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
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
  );
}
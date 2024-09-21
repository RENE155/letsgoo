import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useTopGainers } from '../hooks/useTopGainers'
import { useSelectedCoin } from '../context/SelectedCoinContext'
import { CoinData } from '@/types'

export function TopGainersTable() {
  const topGainers = useTopGainers()
  const { setSelectedCoin } = useSelectedCoin()

  const handleCoinSelect = (coin: CoinData) => {
    setSelectedCoin(coin)
  }

  return (
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
            {topGainers.length > 0 ? (
              topGainers.map((coin) => (
                <TableRow key={coin.symbol} onClick={() => handleCoinSelect(coin)} className="cursor-pointer">
                  <TableCell>{coin.symbol}</TableCell>
                  <TableCell>${coin.price.toFixed(2)}</TableCell>
                  <TableCell className={coin.change >= 0 ? "text-green-500" : "text-red-500"}>
                    {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
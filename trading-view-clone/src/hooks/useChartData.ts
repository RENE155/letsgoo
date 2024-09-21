import { useState, useEffect } from 'react'
import { fetchChartData } from '../services/api'
import { CandleData } from '@/types'

export function useChartData(symbol: string | null) {
  const [chartData, setChartData] = useState<CandleData[]>([])

  useEffect(() => {
    if (!symbol) return

    const fetchData = async () => {
      try {
        const data = await fetchChartData(symbol)
        setChartData(data)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [symbol])

  return chartData
}
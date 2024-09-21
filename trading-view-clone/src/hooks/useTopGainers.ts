import { useState, useEffect } from 'react'
import { fetchTopGainers } from '../services/api'
import { CoinData } from '@/types'

export function useTopGainers() {
  const [topGainers, setTopGainers] = useState<CoinData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTopGainers()
        setTopGainers(data)
      } catch (error) {
        console.error('Error fetching top gainers:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)

    return () => clearInterval(interval)
  }, [])

  return topGainers
}
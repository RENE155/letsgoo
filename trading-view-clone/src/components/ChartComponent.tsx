import React, { useEffect, useRef, useCallback } from 'react'
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts'
import { useChartData } from '../hooks/useChartData'
import { useWebSocket } from '../hooks/useWebSocket'
import { useSelectedCoin } from '../context/SelectedCoinContext'
import { CandleData } from '../types'

export function ChartComponent() {
  const { selectedCoin } = useSelectedCoin()
  const chartData = useChartData(selectedCoin?.symbol ?? null)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  const handleNewCandle = useCallback((newCandle: CandleData) => {
    if (seriesRef.current) {
      seriesRef.current.update({
        time: newCandle.time as any,
        open: newCandle.open,
        high: newCandle.high,
        low: newCandle.low,
        close: newCandle.close
      })
    }
  }, [])

  useWebSocket(selectedCoin?.symbol ?? null, handleNewCandle)

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
      seriesRef.current.setData(chartData.map(candle => ({
        ...candle,
        time: candle.time as Time
      })))
    }
  }, [chartData])

  return <div ref={chartContainerRef} className="w-full h-[400px]" />
}
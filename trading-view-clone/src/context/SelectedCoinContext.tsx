import React, { createContext, useState, useContext, ReactNode } from 'react'
import { CoinData } from '@/types'

interface SelectedCoinContextType {
  selectedCoin: CoinData | null
  setSelectedCoin: (coin: CoinData | null) => void
}

const SelectedCoinContext = createContext<SelectedCoinContextType | undefined>(undefined)

export function SelectedCoinProvider({ children }: { children: ReactNode }) {
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null)

  return (
    <SelectedCoinContext.Provider value={{ selectedCoin, setSelectedCoin }}>
      {children}
    </SelectedCoinContext.Provider>
  )
}

export function useSelectedCoin() {
  const context = useContext(SelectedCoinContext)
  if (context === undefined) {
    throw new Error('useSelectedCoin must be used within a SelectedCoinProvider')
  }
  return context
}
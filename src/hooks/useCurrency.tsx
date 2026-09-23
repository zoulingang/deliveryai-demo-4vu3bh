import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Currency } from '@/lib/utils'
import { CurrencyContext, STORAGE_KEY } from '@/hooks/currency-context'

function getInitialCurrency(): Currency {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'CNY' || stored === 'USD') return stored
  } catch {
    // localStorage 不可用时降级为默认 CNY
  }
  return 'CNY'
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(getInitialCurrency)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency)
    } catch {
      // localStorage 不可用时降级为内存态，不报错不阻塞
    }
  }, [currency])

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next)
  }, [])

  const toggle = useCallback(() => {
    setCurrencyState((prev) => (prev === 'CNY' ? 'USD' : 'CNY'))
  }, [])

  const value = useMemo(() => ({ currency, setCurrency, toggle }), [currency, setCurrency, toggle])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

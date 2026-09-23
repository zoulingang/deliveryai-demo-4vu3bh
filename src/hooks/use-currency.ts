import { useContext } from 'react'
import { CurrencyContext, type CurrencyContextValue } from '@/hooks/currency-context'

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return ctx
}

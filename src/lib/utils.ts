import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Currency = 'CNY' | 'USD'

const currencyFormatter: Record<Currency, Intl.NumberFormat> = {
  CNY: new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  USD: new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
}

const currencySymbol: Record<Currency, string> = {
  CNY: '¥',
  USD: '$',
}

/**
 * 格式化金额展示。
 * - CNY（默认）：¥1,234.56
 * - USD：$1,234.56
 * 向后兼容：不传 currency 参数时默认 CNY。
 */
export const money = (value: number, currency: Currency = 'CNY') => {
  return `${currencySymbol[currency]}${currencyFormatter[currency].format(value)}`
}

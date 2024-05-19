import { Currency } from 'mevswap/sdk-core'

export function currencyId(currency: Currency): string | undefined {
  if (currency.isNative) return currency.symbol
  if (currency.isToken) return currency.address
  throw new Error('invalid currency')
}

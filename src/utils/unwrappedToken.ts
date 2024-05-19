import { SupportedChainId } from 'constants/chains'
import { Currency, Token, WETH9 } from 'mevswap/sdk-core'

import { nativeOnChain, WRAPPED_NATIVE_CURRENCY } from '../constants/tokens'
import { supportedChainId } from './supportedChainId'

export function wrappedCurrency(
  currency: Currency | undefined,
  chainId: SupportedChainId | undefined
): Token | undefined {
  return chainId && currency?.isNative ? WETH9[chainId] : currency?.isToken ? currency : undefined
}

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = supportedChainId(currency.chainId)
  if (formattedChainId && WRAPPED_NATIVE_CURRENCY[formattedChainId]?.equals(currency))
    return nativeOnChain(currency.chainId)
  return currency
}

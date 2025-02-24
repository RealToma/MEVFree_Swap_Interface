import { skipToken } from '@reduxjs/toolkit/query/react'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useStablecoinAmountFromFiatValue } from 'hooks/useStablecoinPrice'
import { useRoutingAPIArguments } from 'lib/hooks/routing/useRoutingAPIArguments'
import useIsValidBlock from 'lib/hooks/useIsValidBlock'
import { Currency, CurrencyAmount, TradeType } from 'mevswap/sdk-core'
import ms from 'ms.macro'
import { useMemo } from 'react'
import { useGetQuoteQuery } from 'state/routing/slice'
import { useClientSideRouter, useUserTurboMode } from 'state/user/hooks'

import { GetQuoteResult, InterfaceTrade, TradeState } from './types'
import { computeRoutes, transformRoutesToTrade } from './utils'

export enum RouterPreference {
  CLIENT = 'client',
  API = 'api',
}

/**
 * Returns the best trade by invoking the routing api or the smart order router on the client
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useRoutingAPITrade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  routerPreference?: RouterPreference
): {
  state: TradeState
  trade: InterfaceTrade<Currency, Currency, TTradeType> | undefined
} {
  const [currencyIn, currencyOut]: [Currency | undefined, Currency | undefined] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [amountSpecified, otherCurrency, tradeType]
  )

  const [clientSideRouterStoredPreference] = useClientSideRouter()
  const clientSideRouter = routerPreference
    ? routerPreference === RouterPreference.CLIENT
    : clientSideRouterStoredPreference

  const queryArgs = useRoutingAPIArguments({
    tokenIn: currencyIn,
    tokenOut: currencyOut,
    amount: amountSpecified,
    tradeType,
    useClientSideRouter: clientSideRouter,
  })

  const { chainId } = useWeb3React()

  const [turboMode] = useUserTurboMode()

  let pollTime: number | undefined

  if (turboMode && chainId === SupportedChainId.MAINNET) {
    pollTime = ms`6s`
  } else {
    if (chainId === SupportedChainId.BSC) {
      pollTime = ms`3s`
    } else {
      pollTime = ms`12s`
    }
  }

  const { isLoading, isError, data, currentData } = useGetQuoteQuery(queryArgs ?? skipToken, {
    pollingInterval: pollTime,
    refetchOnFocus: true,
  })

  const quoteResult: GetQuoteResult | undefined = useIsValidBlock(Number(data?.blockNumber) || 0) ? data : undefined

  const route = useMemo(
    () => computeRoutes(currencyIn, currencyOut, tradeType, quoteResult),
    [currencyIn, currencyOut, quoteResult, tradeType]
  )

  // get USD gas cost of trade in active chains stablecoin amount
  const gasUseEstimateUSD = useStablecoinAmountFromFiatValue(quoteResult?.gasUseEstimateUSD) ?? null

  //console.log('queryArgs: ', queryArgs)
  //console.log('data: ', data)
  //console.log('currentData: ', currentData)
  //console.log('quoteResult: ', quoteResult)
  //console.log('route: ', route)
  //console.log('gasUseEstimateUSD: ', gasUseEstimateUSD)

  const isSyncing = currentData !== data

  return useMemo(() => {
    if (!currencyIn || !currencyOut) {
      return {
        state: TradeState.INVALID,
        trade: undefined,
      }
    }

    if (isLoading && !quoteResult) {
      // only on first hook render
      return {
        state: TradeState.LOADING,
        trade: undefined,
      }
    }

    let otherAmount: CurrencyAmount<Currency> | undefined

    if (quoteResult) {
      if (tradeType === TradeType.EXACT_INPUT && currencyOut) {
        otherAmount = CurrencyAmount.fromRawAmount(currencyOut, quoteResult.quote)
      }

      if (tradeType === TradeType.EXACT_OUTPUT && currencyIn) {
        otherAmount = CurrencyAmount.fromRawAmount(currencyIn, quoteResult.quote)
      }
    }

    if (isError || !otherAmount || !route || route.length === 0 || !queryArgs) {
      return {
        state: TradeState.NO_ROUTE_FOUND,
        trade: undefined,
      }
    }

    try {
      const trade = transformRoutesToTrade(route, tradeType, quoteResult?.blockNumber, gasUseEstimateUSD)
      return {
        // always return VALID regardless of isFetching status
        state: isSyncing ? TradeState.SYNCING : TradeState.VALID,
        trade,
      }
    } catch (e) {
      return { state: TradeState.INVALID, trade: undefined }
    }
  }, [
    currencyIn,
    currencyOut,
    quoteResult,
    isLoading,
    tradeType,
    isError,
    route,
    queryArgs,
    gasUseEstimateUSD,
    isSyncing,
  ])
}

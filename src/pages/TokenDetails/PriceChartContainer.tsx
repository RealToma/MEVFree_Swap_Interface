/* eslint-disable react/prop-types */
import { useWeb3React } from '@web3-react/core'
import { checkPairHasDextoolsData, isNativeToken, isUSDToken } from 'components/TradingViewChart/datafeed'
import { useBestTrade } from 'hooks/useBestTrade'
import { HoneypotResponse } from 'hooks/useTokenInfo'
import { Currency, TradeType } from 'mevswap/sdk-core'
import { Trade as V2Trade } from 'mevswap/v2-sdk/entities'
import { useEffect, useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import tryParseAmount from 'utils/tryParseAmount'

import PriceChart from './PriceChart'

type PriceChartContainerProps = {
  inputCurrency: Currency | null | undefined
  outputCurrency: Currency | null | undefined
  nativeInputCurrency: Currency | null | undefined
  nativeOutputCurrency: Currency | null | undefined
  currencies: { [field in Field]?: Currency | null }
  isChartDisplayed: boolean
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  inputTokenHoneypotInfo: HoneypotResponse
  inputTokenHpLoading: boolean
  outputTokenHoneypotInfo: HoneypotResponse
  outputTokenHpLoading: boolean
}

type LegacyPriceChartContainerProps = {
  inputCurrency: Currency | null | undefined
  outputCurrency: Currency | null | undefined
  nativeInputCurrency: Currency | null | undefined
  nativeOutputCurrency: Currency | null | undefined
  currencies: { [field in Field]?: Currency | null }
  v2Trade: V2Trade<Currency, Currency, TradeType> | undefined
  isChartDisplayed: boolean
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  inputTokenHoneypotInfo: HoneypotResponse
  inputTokenHpLoading: boolean
  outputTokenHoneypotInfo: HoneypotResponse
  outputTokenHpLoading: boolean
}

export function PriceChartContainer({
  inputCurrency,
  outputCurrency,
  nativeInputCurrency,
  nativeOutputCurrency,
  currencies,
  isChartDisplayed,
  showInverted,
  setShowInverted,
  inputTokenHoneypotInfo,
  inputTokenHpLoading,
  outputTokenHoneypotInfo,
  outputTokenHpLoading,
}: PriceChartContainerProps) {
  const { chainId } = useWeb3React()

  const [stateProChart, setStateProChart] = useState({
    hasProChart: false,
    pairAddress: '',
    apiVersion: '',
    loading: true,
  })

  const sortedCurrencies: { [field in Field]?: Currency | null } = currencies

  if (isUSDToken(chainId, currencies[0]) && isNativeToken(chainId, currencies[1])) {
    sortedCurrencies[0] = currencies[1]
    sortedCurrencies[1] = currencies[0]
  } else if (isUSDToken(chainId, currencies[1]) && isNativeToken(chainId, currencies[0])) {
    sortedCurrencies[0] = currencies[0]
    sortedCurrencies[1] = currencies[1]
  } else if (isNativeToken(chainId, currencies[0])) {
    sortedCurrencies[0] = currencies[1]
    sortedCurrencies[1] = currencies[0]
  } else if (isUSDToken(chainId, currencies[0])) {
    sortedCurrencies[0] = currencies[1]
    sortedCurrencies[1] = currencies[0]
  }

  useEffect(() => {
    setStateProChart({ hasProChart: false, pairAddress: '', apiVersion: '', loading: true })
    checkPairHasDextoolsData(sortedCurrencies, chainId)
      .then((res: any) => {
        if (res.pairAddress) {
          console.log('pairAddress', res.pairAddress)
          setStateProChart({
            hasProChart: true,
            pairAddress: res.pairAddress,
            apiVersion: '0',
            loading: false,
          })
        } else {
          console.log('no pairAddress', res.pairAddress)
          setStateProChart({ hasProChart: false, pairAddress: '', apiVersion: '', loading: false })
        }
      })
      .catch((error) => {
        console.log(error)
        setStateProChart({ hasProChart: false, pairAddress: '', apiVersion: '', loading: false })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedCurrencies])

  // const checkPairData = useCallback(async () => {
  //   setStateProChart((prevState) => ({ ...prevState, loading: true }))
  //   try {
  //     const { ver, pairAddress } = await checkPairHasDextoolsData(sortedCurrencies, chainId)

  //     if ((ver || ver === 0) && pairAddress) {
  //       setStateProChart({ hasProChart: true, pairAddress, apiVersion: ver.toString(), loading: false })
  //     } else {
  //       setStateProChart({ hasProChart: false, pairAddress: '', apiVersion: '', loading: false })
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     setStateProChart({ hasProChart: false, pairAddress: '', apiVersion: '', loading: false })
  //   }
  // }, [sortedCurrencies, chainId])

  // useMemo(() => {
  //   checkPairData()
  // }, [currencies])

  const currenciesList = useMemo(
    () => [sortedCurrencies.INPUT, sortedCurrencies.OUTPUT],
    [sortedCurrencies.INPUT, sortedCurrencies.OUTPUT]
  )

  if (!isChartDisplayed) {
    return null
  }

  return (
    <PriceChart
      inputCurrency={inputCurrency}
      outputCurrency={outputCurrency}
      nativeInputCurrency={nativeInputCurrency}
      nativeOutputCurrency={nativeOutputCurrency}
      currenciesList={currenciesList}
      stateProChart={stateProChart}
      showInverted={showInverted}
      setShowInverted={setShowInverted}
      inputTokenHoneypotInfo={inputTokenHoneypotInfo}
      inputTokenHpLoading={inputTokenHpLoading}
      outputTokenHoneypotInfo={outputTokenHoneypotInfo}
      outputTokenHpLoading={outputTokenHpLoading}
    />
  )
}

export const LegacyPriceChartContainer: React.FC<React.PropsWithChildren<LegacyPriceChartContainerProps>> = ({
  inputCurrency,
  outputCurrency,
  nativeInputCurrency,
  nativeOutputCurrency,
  currencies,
  v2Trade,
  isChartDisplayed,
  showInverted,
  setShowInverted,
  inputTokenHoneypotInfo,
  inputTokenHpLoading,
  outputTokenHoneypotInfo,
  outputTokenHpLoading,
}) => {
  const { chainId } = useWeb3React()

  const parsedAmount = tryParseAmount('1', inputCurrency ?? undefined)

  const bestTradeExactIn = useBestTrade(TradeType.EXACT_INPUT, parsedAmount, outputCurrency ?? undefined)

  const bestTrade = bestTradeExactIn.trade

  const trade = v2Trade === undefined ? bestTrade : v2Trade

  const [stateProChart, setStateProChart] = useState({
    hasProChart: false,
    pairAddress: '',
    apiVersion: '',
    loading: true,
  })

  const sortedCurrencies: { [field in Field]?: Currency | null } = currencies

  if (isUSDToken(chainId, currencies[0]) && isNativeToken(chainId, currencies[1])) {
    sortedCurrencies[0] = currencies[1]
    sortedCurrencies[1] = currencies[0]
  } else if (isUSDToken(chainId, currencies[1]) && isNativeToken(chainId, currencies[0])) {
    sortedCurrencies[0] = currencies[0]
    sortedCurrencies[1] = currencies[1]
  } else if (isNativeToken(chainId, currencies[0])) {
    sortedCurrencies[0] = currencies[1]
    sortedCurrencies[1] = currencies[0]
  } else if (isUSDToken(chainId, currencies[0])) {
    sortedCurrencies[0] = currencies[1]
    sortedCurrencies[1] = currencies[0]
  }

  useEffect(() => {
    setStateProChart({ hasProChart: false, pairAddress: '', apiVersion: '', loading: true })
    checkPairHasDextoolsData(sortedCurrencies, chainId)
      .then((res: any) => {
        if ((res.ver || res.ver === 0) && res.pairAddress) {
          setStateProChart({ hasProChart: true, pairAddress: res.pairAddress, apiVersion: res.ver, loading: false })
        } else {
          setStateProChart({ hasProChart: false, pairAddress: '', apiVersion: '', loading: false })
        }
      })
      .catch((error) => {
        console.log(error)
        setStateProChart({ hasProChart: false, pairAddress: '', apiVersion: '', loading: false })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sortedCurrencies)])

  const currenciesList = useMemo(
    () => [sortedCurrencies.INPUT, sortedCurrencies.OUTPUT],
    [sortedCurrencies.INPUT, sortedCurrencies.OUTPUT]
  )

  if (!isChartDisplayed) {
    return null
  }

  return (
    <PriceChart
      inputCurrency={inputCurrency}
      outputCurrency={outputCurrency}
      nativeInputCurrency={nativeInputCurrency}
      nativeOutputCurrency={nativeOutputCurrency}
      currenciesList={currenciesList}
      stateProChart={stateProChart}
      showInverted={showInverted}
      setShowInverted={setShowInverted}
      inputTokenHoneypotInfo={inputTokenHoneypotInfo}
      inputTokenHpLoading={inputTokenHpLoading}
      outputTokenHoneypotInfo={outputTokenHoneypotInfo}
      outputTokenHpLoading={outputTokenHpLoading}
    />
  )
}

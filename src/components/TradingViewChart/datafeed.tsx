import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { DAI, nativeOnChain, USDC, USDT, WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { STABLE_COINS_ADDRESS } from 'constants/tokens'
import { Currency, WETH9 } from 'mevswap/sdk-core'
import { PAIR, Pair, SupoprtedRouterType } from 'mevswap/v2-sdk'
import { FeeAmount, Pool } from 'mevswap/v3-sdk'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Field } from 'state/swap/actions'

import {
  ErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SubscribeBarsCallback,
  Timezone,
} from './charting_library'

const configurationData = {
  supported_resolutions: ['1', '3', '5', '15', '30', '1H', '2H', '4H', '1D', '1W', '1M'],
}

const getNetworkString = (chainId: SupportedChainId | undefined) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return 'ethereum'
    case SupportedChainId.BSC:
      return 'bsc'
    case SupportedChainId.DOGECHAIN:
      return 'dogechain'
    case SupportedChainId.POLYGON:
      return 'polygon'
    case SupportedChainId.EVMOS:
      return 'cronos'
    case SupportedChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case SupportedChainId.OPTIMISM:
      return 'optimism'
    case SupportedChainId.PULSECHAIN:
      return 'pulsechain'
    case SupportedChainId.BASE:
      return 'base'
    default:
      return ''
  }
}

const getDexDataString = (chainId: SupportedChainId | undefined) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return 'eth'
    case SupportedChainId.BSC:
      return 'bsc'
    case SupportedChainId.DOGECHAIN:
      return 'dogechain'
    case SupportedChainId.POLYGON:
      return 'polygon'
    case SupportedChainId.EVMOS:
      return 'cronos'
    case SupportedChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case SupportedChainId.OPTIMISM:
      return 'optimism'
    case SupportedChainId.PULSECHAIN:
      return 'pulsechain'
    case SupportedChainId.BASE:
      return 'base'
    default:
      return ''
  }
}

//const CHART_API = 'https://io.dexscreener.com'
const CHART_API = 'https://node.mevfree.com:8888/bars'
const DEXDATA_API = 'https://node.mevfree.com:8888/dexdata'
const GT_API = 'https://node.mevfree.com:8888/gt'
const GT_API_KEY = 'mevfree-udf0FoK4PvJcn62jhUE9IQ'
//const DEXTOOLS_API = 'https://pancake-subgraph-proxy.kyberswap.com/dextools'
//const DEXTOOLS_API = 'https://https//mevfreetest.com:8888/dextools'
const monthTs = 2592000
//const weekTs = 604800
const dayTs = 86400
//const Hours3 = 10800
const hourTs = 3600
const minuteTs = 60

const LOCALSTORAGE_CHECKED_PAIRS = 'proChartCheckedPairs'

const fetcherChart = (url: string) => {
  return fetch(`${GT_API}/${url}`)
    .then((res) => res.json())
    .catch((error) => console.log(error))
}

const fetcherDexData = (url: string) => {
  return fetch(`${GT_API}/${url}`)
    .then((res) => res.json())
    .catch((error) => console.log(error))
}

export const getTradesApi = (dex = 'uniswap', chainId: SupportedChainId | undefined, pairAddress: string) => {
  return fetcherChart(
    `dex/log/amm/${dex}/all/${getNetworkString(chainId)}/${pairAddress}?q=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
  )
}

// const getCandlesApi = (dex, chainId, pairAddress, from, to, res, cb) => {
//   const networkString = getNetworkString(chainId)
//   const queryString = `dex/chart/amm/${dex}/bars/${networkString}/${pairAddress}?from=${from}&to=${to}&res=${res}&cb=${cb}&q0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`

//   return fetcherChart(queryString)
// }

const getCandlesApi = (tokenId, pairId, from, to, res, cb) => {
  const queryString = `candlesticks/${tokenId}/${pairId}?resolution=${res}&from_timestamp=${from}&to_timestamp=${to}&for_update=false&count_back=${cb}&currency=usd&is_inverted=false`

  console.log(queryString)

  return fetcherChart(queryString)
}

export const getDexDataApi = (chainId: SupportedChainId | undefined, pairAddress: string) => {
  return fetcherDexData(`${getDexDataString(chainId)}/pools/${pairAddress}?partner_api_key=${GT_API_KEY}`)
}

export const isNativeToken = (chainId: SupportedChainId | undefined, currency: Currency | undefined) => {
  if (!currency || !chainId) {
    return false
  }
  return currency.isNative || WETH9[chainId].address.toLowerCase() === currency.address.toLowerCase()
}

export const isUSDToken = (chainId: SupportedChainId | undefined, currency: Currency | undefined) => {
  if (isNativeToken(chainId, currency) || !chainId || currency?.isNative) {
    return false
  }
  const usdTokenAddresses = [
    USDT[chainId].address.toLowerCase(),
    USDC[chainId].address.toLowerCase(),
    DAI[chainId].address.toLowerCase(),
    '0xe9e7cea3dedca5984780bafc599bd69add087d56', //BUSD
    '0xcd7509b76281223f5b7d3ad5d47f8d7aa5c2b9bf', //USDV Velas
    '0xdb28719f7f938507dbfe4f0eae55668903d34a15', //USDT_t BTTC
    '0xe887512ab8bc60bcc9224e1c3b5be68e26048b8b', //USDT_e BTTC
    '0x19860ccb0a68fd4213ab9d8266f7bbf05a8dde98', //BUSD.e
    '0x4fbf0429599460d327bd5f55625e30e4fc066095', //TDS on AVAX
    ...STABLE_COINS_ADDRESS[chainId].map((a) => a.toLowerCase()),
  ]

  if (currency?.address && usdTokenAddresses.includes(currency.address.toLowerCase())) {
    return true
  }
  return false
}

const updateLocalstorageCheckedPair = (key: string, res: { ver: number; pairAddress: string }) => {
  const cPstr = localStorage.getItem(LOCALSTORAGE_CHECKED_PAIRS)
  const checkedPairs: { [key: string]: { ver: number; pairAddress: string; time: number } } = cPstr
    ? JSON.parse(cPstr)
    : {}
  checkedPairs[key] = { ...res, time: new Date().getTime() }
  localStorage.setItem(LOCALSTORAGE_CHECKED_PAIRS, JSON.stringify(checkedPairs))
}

export const getPriceData = async (
  currency: Currency | null,
  chainId: SupportedChainId | undefined
): Promise<{ currentPrice: number | null; prevDayPrice: number | null }> => {
  if (!currency) {
    return {
      currentPrice: 0,
      prevDayPrice: 0,
    }
  }

  const tokenA = currency.isNative ? nativeOnChain(chainId || SupportedChainId.MAINNET).wrapped : currency
  const tokenB = nativeOnChain(chainId || SupportedChainId.MAINNET).wrapped
  //const pairAddress = Pair.getAddress(tokenA, tokenB).toLowerCase()

  const ts = Math.floor(Math.floor(new Date().getTime() / 1000))
  const from = ts - hourTs
  const cb = 1

  if (PAIR.ROUTER_TYPE === SupoprtedRouterType.V2 || PAIR.ROUTER_TYPE === SupoprtedRouterType.V2V3) {
    console.log('qwerty')
    const pairAddressv2 = Pair.getAddress(tokenA, tokenB).toLowerCase()
    const { data } = await getDexDataApi(chainId, pairAddressv2)
    if (data) {
      const [barNow, bar24H] = await Promise.all([
        getCandlesApi(data.id, data.relationships.pairs.data[0].id, from, ts, '60', cb),
        getCandlesApi(data.id, data.relationships.pairs.data[0].id, from - dayTs, ts - dayTs, '60', cb),
      ])

      console.log('barNow', barNow)
      console.log('bar24H', bar24H)

      return {
        currentPrice: barNow.data[0]?.c ?? null,
        prevDayPrice: bar24H.data[0]?.c ?? null,
      }
    }
  }

  if (PAIR.ROUTER_TYPE === SupoprtedRouterType.V2V3 || PAIR.ROUTER_TYPE === SupoprtedRouterType.V3) {
    const pairAddressV3Lowest = Pool.getAddress(tokenA, tokenB, FeeAmount.LOWEST)
    const { data: dataV3Lowest } = await getDexDataApi(chainId, pairAddressV3Lowest)
    if (dataV3Lowest) {
      const [barNow, bar24H] = await Promise.all([
        getCandlesApi(dataV3Lowest.id, dataV3Lowest.relationships.pairs.data[0].id, from, ts, '60', cb),
        getCandlesApi(dataV3Lowest.id, dataV3Lowest.relationships.pairs.data[0].id, from - dayTs, ts - dayTs, '60', cb),
      ])

      console.log('barNow', barNow)
      console.log('bar24H', bar24H)

      return {
        currentPrice: barNow.data[0]?.c ?? null,
        prevDayPrice: bar24H.data[0]?.c ?? null,
      }
    }

    const pairAddressV3Low = Pool.getAddress(tokenA, tokenB, FeeAmount.LOW)
    const { data: dataV3Low } = await getDexDataApi(chainId, pairAddressV3Low)
    if (dataV3Low) {
      const [barNow, bar24H] = await Promise.all([
        getCandlesApi(dataV3Low.id, dataV3Low.relationships.pairs.data[0].id, from, ts, '60', cb),
        getCandlesApi(dataV3Low.id, dataV3Low.relationships.pairs.data[0].id, from - dayTs, ts - dayTs, '60', cb),
      ])

      console.log('barNow', barNow)
      console.log('bar24H', bar24H)

      return {
        currentPrice: barNow.data[0]?.c ?? null,
        prevDayPrice: bar24H.data[0]?.c ?? null,
      }
    }

    const pairAddressV3Medium = Pool.getAddress(tokenA, tokenB, FeeAmount.MEDIUM)
    const { data: dataV3Medium } = await getDexDataApi(chainId, pairAddressV3Medium)
    if (dataV3Medium) {
      const [barNow, bar24H] = await Promise.all([
        getCandlesApi(dataV3Medium.id, dataV3Medium.relationships.pairs.data[0].id, from, ts, '60', cb),
        getCandlesApi(dataV3Medium.id, dataV3Medium.relationships.pairs.data[0].id, from - dayTs, ts - dayTs, '60', cb),
      ])

      console.log('barNow', barNow)
      console.log('bar24H', bar24H)

      return {
        currentPrice: barNow.data[0]?.c ?? null,
        prevDayPrice: bar24H.data[0]?.c ?? null,
      }
    }

    const pairAddressV3High = Pool.getAddress(tokenA, tokenB, FeeAmount.HIGH)
    const { data: dataV3High } = await getDexDataApi(chainId, pairAddressV3High)
    if (dataV3High) {
      const [barNow, bar24H] = await Promise.all([
        getCandlesApi(dataV3High.id, dataV3High.relationships.pairs.data[0].id, from, ts, '60', cb),
        getCandlesApi(dataV3High.id, dataV3High.relationships.pairs.data[0].id, from - dayTs, ts - dayTs, '60', cb),
      ])

      console.log('barNow', barNow)
      console.log('bar24H', bar24H)

      return {
        currentPrice: barNow.data[0]?.c ?? null,
        prevDayPrice: bar24H.data[0]?.c ?? null,
      }
    }
  }

  return {
    currentPrice: null,
    prevDayPrice: null,
  }

  // const { data } = await getDexDataApi(chainId, pairAddress)

  // // console.log('dexData', data)
  // // console.log('id', data.id)
  // // console.log('pairs-id', data.relationships.pairs.data[0].id)

  // //data = predataV3.id ? predataV3 : predataV2.id ? predataV2 : null

  // const [barNow, bar24H] = await Promise.all([
  //   getCandlesApi(data.id, data.relationships.pairs.data[0].id, from, ts, '60', cb),
  //   getCandlesApi(data.id, data.relationships.pairs.data[0].id, from - dayTs, ts - dayTs, '60', cb),
  // ])

  // console.log('barNow', barNow)
  // console.log('bar24H', bar24H)

  // return {
  //   currentPrice: barNow.data[0]?.c ?? null,
  //   prevDayPrice: bar24H.data[0]?.c ?? null,
  // }
}

export const checkPairHasDextoolsData = async (
  currencies: { [field in Field]?: Currency | null },
  chainId: SupportedChainId | undefined
): Promise<{ ver: number; pairAddress: string }> => {
  const [currencyA, currencyB] = Object.values(currencies)

  if (!currencyA || !currencyB) {
    return { ver: 0, pairAddress: '' }
  }

  if (
    (isNativeToken(chainId, currencyA) && isNativeToken(chainId, currencyB)) ||
    (isUSDToken(chainId, currencyA) && isUSDToken(chainId, currencyB))
  ) {
    return { ver: 0, pairAddress: '' }
  }

  const checkedPairs = JSON.parse(localStorage.getItem(LOCALSTORAGE_CHECKED_PAIRS) || '{}')
  const symbolA = currencyA.isNative ? nativeOnChain(chainId || SupportedChainId.MAINNET).name : currencyA.symbol
  const symbolB = currencyB.isNative ? nativeOnChain(chainId || SupportedChainId.MAINNET).name : currencyB.symbol
  const key = [symbolA, symbolB, chainId].sort().join('')
  const checkedPair = checkedPairs[key]

  if (checkedPair && checkedPair.ver && checkedPair.pairAddress && checkedPair.time > new Date().getTime() - dayTs) {
    return { ver: checkedPair.ver, pairAddress: checkedPair.pairAddress }
  }

  const tokenA = currencyA.isNative ? nativeOnChain(chainId || SupportedChainId.MAINNET).wrapped : currencyA
  const tokenB = currencyB.isNative ? nativeOnChain(chainId || SupportedChainId.MAINNET).wrapped : currencyB

  if (PAIR.ROUTER_TYPE === SupoprtedRouterType.V2 || PAIR.ROUTER_TYPE === SupoprtedRouterType.V2V3) {
    const pairAddressv2 = Pair.getAddress(tokenA, tokenB).toLowerCase()
    const { data } = await getDexDataApi(chainId, pairAddressv2)
    if (data) {
      const res = { ver: 0, pairAddress: pairAddressv2 }
      updateLocalstorageCheckedPair(key, res)
      return res
    }
  }

  if (PAIR.ROUTER_TYPE === SupoprtedRouterType.V2V3 || PAIR.ROUTER_TYPE === SupoprtedRouterType.V3) {
    const pairAddressV3Lowest = Pool.getAddress(tokenA, tokenB, FeeAmount.LOWEST)
    const { data: dataV3Lowest } = await getDexDataApi(chainId, pairAddressV3Lowest)
    if (dataV3Lowest) {
      const res = { ver: 0, pairAddress: pairAddressV3Lowest }
      updateLocalstorageCheckedPair(key, res)
      return res
    }

    const pairAddressV3Low = Pool.getAddress(tokenA, tokenB, FeeAmount.LOW)
    const { data: dataV3Low } = await getDexDataApi(chainId, pairAddressV3Low)
    if (dataV3Low) {
      const res = { ver: 0, pairAddress: pairAddressV3Low }
      updateLocalstorageCheckedPair(key, res)
      return res
    }

    const pairAddressV3Medium = Pool.getAddress(tokenA, tokenB, FeeAmount.MEDIUM)
    const { data: dataV3Medium } = await getDexDataApi(chainId, pairAddressV3Medium)
    if (dataV3Medium) {
      const res = { ver: 0, pairAddress: pairAddressV3Medium }
      updateLocalstorageCheckedPair(key, res)
      return res
    }

    const pairAddressV3High = Pool.getAddress(tokenA, tokenB, FeeAmount.HIGH)
    const { data: dataV3High } = await getDexDataApi(chainId, pairAddressV3High)
    if (dataV3High) {
      const res = { ver: 0, pairAddress: pairAddressV3High }
      updateLocalstorageCheckedPair(key, res)
      return res
    }
  }

  return { ver: 0, pairAddress: '' }

  // console.log('pairAddressV3Lowest', pairAddressV3Lowest)
  // console.log('pairAddressV3Low', pairAddressV3Low)
  // console.log('pairAddressV3Medium', pairAddressV3Medium)
  // console.log('pairAddressV3High', pairAddressV3High)

  // let { data } = await getDexDataApi(chainId, pairAddress)

  // //console.log('dexData', data)

  // const ts = Math.floor(new Date().getTime())
  // const from = ts - monthTs
  // const cb = 1
  // data = await getCandlesApi(data.id, data.relationships.pairs.data[0].id, from, ts, '60', cb)

  // //console.log('bars', data)

  // const res = { ver: 0, pairAddress: data ? pairAddress : '' }
  // updateLocalstorageCheckedPair(key, res)

  // return res
}

// This function checks if a string is in ISO date format.
function isISODate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)?$/
  return regex.test(dateString)
}

// This function converts an ISO date string to UNIX timestamp.
function isoToUnix(isoDate: string): number {
  return Math.floor(new Date(isoDate).getTime())
}

// Helper function to check if a value is an array
function isArray(value: any): boolean {
  return Array.isArray(value)
}

// Recursive function to traverse and convert the dates in the object
function convertDatesInNestedObject(obj: { [key: string]: any } | any[]): { [key: string]: any } | any[] {
  // Handle the case where obj is an array
  if (isArray(obj)) {
    return obj.map((item) => convertDatesInNestedObject(item))
  }

  const result: { [key: string]: any } = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = convertDatesInNestedObject(obj[key])
      } else if (key === 'time' && typeof obj[key] === 'string' && isISODate(obj[key])) {
        result[key] = isoToUnix(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }

  return result
}

export const useDatafeed = (currencies: Array<Currency | undefined>, pairAddress: string, apiVersion: string) => {
  const { chainId } = useWeb3React()
  const fetchingRef = useRef<boolean>(false)
  const intervalRef = useRef<any>()

  const subscribersMemo = useMemo(() => {
    const subscribers: { [key: string]: any } = {}
    return subscribers
  }, [])

  useEffect(() => {
    const current = intervalRef.current
    return () => {
      if (current) {
        clearInterval(current)
      }
    }
  }, [])

  const getCandles = useCallback(
    async (from: number, ts: number, cb: number, res: number) => {
      let { data } = await getDexDataApi(chainId, pairAddress)

      //console.log('dexData', data)
      data = await getCandlesApi(data.id, data.relationships.pairs.data[0].id, from, ts, res, cb)

      console.log('getCandlesData', data)

      // const labelMapping: Record<string, string> = {
      //   timestamp: 'time',
      //   volumeUsd: 'volume',
      //   open: 'openn',
      //   opennUsd: 'open',
      //   high: 'highh',
      //   highhUsd: 'high',
      //   low: 'loww',
      //   lowwUsd: 'low',
      //   close: 'closee',
      //   closeeUsd: 'close',
      // }

      const labelMapping: Record<string, string> = {
        o: 'open',
        c: 'close',
        h: 'high',
        l: 'low',
        dt: 'time',
        v: 'volume',
        clowose: 'close',
      }

      let stringified = JSON.stringify(data)

      for (const key in labelMapping) {
        const search = key
        const replacement = labelMapping[key]
        const replacer = new RegExp(search, 'g')
        stringified = stringified.replace(replacer, replacement)
      }

      console.log('stringified', stringified)
      console.log('stringifiedJSON', JSON.parse(stringified))

      data = convertDatesInNestedObject(JSON.parse(stringified))

      console.log('getCandlesParsedData', data)

      return data
    },
    [chainId, pairAddress]
  )

  return useMemo(() => {
    return {
      onReady: (callback: any) => {
        setTimeout(() => callback(configurationData))
      },
      resolveSymbol: async (
        symbolName: string,
        onSymbolResolvedCallback: ResolveCallback,
        onResolveErrorCallback: ErrorCallback
      ) => {
        try {
          let label1 = currencies[0]?.isNative
            ? WRAPPED_NATIVE_CURRENCY[chainId as SupportedChainId]?.symbol
            : currencies[0]?.symbol
          let label2 = currencies[1]?.isNative
            ? WRAPPED_NATIVE_CURRENCY[chainId as SupportedChainId]?.symbol
            : currencies[1]?.symbol

          const isUSDToken0 = isUSDToken(chainId, currencies[0])
          const isUSDToken1 = isUSDToken(chainId, currencies[1])
          const isNativeToken0 = isNativeToken(chainId, currencies[0])
          const isNativeToken1 = isNativeToken(chainId, currencies[1])

          if (isUSDToken0 && isNativeToken1) {
            ;[label1, label2] = [label2, label1]
          } else if (isUSDToken1 && isNativeToken0) {
            ;[label1, label2] = [label2, label1]
          } else if (isNativeToken0) {
            ;[label1, label2] = [label2, label1]
          } else if (isUSDToken0) {
            ;[label1, label2] = [label2, label1]
          }

          const label = `${label1}/${label2}`

          const currentTime = Math.floor(Math.floor(new Date().getTime() / 1000))
          const interval = Number(15) * minuteTs
          const from = currentTime - interval
          const cb = 100
          const { data } = await getCandles(from, currentTime, cb, 15)
          console.log('from', from, 'to', currentTime, 'cb', cb, 'res', 15)
          console.log('useMemoData', data)

          const initialPrice = 1 / data[0]?.open
          const priceScaleFactor = data.length > 0 ? Math.ceil(Math.log10(initialPrice)) + 5 : 4
          const pricescale = Math.pow(10, priceScaleFactor)

          const symbolInfo: LibrarySymbolInfo = {
            ticker: label,
            name: label,
            full_name: label,
            listed_exchange: '',
            format: 'price',
            description: label,
            type: 'crypto',
            session: '24x7',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
            exchange: '',
            minmov: 1,
            pricescale,
            has_intraday: true,
            has_empty_bars: true,
            has_weekly_and_monthly: true,
            has_daily: true,
            supported_resolutions: configurationData.supported_resolutions as ResolutionString[],
            data_status: 'streaming',
          }
          onSymbolResolvedCallback(symbolInfo)
        } catch (error) {
          console.log(error)
          onResolveErrorCallback(error)
        }
      },
      getBars: async (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        periodParams: PeriodParams,
        onHistoryCallback: HistoryCallback,
        onErrorCallback: ErrorCallback
      ) => {
        console.log('enteredGetBars')
        if (fetchingRef.current) return

        try {
          const { from, to } = periodParams
          const convertedFrom = from
          const convertedTo = to

          const span = convertedTo - convertedFrom
          const resolutionTime = Number(resolution) * minuteTs
          const spanCb = Math.round(span / resolutionTime)

          fetchingRef.current = true

          const { data } = await getCandles(convertedFrom, convertedTo, spanCb, Number(resolution))
          console.log('periodParams', from, to, span)
          console.log('from', convertedTo - span, 'to', convertedTo, 'cb', spanCb, 'res', Number(resolution))
          console.log('getBarsData', data)

          fetchingRef.current = false

          if (data?.length) {
            onHistoryCallback(data, { noData: false })
          } else {
            onHistoryCallback([], { noData: true })
          }
        } catch (error) {
          console.error('[getBars]: Get error', error)
          onErrorCallback(error as string)
        }
      },
      searchSymbols: () => {
        // TODO(viet-nv): check no empty function rule
      },
      subscribeBars: (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        onRealtimeCallback: SubscribeBarsCallback,
        subscriberUID: string,
        onResetCacheNeededCallback: () => void
      ) => {
        console.log('enteredSubscribeGetBars')

        const cb = 100
        const interval = Number(resolution) * minuteTs * cb
        const intervalId = setInterval(async () => {
          try {
            const currentTime = Math.floor(Math.floor(new Date().getTime() / 1000))

            const { data } = await getCandles(currentTime - interval, currentTime, cb, Number(resolution))

            console.log('from', currentTime - interval, 'to', currentTime, 'cb', cb, 'res', Number(resolution))
            console.log('subscribeBarsData', data)

            if (data?.length) {
              onRealtimeCallback(data[data.length - 1])
            }
          } catch (error) {
            console.log('[subscribeBars]: Get error', error)
          }
        }, interval)

        // Save the intervalId using the subscriberUID, so it can be cleared later in the unsubscribeBars function.
        subscribersMemo[subscriberUID] = intervalId
      },
      unsubscribeBars: (subscriberUID: string) => {
        console.log('[unsubscribeBars]: Method call', subscriberUID)
        const intervalId = subscribersMemo[subscriberUID]

        if (intervalId) {
          clearInterval(intervalId)
          delete subscribersMemo[subscriberUID]
        }
      },
    }
  }, [currencies, chainId, getCandles, subscribersMemo])
}

import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import { SupportedChainId } from 'constants/chains'
import { COINGECKO_API_URL, MEVFREE_HONEYPOT_APT_URL } from 'constants/misc'
import { NETWORKS_INFO } from 'constants/networks'
import { nativeOnChain } from 'constants/tokens'
// eslint-disable-next-line no-restricted-imports
import { BigNumber } from 'ethers'
import { Currency, Token, WETH9 } from 'mevswap/sdk-core'
import { useMemo } from 'react'
import useSWR from 'swr'

export interface TokenInfo {
  price: number
  marketCap: number
  marketCapRank: number
  circulatingSupply: number
  totalSupply: number
  allTimeHigh: number
  allTimeLow: number
  tradingVolume: number
  description: { en: string }
  name: string
}

export interface HoneypotResponse {
  isHoneypot: boolean
  name: string
  symbol: string
  decimals: number
  totalSupply: BigNumber
  age: number
  pairPrice: number
  pairLiquidity: number
  pairMcap: number
  pairAddress: string
  pairBaseTokenAddress: string
  pairBaseTokenSymbol: string
  buyTax: number
  sellTax: number
  buyCost: number
  sellCost: number
  maxTransaction: BigNumber
  maxWallet: BigNumber
  owner: string
  isProxied: boolean
  isVerified: boolean
  isRenounced: boolean
  deployer: string
  socials: { [social: string]: string }[]
  deployerCreations: { [address: string]: string }[]
  hperror: string
  fetched: boolean
}

export function useCurrencyConvertedToNative(currency?: Currency | null): Currency | null | undefined {
  const { chainId } = useWeb3React()
  return useMemo(() => {
    if (!!currency && !!chainId) {
      return currency.isNative ? nativeOnChain(chainId) : currency
    }
    return undefined
  }, [chainId, currency])
}

export default function useTokenInfo(token: Token | undefined): { data: TokenInfo; loading: boolean; error: any } {
  const { chainId } = useWeb3React()

  const fetcher = (url: string) => (url ? fetch(url).then((r) => r.json()) : Promise.reject({ data: {}, error: '' }))

  const tokenAddress = (token?.address || '').toLowerCase()

  let url = ''

  if (tokenAddress === WETH9[chainId as SupportedChainId]?.address.toLowerCase()) {
    // If the token is native token, we have to use different endpoint
    url = `${COINGECKO_API_URL}/coins/${NETWORKS_INFO[chainId || SupportedChainId.MAINNET]}`
  } else if (tokenAddress) {
    url = `${COINGECKO_API_URL}/coins/${NETWORKS_INFO[chainId || SupportedChainId.MAINNET]}/contract/${tokenAddress}`
  }

  const { data, error } = useSWR(url, fetcher, {
    refreshInterval: 300000,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return

      // Only retry up to 10 times.
      if (retryCount >= 10) return

      if (error.status === 403) {
        // If API return 403, retry after 30 seconds.
        setTimeout(() => revalidate({ retryCount }), 30000)
        return
      }

      // Retry after 20 seconds.
      setTimeout(() => revalidate({ retryCount }), 20000)
    },
  })

  if (error && process.env.NODE_ENV === 'development') {
    console.error(error)
  }

  const loading = !data

  const result: TokenInfo = {
    price: data?.market_data?.current_price?.usd || 0,
    marketCap: data?.market_data?.market_cap?.usd || 0,
    marketCapRank: data?.market_data?.market_cap_rank || 0,
    circulatingSupply: data?.market_data?.circulating_supply || 0,
    totalSupply: data?.market_data?.total_supply || 0,
    allTimeHigh: data?.market_data?.ath?.usd || 0,
    allTimeLow: data?.market_data?.atl?.usd || 0,
    tradingVolume: data?.market_data?.total_volume?.usd || 0,
    description: data?.description || { en: '' },
    name: data?.name || '',
  }

  return { data: result, loading, error }
}

export function useHoneyPotInfo(token: Token | undefined): { data: HoneypotResponse; loading: boolean; error: any } {
  const tokenAddress = (token?.address || '').toLowerCase()

  const url = `${MEVFREE_HONEYPOT_APT_URL}${tokenAddress}`
  const bearerToken = `eyJhbGciOiJIUzI1NiJ9.cm9vdA.54z_P6l6Lb5EKsOUqorLkcWHZn4PFgyktN5e-6jGcp0`

  const fetcher = async (url: string) => {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }

  // check once if native, otherwise check every 1 minutes
  const refreshInterval = token?.isNative || token?.wrapped ? 0 : 60000

  const { data, error } = useSWR(url, fetcher, {
    //const { data, error } = useSWR(url, fetcher, {
    refreshInterval,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return

      // Only retry up to 10 times.
      if (retryCount >= 10) return

      if (error.status === 403) {
        // If API return 403, retry after 30 seconds.
        setTimeout(() => revalidate({ retryCount }), 30000)
        return
      }

      // Retry after 20 seconds.
      setTimeout(() => revalidate({ retryCount }), 20000)
    },
  })

  const loading = !data

  console.log('HoneypotResponse: ', data)

  const result: HoneypotResponse = {
    isHoneypot: data?.isHoneypot || false,
    name: data?.name || '',
    symbol: data?.symbol || '',
    decimals: data?.decimals || 0,
    totalSupply: data?.totalSupply || 0,
    age: data?.pair?.age || 0,
    pairPrice: data?.pair?.priceUsd || 0,
    pairLiquidity: data?.pair?.liquidity || 0,
    pairMcap: data?.pair?.fdv || 0,
    pairAddress: data?.pair?.address || '',
    pairBaseTokenAddress: data?.pair?.quoteToken?.address || '',
    pairBaseTokenSymbol: data?.pair?.quoteToken?.symbol || '',
    buyTax: data?.taxes?.buy || 0,
    sellTax: data?.taxes?.sell || 0,
    buyCost: data?.costs?.buy || 0,
    sellCost: data?.costs?.sell || 0,
    maxTransaction: data?.limits?.transaction || 0,
    maxWallet: data?.limits?.wallet || 0,
    owner: data?.owner || '',
    isProxied: data?.isProxied || false,
    isVerified: data?.isVerified || false,
    isRenounced: data?.isRenounced || false,
    deployer: data?.deployer || '',
    socials: data?.socials || [],
    deployerCreations: data?.deployerCreations || [],
    hperror: data?.hperror || '',
    fetched: loading ? false : true,
  }

  return { data: result, loading, error }
}

export function formatSocials(socials: string[]): string {
  const links: any = []

  for (const social of socials) {
    const [name, url] = Object.entries(social)[0]
    const formattedName = name[0].toUpperCase() + name.slice(1)
    links.push(`[${formattedName}](${url})`)
  }

  if (links.length > 0) {
    return '\n\n*Socials:* \n' + links.join(' | ')
  } else {
    return ''
  }
}

export async function computeRatio(value: string, decimals: number, supply: number): Promise<string> {
  const ratio = (Number(value) / 10 ** decimals / (Number(supply) / 10 ** decimals)) * 100
  if (ratio > 100) return ' (100%+)'
  return ' (' + ratio.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 }) + '%)'
}

export function formatRatio(value: string, decimals: number, supply: number): number {
  const ratio = (Number(value) / 10 ** decimals / (Number(supply) / 10 ** decimals)) * 100
  return ratio
}

export function formatAge(age: number): string {
  const days = Math.floor(age / (1000 * 60 * 60 * 24))
  const hours = Math.floor((age % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((age % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((age % (1000 * 60)) / 1000)

  const ago: any = []

  if (days > 0) ago.push(`${days} day` + (days > 1 ? 's' : ''))
  if (hours > 0) ago.push(`${hours} hr` + (hours > 1 ? 's' : ''))
  if (mins > 0 && !days) ago.push(`${mins} min` + (mins > 1 ? 's' : ''))
  if (secs > 0 && !hours && !days) ago.push(`${secs} sec` + (secs > 1 ? 's' : ''))

  return ago.join(' ') + ' ago'
}

export function formatDeployerCreations(creations: string[]): string {
  const creationslist: any = []

  for (const creation of creations) {
    const [name, address] = Object.entries(creation)[0]
    creationslist.push(`[${name}](https://etherscan.io/address/${address})`)
  }

  if (creationslist.length > 0) {
    return "\n\n*Deployer's other tokens:* \n" + creationslist.join(' | ')
  } else {
    return ''
  }
}

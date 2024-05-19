import { useWeb3React } from '@web3-react/core'
import { CHAIN_INFO } from 'constants/chainInfo'
import { L2_CHAIN_IDS, SupportedChainId, SupportedL2ChainId } from 'constants/chains'
import { useCurrencyFromMap, useTokenFromMapOrNetwork } from 'lib/hooks/useCurrency'
import { getTokenFilter } from 'lib/hooks/useTokenList/filtering'
import { Currency, Token } from 'mevswap/sdk-core'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state/hooks'

import { useAllLists, useCombinedActiveList, useInactiveListUrls } from '../state/lists/hooks'
import { WrappedTokenInfo } from '../state/lists/wrappedTokenInfo'
import { useAddUserToken, useUserAddedTokens } from '../state/user/hooks'
import { TokenAddressMap, useUnsupportedTokenList } from './../state/lists/hooks'

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
  const { chainId } = useWeb3React()
  const userAddedTokens = useUserAddedTokens()

  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        newMap[address] = tokenMap[chainId][address].token
        return newMap
      },
      {}
    )

    if (includeUserAdded) {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap, token) => {
              tokenMap[token.address] = token
              return tokenMap
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            { ...mapWithoutUrls }
          )
      )
    }

    return mapWithoutUrls
  }, [chainId, userAddedTokens, tokenMap, includeUserAdded])
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList()
  return useTokensFromMap(allTokens, true)
}

type BridgeInfo = Record<
  SupportedChainId,
  {
    tokenAddress: string
    originBridgeAddress: string
    destBridgeAddress: string
  }
>

export function useUnsupportedTokens(): { [address: string]: Token } {
  const { chainId } = useWeb3React()
  const listsByUrl = useAllLists()
  const unsupportedTokensMap = useUnsupportedTokenList()
  const unsupportedTokens = useTokensFromMap(unsupportedTokensMap, false)

  // checks the default L2 lists to see if `bridgeInfo` has an L1 address value that is unsupported
  const l2InferredBlockedTokens: typeof unsupportedTokens = useMemo(() => {
    if (!chainId || !L2_CHAIN_IDS.includes(chainId)) {
      return {}
    }

    if (!listsByUrl) {
      return {}
    }

    const listUrl = CHAIN_INFO[chainId as SupportedL2ChainId].defaultListUrl
    const { current: list } = listsByUrl[listUrl]
    if (!list) {
      return {}
    }

    const unsupportedSet = new Set(Object.keys(unsupportedTokens))

    return list.tokens.reduce((acc, tokenInfo) => {
      const bridgeInfo = tokenInfo.extensions?.bridgeInfo as unknown as BridgeInfo
      if (
        bridgeInfo &&
        bridgeInfo[SupportedChainId.MAINNET] &&
        bridgeInfo[SupportedChainId.MAINNET].tokenAddress &&
        unsupportedSet.has(bridgeInfo[SupportedChainId.MAINNET].tokenAddress)
      ) {
        const address = bridgeInfo[SupportedChainId.MAINNET].tokenAddress
        // don't rely on decimals--it's possible that a token could be bridged w/ different decimals on the L2
        return { ...acc, [address]: new Token(SupportedChainId.MAINNET, address, tokenInfo.decimals) }
      }
      return acc
    }, {})
  }, [chainId, listsByUrl, unsupportedTokens])

  return { ...unsupportedTokens, ...l2InferredBlockedTokens }
}

export function useSearchInactiveTokenLists(search: string | undefined, minResults = 10): WrappedTokenInfo[] {
  const lists = useAllLists()
  const inactiveUrls = useInactiveListUrls()
  const { chainId } = useWeb3React()
  const activeTokens = useAllTokens()
  return useMemo(() => {
    if (!search || search.trim().length === 0) return []
    const tokenFilter = getTokenFilter(search)
    const result: WrappedTokenInfo[] = []
    const addressSet: { [address: string]: true } = {}
    for (const url of inactiveUrls) {
      const list = lists[url].current
      if (!list) continue
      for (const tokenInfo of list.tokens) {
        if (tokenInfo.chainId === chainId && tokenFilter(tokenInfo)) {
          try {
            const wrapped: WrappedTokenInfo = new WrappedTokenInfo(tokenInfo, list)
            if (!(wrapped.address in activeTokens) && !addressSet[wrapped.address]) {
              addressSet[wrapped.address] = true
              result.push(wrapped)
              if (result.length >= minResults) return result
            }
          } catch {
            continue
          }
        }
      }
    }
    return result
  }, [activeTokens, chainId, inactiveUrls, lists, minResults, search])
}

export function useIsTokenActive(token: Token | undefined | null): boolean {
  const activeTokens = useAllTokens()

  if (!activeTokens || !token) {
    return false
  }

  return !!activeTokens[token.address]
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find((token) => currency.equals(token))
}

// undefined if invalid or does not exist
// null if loading or null was passed
// otherwise returns the token
export function useToken(tokenAddress?: string | null): Token | null | undefined {
  const tokens = useAllTokens()
  return useTokenFromMapOrNetwork(tokens, tokenAddress)
}

export function useCurrency(currencyId?: string | null): Currency | null | undefined {
  const tokens = useAllTokens()
  return useCurrencyFromMap(tokens, currencyId)
}

const getScanString = (chainId: SupportedChainId | undefined) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return 'https://api.etherscan.io/api?module=account&action=tokentx&address='
    case SupportedChainId.BSC:
      return 'https://api.bscscan.com/api?module=account&action=tokentx&address='
    case SupportedChainId.PULSECHAIN:
      return 'https://scan.pulsechain.com/api?module=account&action=tokentx&address='
    case SupportedChainId.BASE:
      return 'https://api.basescan.org/api?module=account&action=tokentx&address='
    default:
      return ''
  }
}

const getScanApiKeyString = (chainId: SupportedChainId | undefined) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return '7BHRSCDSG56ST56F2C5WZS7U4VVS1HWKBG'
    case SupportedChainId.BSC:
      return '79UEBV8PEGV5YMGC8T13EPGHPG1CU6MI3C'
    case SupportedChainId.PULSECHAIN:
      return ''
    case SupportedChainId.BASE:
      return '88AZSAZSUXDQHBYT3ZCFKMPIRMCEEP15AH'
    default:
      return ''
  }
}

export function useUserWalletTokens(setUserWalletTokens) {
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React()
  const addToken = useAddUserToken()

  useEffect(() => {
    async function fetchTokens() {
      if (!account) return

      const requestOptions = {
        method: 'GET',
      }

      try {
        const res = await fetch(
          `${getScanString(chainId)}${account}&apikey=${getScanApiKeyString(chainId)}`,
          requestOptions
        )

        if (!res.ok) {
          console.error('Failed to fetch data:', res.statusText)
          return
        }

        const response = await res.json()

        if (!response || !response.result) return

        const tokens: Token[] = []
        const tokensSet = new Set<string>()
        response.result.forEach((tokenTx) => {
          const tokenAddress = tokenTx.contractAddress
          if (tokensSet.has(tokenAddress)) return
          tokensSet.add(tokenAddress)
          const decimals = parseInt(tokenTx.tokenDecimal)
          const tokenSymbol = tokenTx.tokenSymbol
          const tokenName = tokenTx.tokenName
          if (tokenAddress && tokenName && tokenSymbol) {
            tokens.push(new Token(chainId || 1, tokenAddress, decimals, tokenSymbol, tokenName))
            addToken(new Token(chainId || 1, tokenAddress, decimals, tokenSymbol, tokenName))
          }
        })
        setUserWalletTokens(tokens)
      } catch (error) {
        console.error('Error fetching or parsing data:', error)
      }
    }
    fetchTokens()
  }, [account, addToken, chainId, dispatch, setUserWalletTokens])
}

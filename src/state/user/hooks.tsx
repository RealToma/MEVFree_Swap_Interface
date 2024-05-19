import { useWeb3React } from '@web3-react/core'
import { L2_CHAIN_IDS } from 'constants/chains'
import { SupportedLocale } from 'constants/locales'
import { L2_DEADLINE_FROM_NOW } from 'constants/misc'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import JSBI from 'jsbi'
import { Percent, Token } from 'mevswap/sdk-core'
import { computePairAddress, Pair, ROUTER_ID_TO_NAMES, ROUTER_ID_TO_SYMBOL } from 'mevswap/v2-sdk'
import { PAIR } from 'mevswap/v2-sdk/constants'
import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'

//import { V2_FACTORY_ADDRESSES } from '../../constants/addresses'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from '../../constants/routing'
import { useAllTokens } from '../../hooks/Tokens'
import { AppState } from '../index'
import {
  addSerializedPair,
  addSerializedToken,
  manageTokenHiddenList,
  removeSerializedToken,
  updateHideClosedPositions,
  updateShowDonationLink,
  updateShowSurveyPopup,
  updateUserBoldTheme,
  updateUserClientSideRouter,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserHideZeroBalance,
  updateUserLargeChart,
  updateUserLegacyMode,
  updateUserLocale,
  updateUserShowChart,
  updateUserShowChartOnMobile,
  updateUserShowEditTokenList,
  updateUserShowTickerTape,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
  updateUserTurboMode,
} from './reducer'
import { SerializedPair, SerializedToken } from './types'

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function useUserLocale(): SupportedLocale | null {
  return useAppSelector((state) => state.user.userLocale)
}

export function useUserLocaleManager(): [SupportedLocale | null, (newLocale: SupportedLocale) => void] {
  const dispatch = useAppDispatch()
  const locale = useUserLocale()

  const setLocale = useCallback(
    (newLocale: SupportedLocale) => {
      dispatch(updateUserLocale({ userLocale: newLocale }))
    },
    [dispatch]
  )

  return [locale, setLocale]
}

export function useIsExpertMode(): boolean {
  return useAppSelector((state) => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useShowSurveyPopup(): [boolean | undefined, (showPopup: boolean) => void] {
  const dispatch = useAppDispatch()
  const showSurveyPopup = useAppSelector((state) => state.user.showSurveyPopup)
  const toggleShowSurveyPopup = useCallback(
    (showPopup: boolean) => {
      dispatch(updateShowSurveyPopup({ showSurveyPopup: showPopup }))
    },
    [dispatch]
  )
  return [showSurveyPopup, toggleShowSurveyPopup]
}

const DONATION_END_TIMESTAMP = 1646864954 // Jan 15th

export function useShowDonationLink(): [boolean | undefined, (showDonationLink: boolean) => void] {
  const dispatch = useAppDispatch()
  const showDonationLink = useAppSelector((state) => state.user.showDonationLink)

  const toggleShowDonationLink = useCallback(
    (showPopup: boolean) => {
      dispatch(updateShowDonationLink({ showDonationLink: showPopup }))
    },
    [dispatch]
  )

  const timestamp = useCurrentBlockTimestamp()
  const durationOver = timestamp ? timestamp.toNumber() > DONATION_END_TIMESTAMP : false
  const donationVisible = showDonationLink !== false && !durationOver

  return [donationVisible, toggleShowDonationLink]
}

export function useClientSideRouter(): [boolean, (userClientSideRouter: boolean) => void] {
  const dispatch = useAppDispatch()

  const clientSideRouter = useAppSelector((state) => Boolean(state.user.userClientSideRouter))

  const setClientSideRouter = useCallback(
    (newClientSideRouter: boolean) => {
      dispatch(updateUserClientSideRouter({ userClientSideRouter: newClientSideRouter }))
    },
    [dispatch]
  )

  return [clientSideRouter, setClientSideRouter]
}

export function useSetUserSlippageTolerance(): (slippageTolerance: Percent | 'auto') => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (userSlippageTolerance: Percent | 'auto') => {
      let value: 'auto' | number
      try {
        value =
          userSlippageTolerance === 'auto' ? 'auto' : JSBI.toNumber(userSlippageTolerance.multiply(10_000).quotient)
      } catch (error) {
        value = 'auto'
      }
      dispatch(
        updateUserSlippageTolerance({
          userSlippageTolerance: value,
        })
      )
    },
    [dispatch]
  )
}

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): Percent | 'auto' {
  const userSlippageTolerance = useAppSelector((state) => {
    return state.user.userSlippageTolerance
  })

  return useMemo(
    () => (userSlippageTolerance === 'auto' ? 'auto' : new Percent(userSlippageTolerance, 10_000)),
    [userSlippageTolerance]
  )
}

export function useUserHideClosedPositions(): [boolean, (newHideClosedPositions: boolean) => void] {
  const dispatch = useAppDispatch()

  const hideClosedPositions = useAppSelector((state) => state.user.userHideClosedPositions)

  const setHideClosedPositions = useCallback(
    (newHideClosedPositions: boolean) => {
      dispatch(updateHideClosedPositions({ userHideClosedPositions: newHideClosedPositions }))
    },
    [dispatch]
  )

  return [hideClosedPositions, setHideClosedPositions]
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
  const dispatch = useAppDispatch()

  const singleHopOnly = useAppSelector((state) => state.user.userSingleHopOnly)

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
    },
    [dispatch]
  )

  return [singleHopOnly, setSingleHopOnly]
}

export function useUserTurboMode(): [boolean, (newTurboMode: boolean) => void] {
  const dispatch = useAppDispatch()

  const turboMode = useAppSelector((state) => state.user.userTurboMode)

  const setTurboMode = useCallback(
    (newTurboMode: boolean) => {
      dispatch(updateUserTurboMode({ userTurboMode: newTurboMode }))
    },
    [dispatch]
  )

  return [turboMode, setTurboMode]
}

export function useUserLargeChart(): [boolean, (newLargeChart: boolean) => void] {
  const dispatch = useAppDispatch()

  const largeChart = useAppSelector((state) => state.user.userLargeChart)

  const setLargeChart = useCallback(
    (newLargeChart: boolean) => {
      dispatch(updateUserLargeChart({ userLargeChart: newLargeChart }))
    },
    [dispatch]
  )

  return [largeChart, setLargeChart]
}

export function useUserBoldTheme(): [boolean, (newBoldTheme: boolean) => void] {
  const dispatch = useAppDispatch()

  const boldTheme = useAppSelector((state) => state.user.userBoldTheme)

  const setBoldTheme = useCallback(
    (newBoldTheme: boolean) => {
      dispatch(updateUserBoldTheme({ userBoldTheme: newBoldTheme }))
    },
    [dispatch]
  )

  return [boldTheme, setBoldTheme]
}

export function useUserHideZeroBalance(): [boolean, (newZeroBalance: boolean) => void] {
  const dispatch = useAppDispatch()

  const hideZeroBalance = useAppSelector((state) => state.user.userHideZeroBalance)

  const setZeroBalance = useCallback(
    (newZeroBalance: boolean) => {
      dispatch(updateUserHideZeroBalance({ userHideZeroBalance: newZeroBalance }))
    },
    [dispatch]
  )

  return [hideZeroBalance, setZeroBalance]
}

export function useUserShowEditTokenList(): [boolean, (newValue: boolean) => void] {
  const dispatch = useAppDispatch()

  const showHiddenTokens = useAppSelector((state) => state.user.userShowEditTokenList)

  const setShowHiddenTokens = useCallback(
    (newValue: boolean) => {
      dispatch(updateUserShowEditTokenList({ userShowEditTokenList: newValue }))
    },
    [dispatch]
  )

  return [showHiddenTokens, setShowHiddenTokens]
}

export function useManageTokenHiddenList(): (tokenAddress: string, addToList: boolean) => void {
  const dispatch = useAppDispatch()
  const { chainId } = useWeb3React()

  return useCallback(
    (tokenAddress: string, addToList: boolean) => {
      dispatch(manageTokenHiddenList({ tokenAddress, chainId, addToList }))
    },
    [dispatch, chainId]
  )
}

export function useUserHiddenTokensList(): Set<string> {
  const { chainId } = useWeb3React()
  const userHiddenTokensListChainWise = useAppSelector((state) => state.user.userHiddenTokens)
  return useMemo(() => {
    if (!userHiddenTokensListChainWise || !chainId) return new Set<string>()
    const userHiddenTokensObj = userHiddenTokensListChainWise[chainId]
    if (!userHiddenTokensObj) return new Set<string>()
    const tokensSet = new Set<string>()
    for (const tokenAddress in userHiddenTokensObj) {
      tokensSet.add(tokenAddress)
    }
    return tokensSet
  }, [userHiddenTokensListChainWise, chainId])
}

export function useUserLegacyMode(): [boolean, (newLegacyMode: boolean) => void] {
  const dispatch = useAppDispatch()

  const legacyMode = useAppSelector((state) => state.user.userLegacyMode)

  const setLegacyMode = useCallback(
    (newLegacyMode: boolean) => {
      dispatch(updateUserLegacyMode({ userLegacyMode: newLegacyMode }))
    },
    [dispatch]
  )

  return [legacyMode, setLegacyMode]
}

export function useUserShowTickerTape(): [boolean, (newShowTickerTape: boolean) => void] {
  const dispatch = useAppDispatch()

  const showTickerTape = useAppSelector((state) => state.user.userShowTickerTape)

  const setShowTickerTape = useCallback(
    (newShowTickerTape: boolean) => {
      dispatch(updateUserShowTickerTape({ userShowTickerTape: newShowTickerTape }))
    },
    [dispatch]
  )

  return [showTickerTape, setShowTickerTape]
}

export function useUserShowChartOnMobile(): [boolean, (newShowChartOnMobile: boolean) => void] {
  const dispatch = useAppDispatch()

  const showChartOnMobile = useAppSelector((state) => state.user.userShowChartOnMobile)

  const setShowChartOnMobile = useCallback(
    (newShowChartOnMobile: boolean) => {
      dispatch(updateUserShowChartOnMobile({ userShowChartOnMobile: newShowChartOnMobile }))
    },
    [dispatch]
  )

  return [showChartOnMobile, setShowChartOnMobile]
}

export function useUserShowChart(): [boolean, (newShowChart: boolean) => void] {
  const dispatch = useAppDispatch()

  const showChart = useAppSelector((state) => state.user.userShowChart)

  const setShowChart = useCallback(
    (newShowChart: boolean) => {
      dispatch(updateUserShowChart({ userShowChart: newShowChart }))
    },
    [dispatch]
  )

  return [showChart, setShowChart]
}

/**
 * Same as above but replaces the auto with a default value
 * @param defaultSlippageTolerance the default value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: Percent): Percent {
  const allowedSlippage = useUserSlippageTolerance()
  return useMemo(
    () => (allowedSlippage === 'auto' ? defaultSlippageTolerance : allowedSlippage),
    [allowedSlippage, defaultSlippageTolerance]
  )
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const { chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const userDeadline = useAppSelector((state) => state.user.userDeadline)
  const onL2 = Boolean(chainId && L2_CHAIN_IDS.includes(chainId))
  const deadline = onL2 ? L2_DEADLINE_FROM_NOW : userDeadline

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [deadline, setUserDeadline]
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch]
  )
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useWeb3React()
  const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens)

  return useMemo(() => {
    if (!chainId) return []
    const tokenMap: Token[] = serializedTokensMap?.[chainId]
      ? Object.values(serializedTokensMap[chainId]).map(deserializeToken)
      : []
    return tokenMap
  }, [serializedTokensMap, chainId])
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch]
  )
}

export function useURLWarningVisible(): boolean {
  return useAppSelector((state: AppState) => state.user.URLWarningVisible)
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  if (tokenA.chainId !== tokenB.chainId) throw new Error('Not matching chain IDs')
  if (tokenA.equals(tokenB)) throw new Error('Tokens cannot be equal')
  if (!PAIR.FACTORY) throw new Error('No V2 factory address on this chain')

  return new Token(
    tokenA.chainId,
    computePairAddress({ factoryAddress: PAIR.FACTORY, tokenA, tokenB }),
    //computePairAddress({ factoryAddress: V2_FACTORY_ADDRESSES[tokenA.chainId], tokenA, tokenB }),
    18,
    ROUTER_ID_TO_SYMBOL[PAIR.ROUTERID],
    ROUTER_ID_TO_NAMES[PAIR.ROUTERID]
    //'UNI-V2',
    //'Uniswap V2'
  )
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useWeb3React()
  const tokens = useAllTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? Object.keys(tokens).flatMap((tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base.address === token.address) {
                    return null
                  } else {
                    return [base, token]
                  }
                })
                .filter((p): p is [Token, Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId]
  )

  // pairs saved by users
  const savedSerializedPairs = useAppSelector(({ user: { pairs } }) => pairs)

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs]
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}

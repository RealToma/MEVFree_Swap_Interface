import { createSlice } from '@reduxjs/toolkit'
import { ConnectionType } from 'connection'
import { SupportedLocale } from 'constants/locales'

import { DEFAULT_DEADLINE_FROM_NOW } from '../../constants/misc'
import { updateVersion } from '../global/actions'
import { SerializedPair, SerializedToken } from './types'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // We want the user to be able to define which wallet they want to use, even if there are multiple connected wallets via web3-react.
  // If a user had previously connected a wallet but didn't have a wallet override set (because they connected prior to this field being added),
  // we want to handle that case by backfilling them manually. Once we backfill, we set the backfilled field to `true`.
  // After some period of time, our active users will have this property set so we can likely remove the backfilling logic.
  selectedWalletBackfilled: boolean
  selectedWallet?: ConnectionType

  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userLocale: SupportedLocale | null

  userExpertMode: boolean

  userSingleHopOnly: boolean

  userTurboMode: boolean

  userLargeChart: boolean

  userLegacyMode: boolean

  userBoldTheme: boolean

  userHideZeroBalance: boolean

  userShowEditTokenList: boolean

  userHiddenTokens: {
    [chainId: number]: {
      [tokenAddress: string]: boolean
    }
  }

  userShowTickerTape: boolean

  userShowChart: boolean

  userShowChartOnMobile: boolean

  userExactOutputMode: boolean // exact input vs exact output

  userClientSideRouter: boolean // whether routes should be calculated with the client side router only

  // hides closed (inactive) positions across the app
  userHideClosedPositions: boolean

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number | 'auto'
  userSlippageToleranceHasBeenMigratedToAuto: boolean // temporary flag for migration status

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number
  URLWarningVisible: boolean

  // undefined means has not gone through A/B split yet
  showSurveyPopup: boolean | undefined

  showDonationLink: boolean
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: UserState = {
  selectedWallet: undefined,
  selectedWalletBackfilled: false,
  userExpertMode: false,
  userExactOutputMode: false,
  userLocale: null,
  userClientSideRouter: true,
  userHideClosedPositions: false,
  userSingleHopOnly: false,
  userTurboMode: false,
  userLargeChart: false,
  userLegacyMode: false,
  userShowTickerTape: false,
  userBoldTheme: true,
  userHideZeroBalance: true,
  userShowEditTokenList: false,
  userHiddenTokens: {},
  userShowChart: true,
  userShowChartOnMobile: true,
  userSlippageTolerance: 'auto',
  userSlippageToleranceHasBeenMigratedToAuto: true,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
  URLWarningVisible: true,
  showSurveyPopup: undefined,
  showDonationLink: true,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet
      state.selectedWalletBackfilled = true
    },
    updateUserExpertMode(state, action) {
      state.userExpertMode = action.payload.userExpertMode
      state.timestamp = currentTimestamp()
    },
    updateUserSingleHopOnly(state, action) {
      state.userSingleHopOnly = action.payload.userSingleHopOnly
      state.timestamp = currentTimestamp()
    },
    updateUserTurboMode(state, action) {
      state.userTurboMode = action.payload.userTurboMode
      state.timestamp = currentTimestamp()
    },
    updateUserLargeChart(state, action) {
      state.userLargeChart = action.payload.userLargeChart
      state.timestamp = currentTimestamp()
    },
    updateUserBoldTheme(state, action) {
      state.userBoldTheme = action.payload.userBoldTheme
      state.timestamp = currentTimestamp()
    },
    updateUserHideZeroBalance(state, action) {
      state.userHideZeroBalance = action.payload.userHideZeroBalance
      state.timestamp = currentTimestamp()
    },
    updateUserShowEditTokenList(state, action) {
      state.userShowEditTokenList = action.payload.userShowEditTokenList
      state.timestamp = currentTimestamp()
    },
    manageTokenHiddenList(state, action) {
      const { tokenAddress, chainId, addToList } = action.payload
      const lowercasedTokenAddress = tokenAddress.toLowerCase()

      if (!state.userHiddenTokens) {
        state.userHiddenTokens = {}
      }
      if (!state.userHiddenTokens[chainId]) {
        state.userHiddenTokens[chainId] = {}
      }

      if (addToList) {
        state.userHiddenTokens[chainId][lowercasedTokenAddress] = true
      } else {
        delete state.userHiddenTokens[chainId][lowercasedTokenAddress]
      }

      state.timestamp = currentTimestamp()
    },
    updateUserLegacyMode(state, action) {
      state.userLegacyMode = action.payload.userLegacyMode
      state.timestamp = currentTimestamp()
    },
    updateUserShowTickerTape(state, action) {
      state.userShowTickerTape = action.payload.userShowTickerTape
      state.timestamp = currentTimestamp()
    },
    updateUserShowChart(state, action) {
      state.userShowChart = action.payload.userShowChart
      state.timestamp = currentTimestamp()
    },
    updateUserShowChartOnMobile(state, action) {
      state.userShowChartOnMobile = action.payload.userShowChartOnMobile
      state.timestamp = currentTimestamp()
    },
    updateUserExactOutputMode(state, action) {
      state.userExactOutputMode = action.payload.userExactOutputMode
      state.timestamp = currentTimestamp()
    },
    updateUserLocale(state, action) {
      state.userLocale = action.payload.userLocale
      state.timestamp = currentTimestamp()
    },
    updateUserSlippageTolerance(state, action) {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    },
    updateUserDeadline(state, action) {
      state.userDeadline = action.payload.userDeadline
      state.timestamp = currentTimestamp()
    },
    updateUserClientSideRouter(state, action) {
      state.userClientSideRouter = action.payload.userClientSideRouter
    },
    updateHideClosedPositions(state, action) {
      state.userHideClosedPositions = action.payload.userHideClosedPositions
    },
    updateShowSurveyPopup(state, action) {
      state.showSurveyPopup = action.payload.showSurveyPopup
    },
    updateShowDonationLink(state, action) {
      state.showDonationLink = action.payload.showDonationLink
    },
    addSerializedToken(state, { payload: { serializedToken } }) {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    },
    removeSerializedToken(state, { payload: { address, chainId } }) {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[chainId] = state.tokens[chainId] || {}
      delete state.tokens[chainId][address]
      state.timestamp = currentTimestamp()
    },
    addSerializedPair(state, { payload: { serializedPair } }) {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
      state.timestamp = currentTimestamp()
    },
    removeSerializedPair(state, { payload: { chainId, tokenAAddress, tokenBAddress } }) {
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
        delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
      }
      state.timestamp = currentTimestamp()
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateVersion, (state) => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (
        typeof state.userSlippageTolerance !== 'number' ||
        !Number.isInteger(state.userSlippageTolerance) ||
        state.userSlippageTolerance < 0 ||
        state.userSlippageTolerance > 10000
      ) {
        state.userSlippageTolerance = 'auto'
      } else {
        if (
          !state.userSlippageToleranceHasBeenMigratedToAuto &&
          [10, 50, 100].indexOf(state.userSlippageTolerance) !== -1
        ) {
          state.userSlippageTolerance = 'auto'
          state.userSlippageToleranceHasBeenMigratedToAuto = true
        }
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (
        typeof state.userDeadline !== 'number' ||
        !Number.isInteger(state.userDeadline) ||
        state.userDeadline < 60 ||
        state.userDeadline > 180 * 60
      ) {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
  },
})

export const {
  updateSelectedWallet,
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  updateHideClosedPositions,
  updateUserSingleHopOnly,
  updateUserTurboMode,
  updateUserLargeChart,
  updateUserLegacyMode,
  updateUserBoldTheme,
  updateUserHideZeroBalance,
  updateUserShowTickerTape,
  updateShowDonationLink,
  updateShowSurveyPopup,
  updateUserClientSideRouter,
  updateUserDeadline,
  updateUserExactOutputMode,
  updateUserExpertMode,
  updateUserShowChart,
  updateUserShowEditTokenList,
  manageTokenHiddenList,
  updateUserShowChartOnMobile,
  updateUserLocale,
  updateUserSlippageTolerance,
} = userSlice.actions
export default userSlice.reducer

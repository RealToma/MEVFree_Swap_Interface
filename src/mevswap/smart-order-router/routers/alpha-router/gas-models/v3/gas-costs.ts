import { BigNumber } from '@ethersproject/bignumber'

import { ChainId } from '../../../..'

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = BigNumber.from(0)

//l2 execution fee on optimism is roughly the same as mainnet
export const BASE_SWAP_COST = (id: ChainId): BigNumber => {
  switch (id) {
    case ChainId.MAINNET:
    case ChainId.BASE:
    case ChainId.BSC:
    case ChainId.DOGECHAIN:
    case ChainId.DOGECHAIN_TESTNET:
    case ChainId.PULSECHAIN:
    case ChainId.PULSECHAIN_TESTNET:
    case ChainId.EVMOS:
    case ChainId.ROPSTEN:
    case ChainId.RINKEBY:
    case ChainId.GÖRLI:
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISTIC_KOVAN:
    case ChainId.KOVAN:
      return BigNumber.from(2000)
    case ChainId.ARBITRUM_ONE:
    case ChainId.ARBITRUM_RINKEBY:
      return BigNumber.from(5000)
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
      return BigNumber.from(2000)

    case ChainId.CELO:
    case ChainId.CELO_ALFAJORES:
      return BigNumber.from(2000)

    //TODO determine if sufficient
    case ChainId.GNOSIS:
      return BigNumber.from(2000)
    case ChainId.MOONBEAM:
      return BigNumber.from(2000)
  }
}
export const COST_PER_INIT_TICK = (id: ChainId): BigNumber => {
  switch (id) {
    case ChainId.MAINNET:
    case ChainId.ROPSTEN:
    case ChainId.RINKEBY:
    case ChainId.GÖRLI:
    case ChainId.KOVAN:
    case ChainId.BASE:
    case ChainId.BSC:
    case ChainId.DOGECHAIN:
    case ChainId.DOGECHAIN_TESTNET:
    case ChainId.PULSECHAIN:
    case ChainId.PULSECHAIN_TESTNET:
    case ChainId.EVMOS:
      return BigNumber.from(31000)
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISTIC_KOVAN:
      return BigNumber.from(31000)
    case ChainId.ARBITRUM_ONE:
    case ChainId.ARBITRUM_RINKEBY:
      return BigNumber.from(31000)
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
      return BigNumber.from(31000)
    case ChainId.CELO:
    case ChainId.CELO_ALFAJORES:
      return BigNumber.from(31000)
    case ChainId.GNOSIS:
      return BigNumber.from(31000)
    case ChainId.MOONBEAM:
      return BigNumber.from(31000)
  }
}

export const COST_PER_HOP = (id: ChainId): BigNumber => {
  switch (id) {
    case ChainId.MAINNET:
    case ChainId.ROPSTEN:
    case ChainId.RINKEBY:
    case ChainId.GÖRLI:
    case ChainId.KOVAN:
    case ChainId.BASE:
    case ChainId.BSC:
    case ChainId.DOGECHAIN:
    case ChainId.DOGECHAIN_TESTNET:
    case ChainId.PULSECHAIN:
    case ChainId.PULSECHAIN_TESTNET:
    case ChainId.EVMOS:
    case ChainId.OPTIMISM:
    case ChainId.OPTIMISTIC_KOVAN:
      return BigNumber.from(80000)
    case ChainId.ARBITRUM_ONE:
    case ChainId.ARBITRUM_RINKEBY:
      return BigNumber.from(80000)
    case ChainId.POLYGON:
    case ChainId.POLYGON_MUMBAI:
      return BigNumber.from(80000)
    case ChainId.CELO:
    case ChainId.CELO_ALFAJORES:
      return BigNumber.from(80000)
    case ChainId.GNOSIS:
      return BigNumber.from(80000)
    case ChainId.MOONBEAM:
      return BigNumber.from(80000)
  }
}

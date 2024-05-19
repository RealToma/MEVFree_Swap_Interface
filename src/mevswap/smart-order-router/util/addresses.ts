import { Token } from 'mevswap/sdk-core'
import { PAIR } from 'mevswap/v2-sdk'

import { ChainId, NETWORKS_WITH_SAME_UNISWAP_ADDRESSES } from './chains'

const CELO_V3_CORE_FACTORY_ADDRESSES = '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc'
const CELO_QUOTER_ADDRESSES = '0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8'

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(PAIR.FACTORY_V3),
  [ChainId.CELO]: CELO_V3_CORE_FACTORY_ADDRESSES,
  [ChainId.CELO_ALFAJORES]: CELO_V3_CORE_FACTORY_ADDRESSES,

  // TODO: Gnosis + Moonbeam contracts to be deployed
}

export const QUOTER_V2_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0x61fFE014bA17989E743c5F6cB21bF9697530B21e'),
  [ChainId.CELO]: CELO_QUOTER_ADDRESSES,
  [ChainId.CELO_ALFAJORES]: CELO_QUOTER_ADDRESSES,
  [ChainId.BSC]: CELO_QUOTER_ADDRESSES,

  // TODO: Gnosis + Moonbeam contracts to be deployed
}

export const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]: '0x84E44095eeBfEC7793Cd7d5b57B7e401D7f1cA2E',
  [ChainId.RINKEBY]: '0x84E44095eeBfEC7793Cd7d5b57B7e401D7f1cA2E',
  [ChainId.ROPSTEN]: '0x84E44095eeBfEC7793Cd7d5b57B7e401D7f1cA2E',
  [ChainId.GÖRLI]: '0xBa60b6e6fF25488308789E6e0A65D838be34194e',
}

export const OVM_GASPRICE_ADDRESS = '0x420000000000000000000000000000000000000F'
export const ARB_GASINFO_ADDRESS = '0x000000000000000000000000000000000000006C'

export const TICK_LENS_ADDRESS = '0xbfd8137f7d1516D3ea5cA83523914859ec47F573'
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'
export const SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
export const V3_MIGRATOR_ADDRESS = '0xA5644E29708357803b5A882D272c41cC0dF92B34'
export const MULTICALL2_ADDRESS = '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696'

export type AddressMap = { [chainId: number]: string }

export function constructSameAddressMap<T extends string>(
  address: T,
  additionalNetworks: ChainId[] = []
): { [chainId: number]: T } {
  return NETWORKS_WITH_SAME_UNISWAP_ADDRESSES.concat(additionalNetworks).reduce<{
    [chainId: number]: T
  }>((memo, chainId) => {
    memo[chainId] = address
    return memo
  }, {})
}

export const WETH9: {
  [chainId in Exclude<
    ChainId,
    ChainId.POLYGON | ChainId.POLYGON_MUMBAI | ChainId.CELO | ChainId.CELO_ALFAJORES | ChainId.GNOSIS | ChainId.MOONBEAM
  >]: Token
} = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.BASE]: new Token(ChainId.BASE, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.BSC]: new Token(ChainId.BSC, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
  [ChainId.EVMOS]: new Token(ChainId.EVMOS, '0xc38315264475f2aa4e8ac09e0433ba40705acd9b', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.DOGECHAIN]: new Token(
    ChainId.DOGECHAIN,
    '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101',
    18,
    'WWDOGE',
    'Wrapped Doge'
  ),
  [ChainId.DOGECHAIN_TESTNET]: new Token(
    ChainId.DOGECHAIN_TESTNET,
    '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101',
    18,
    'WWDOGE',
    'Wrapped Doge'
  ),
  [ChainId.PULSECHAIN]: new Token(
    ChainId.PULSECHAIN,
    '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
    18,
    'WPLS',
    'Wrapped Pulse'
  ),
  [ChainId.PULSECHAIN_TESTNET]: new Token(
    ChainId.PULSECHAIN_TESTNET,
    '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
    18,
    'WPLS',
    'Wrapped Pulse'
  ),
  [ChainId.ROPSTEN]: new Token(
    ChainId.ROPSTEN,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.OPTIMISM]: new Token(
    ChainId.OPTIMISM,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.OPTIMISTIC_KOVAN]: new Token(
    ChainId.OPTIMISTIC_KOVAN,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.ARBITRUM_ONE]: new Token(
    ChainId.ARBITRUM_ONE,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [ChainId.ARBITRUM_RINKEBY]: new Token(
    ChainId.ARBITRUM_RINKEBY,
    '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681',
    18,
    'WETH',
    'Wrapped Ether'
  ),
}

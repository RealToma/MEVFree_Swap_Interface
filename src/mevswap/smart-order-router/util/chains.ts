/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Currency, Ether, NativeCurrency, Token } from 'mevswap/sdk-core'

import { WGLMR_MOONBEAM, WXDAI_GNOSIS } from '../providers'
export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  OPTIMISM = 10,
  OPTIMISTIC_KOVAN = 69,
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  POLYGON = 137,
  POLYGON_MUMBAI = 80001,
  CELO = 42220,
  CELO_ALFAJORES = 44787,
  GNOSIS = 100,
  MOONBEAM = 1284,
  BSC = 56,
  EVMOS = 9001,
  DOGECHAIN = 2000,
  DOGECHAIN_TESTNET = 568,
  PULSECHAIN = 369,
  PULSECHAIN_TESTNET = 940,
  BASE = 8453,
}

// WIP: Gnosis, Moonbeam
export const SUPPORTED_CHAINS: ChainId[] = [
  ChainId.MAINNET,
  ChainId.RINKEBY,
  ChainId.ROPSTEN,
  ChainId.KOVAN,
  ChainId.OPTIMISM,
  ChainId.OPTIMISTIC_KOVAN,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_RINKEBY,
  ChainId.POLYGON,
  ChainId.POLYGON_MUMBAI,
  ChainId.GÖRLI,
  ChainId.CELO_ALFAJORES,
  ChainId.CELO,
  ChainId.BSC,
  ChainId.EVMOS,
  ChainId.DOGECHAIN,
  ChainId.DOGECHAIN_TESTNET,
  ChainId.PULSECHAIN,
  ChainId.PULSECHAIN_TESTNET,
  ChainId.BASE,
  // Gnosis and Moonbeam don't yet have contracts deployed yet
]

export const V2_SUPPORTED = [
  ChainId.MAINNET,
  ChainId.KOVAN,
  ChainId.GÖRLI,
  ChainId.RINKEBY,
  ChainId.ROPSTEN,
  ChainId.BSC,
  ChainId.DOGECHAIN,
  ChainId.DOGECHAIN_TESTNET,
  ChainId.PULSECHAIN,
  ChainId.PULSECHAIN_TESTNET,
  ChainId.BASE,
]

export const HAS_L1_FEE = [ChainId.OPTIMISM, ChainId.OPTIMISTIC_KOVAN, ChainId.ARBITRUM_ONE, ChainId.ARBITRUM_RINKEBY]

export const NETWORKS_WITH_SAME_UNISWAP_ADDRESSES = [
  ChainId.MAINNET,
  ChainId.ROPSTEN,
  ChainId.RINKEBY,
  ChainId.GÖRLI,
  ChainId.KOVAN,
  ChainId.OPTIMISM,
  ChainId.OPTIMISTIC_KOVAN,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_RINKEBY,
  ChainId.POLYGON,
  ChainId.POLYGON_MUMBAI,
]

export const ID_TO_CHAIN_ID = (id: number): ChainId => {
  switch (id) {
    case 1:
      return ChainId.MAINNET
    case 3:
      return ChainId.ROPSTEN
    case 4:
      return ChainId.RINKEBY
    case 5:
      return ChainId.GÖRLI
    case 42:
      return ChainId.KOVAN
    case 10:
      return ChainId.OPTIMISM
    case 69:
      return ChainId.OPTIMISTIC_KOVAN
    case 42161:
      return ChainId.ARBITRUM_ONE
    case 421611:
      return ChainId.ARBITRUM_RINKEBY
    case 137:
      return ChainId.POLYGON
    case 80001:
      return ChainId.POLYGON_MUMBAI
    case 42220:
      return ChainId.CELO
    case 44787:
      return ChainId.CELO_ALFAJORES
    case 100:
      return ChainId.GNOSIS
    case 1284:
      return ChainId.MOONBEAM
    case 56:
      return ChainId.BSC
    case 9001:
      return ChainId.EVMOS
    case 2000:
      return ChainId.DOGECHAIN
    case 568:
      return ChainId.DOGECHAIN_TESTNET
    case 369:
      return ChainId.PULSECHAIN
    case 940:
      return ChainId.PULSECHAIN_TESTNET
    case 8453:
      return ChainId.BASE
    default:
      throw new Error(`Unknown chain id: ${id}`)
  }
}

export enum ChainName {
  MAINNET = 'mainnet',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GÖRLI = 'goerli',
  KOVAN = 'kovan',
  OPTIMISM = 'optimism-mainnet',
  OPTIMISTIC_KOVAN = 'optimism-kovan',
  ARBITRUM_ONE = 'arbitrum-mainnet',
  ARBITRUM_RINKEBY = 'arbitrum-rinkeby',
  POLYGON = 'polygon-mainnet',
  POLYGON_MUMBAI = 'polygon-mumbai',
  CELO = 'celo-mainnet',
  CELO_ALFAJORES = 'celo-alfajores',
  GNOSIS = 'gnosis-mainnet',
  MOONBEAM = 'moonbeam-mainnet',
  BSC = 'binance-smart-chain',
  EVMOS = 'evnmos',
  DOGECHAIN = 'dogechain',
  DOGECHAIN_TESTNET = 'dogechain-testnet',
  PULSECHAIN = 'pulsechain',
  PULSECHAIN_TESTNET = 'pulsechain-testnet',
  BASE = 'base',
}

export enum NativeCurrencyName {
  // Strings match input for CLI
  ETHER = 'ETH',
  MATIC = 'MATIC',
  CELO = 'CELO',
  GNOSIS = 'XDAI',
  MOONBEAM = 'GLMR',
  BSC = 'BNB',
  EVMOS = 'EVMOS',
  DOGECHAIN = 'WDOGE',
  PULSECHAIN = 'PLS',
}

export const NATIVE_CURRENCY: { [chainId: number]: NativeCurrencyName } = {
  [ChainId.MAINNET]: NativeCurrencyName.ETHER,
  [ChainId.ROPSTEN]: NativeCurrencyName.ETHER,
  [ChainId.RINKEBY]: NativeCurrencyName.ETHER,
  [ChainId.GÖRLI]: NativeCurrencyName.ETHER,
  [ChainId.KOVAN]: NativeCurrencyName.ETHER,
  [ChainId.OPTIMISM]: NativeCurrencyName.ETHER,
  [ChainId.OPTIMISTIC_KOVAN]: NativeCurrencyName.ETHER,
  [ChainId.ARBITRUM_ONE]: NativeCurrencyName.ETHER,
  [ChainId.ARBITRUM_RINKEBY]: NativeCurrencyName.ETHER,
  [ChainId.POLYGON]: NativeCurrencyName.MATIC,
  [ChainId.POLYGON_MUMBAI]: NativeCurrencyName.MATIC,
  [ChainId.CELO]: NativeCurrencyName.CELO,
  [ChainId.CELO_ALFAJORES]: NativeCurrencyName.CELO,
  [ChainId.GNOSIS]: NativeCurrencyName.GNOSIS,
  [ChainId.MOONBEAM]: NativeCurrencyName.MOONBEAM,
  [ChainId.BSC]: NativeCurrencyName.BSC,
  [ChainId.EVMOS]: NativeCurrencyName.EVMOS,
  [ChainId.DOGECHAIN]: NativeCurrencyName.DOGECHAIN,
  [ChainId.DOGECHAIN_TESTNET]: NativeCurrencyName.DOGECHAIN,
  [ChainId.PULSECHAIN]: NativeCurrencyName.PULSECHAIN,
  [ChainId.PULSECHAIN_TESTNET]: NativeCurrencyName.PULSECHAIN,
  [ChainId.BASE]: NativeCurrencyName.ETHER,
}

export const ID_TO_NETWORK_NAME = (id: number): ChainName => {
  switch (id) {
    case 1:
      return ChainName.MAINNET
    case 3:
      return ChainName.ROPSTEN
    case 4:
      return ChainName.RINKEBY
    case 5:
      return ChainName.GÖRLI
    case 42:
      return ChainName.KOVAN
    case 10:
      return ChainName.OPTIMISM
    case 69:
      return ChainName.OPTIMISTIC_KOVAN
    case 42161:
      return ChainName.ARBITRUM_ONE
    case 421611:
      return ChainName.ARBITRUM_RINKEBY
    case 137:
      return ChainName.POLYGON
    case 80001:
      return ChainName.POLYGON_MUMBAI
    case 42220:
      return ChainName.CELO
    case 44787:
      return ChainName.CELO_ALFAJORES
    case 100:
      return ChainName.GNOSIS
    case 1284:
      return ChainName.MOONBEAM
    case 56:
      return ChainName.BSC
    case 9001:
      return ChainName.EVMOS
    case 2000:
      return ChainName.DOGECHAIN
    case 568:
      return ChainName.DOGECHAIN_TESTNET
    case 369:
      return ChainName.PULSECHAIN
    case 940:
      return ChainName.PULSECHAIN_TESTNET
    case 8453:
      return ChainName.BASE
    default:
      throw new Error(`Unknown chain id: ${id}`)
  }
}

export const CHAIN_IDS_LIST = Object.values(ChainId).map((c) => c.toString()) as string[]

export const ID_TO_PROVIDER = (id: ChainId): string => {
  switch (id) {
    case ChainId.MAINNET:
      return process.env.JSON_RPC_PROVIDER!
    case ChainId.ROPSTEN:
      return process.env.JSON_RPC_PROVIDER_ROPSTEN!
    case ChainId.RINKEBY:
      return process.env.JSON_RPC_PROVIDER_RINKEBY!
    case ChainId.GÖRLI:
      return process.env.JSON_RPC_PROVIDER_GORLI!
    case ChainId.KOVAN:
      return process.env.JSON_RPC_PROVIDER_KOVAN!
    case ChainId.OPTIMISM:
      return process.env.JSON_RPC_PROVIDER_OPTIMISM!
    case ChainId.OPTIMISTIC_KOVAN:
      return process.env.JSON_RPC_PROVIDER_OPTIMISTIC_KOVAN!
    case ChainId.ARBITRUM_ONE:
      return process.env.JSON_RPC_PROVIDER_ARBITRUM_ONE!
    case ChainId.ARBITRUM_RINKEBY:
      return process.env.JSON_RPC_PROVIDER_ARBITRUM_RINKEBY!
    case ChainId.POLYGON:
      return process.env.JSON_RPC_PROVIDER_POLYGON!
    case ChainId.POLYGON_MUMBAI:
      return process.env.JSON_RPC_PROVIDER_POLYGON_MUMBAI!
    case ChainId.CELO:
      return process.env.JSON_RPC_PROVIDER_CELO!
    case ChainId.CELO_ALFAJORES:
      return process.env.JSON_RPC_PROVIDER_CELO_ALFAJORES!
    case ChainId.DOGECHAIN:
      return process.env.JSON_RPC_PROVIDER_DOGECHAIN!
    case ChainId.DOGECHAIN_TESTNET:
      return process.env.JSON_RPC_PROVIDER_DOGECHAIN_TESTNET!
    case ChainId.PULSECHAIN:
      return process.env.JSON_RPC_PROVIDER_PULSECHAIN!
    case ChainId.PULSECHAIN_TESTNET:
      return process.env.JSON_RPC_PROVIDER_PULSECHAIN_TESTNET!
    default:
      throw new Error(`Chain id: ${id} not supported`)
  }
}

export const WRAPPED_NATIVE_CURRENCY: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.ROPSTEN]: new Token(3, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.RINKEBY]: new Token(4, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.GÖRLI]: new Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.KOVAN]: new Token(42, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.BSC]: new Token(56, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
  [ChainId.EVMOS]: new Token(9001, '0xc38315264475f2aa4e8ac09e0433ba40705acd9b', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.DOGECHAIN]: new Token(2000, '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101', 18, 'WWDoge', 'Wrapped Doge'),
  [ChainId.DOGECHAIN_TESTNET]: new Token(
    568,
    '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101',
    18,
    'WWDoge',
    'Wrapped Doge'
  ),
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
  [ChainId.POLYGON]: new Token(
    ChainId.POLYGON,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped MATIC'
  ),
  [ChainId.POLYGON_MUMBAI]: new Token(
    ChainId.POLYGON_MUMBAI,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped MATIC'
  ),

  // The Celo native currency 'CELO' implements the erc-20 token standard
  [ChainId.CELO]: new Token(
    ChainId.CELO,
    '0x471EcE3750Da237f93B8E339c536989b8978a438',
    18,
    'CELO',
    'Celo native asset'
  ),
  [ChainId.CELO_ALFAJORES]: new Token(
    ChainId.CELO_ALFAJORES,
    '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    18,
    'CELO',
    'Celo native asset'
  ),
  [ChainId.GNOSIS]: WXDAI_GNOSIS,
  [ChainId.MOONBEAM]: WGLMR_MOONBEAM,
  [ChainId.PULSECHAIN]: new Token(369, '0xA1077a294dDE1B09bB078844df40758a5D0f9a27', 18, 'WPLS', 'Wrapped Pulse'),
  [ChainId.PULSECHAIN_TESTNET]: new Token(
    940,
    '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
    18,
    'WPLS',
    'Wrapped Pulse'
  ),
  [ChainId.BASE]: new Token(ChainId.BASE, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
}

function isMatic(chainId: number): chainId is ChainId.POLYGON | ChainId.POLYGON_MUMBAI {
  return chainId === ChainId.POLYGON_MUMBAI || chainId === ChainId.POLYGON
}

class MaticNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isMatic(this.chainId)) throw new Error('Not matic')
    const nativeCurrency = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (nativeCurrency) {
      return nativeCurrency
    }
    throw new Error(`Does not support this chain ${this.chainId}`)
  }

  public constructor(chainId: number) {
    if (!isMatic(chainId)) throw new Error('Not matic')
    super(chainId, 18, 'MATIC', 'Polygon Matic')
  }
}

function isCelo(chainId: number): chainId is ChainId.CELO | ChainId.CELO_ALFAJORES {
  return chainId === ChainId.CELO_ALFAJORES || chainId === ChainId.CELO
}

class CeloNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isCelo(this.chainId)) throw new Error('Not celo')
    const nativeCurrency = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (nativeCurrency) {
      return nativeCurrency
    }
    throw new Error(`Does not support this chain ${this.chainId}`)
  }

  public constructor(chainId: number) {
    if (!isCelo(chainId)) throw new Error('Not celo')
    super(chainId, 18, 'CELO', 'Celo')
  }
}

function isGnosis(chainId: number): chainId is ChainId.GNOSIS {
  return chainId === ChainId.GNOSIS
}

class GnosisNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isGnosis(this.chainId)) throw new Error('Not gnosis')
    const nativeCurrency = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (nativeCurrency) {
      return nativeCurrency
    }
    throw new Error(`Does not support this chain ${this.chainId}`)
  }

  public constructor(chainId: number) {
    if (!isGnosis(chainId)) throw new Error('Not gnosis')
    super(chainId, 18, 'XDAI', 'xDai')
  }
}

function isMoonbeam(chainId: number): chainId is ChainId.MOONBEAM {
  return chainId === ChainId.MOONBEAM
}

class MoonbeamNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isMoonbeam(this.chainId)) throw new Error('Not moonbeam')
    const nativeCurrency = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (nativeCurrency) {
      return nativeCurrency
    }
    throw new Error(`Does not support this chain ${this.chainId}`)
  }

  public constructor(chainId: number) {
    if (!isMoonbeam(chainId)) throw new Error('Not moonbeam')
    super(chainId, 18, 'GLMR', 'Glimmer')
  }
}

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WRAPPED_NATIVE_CURRENCY) return WRAPPED_NATIVE_CURRENCY[this.chainId as ChainId]
    throw new Error('Unsupported chain ID')
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency } = {}
export function nativeOnChain(chainId: number): NativeCurrency {
  if (cachedNativeCurrency[chainId] !== undefined) return cachedNativeCurrency[chainId]
  if (isMatic(chainId)) cachedNativeCurrency[chainId] = new MaticNativeCurrency(chainId)
  else if (isCelo(chainId)) cachedNativeCurrency[chainId] = new CeloNativeCurrency(chainId)
  else if (isGnosis(chainId)) cachedNativeCurrency[chainId] = new GnosisNativeCurrency(chainId)
  else if (isMoonbeam(chainId)) cachedNativeCurrency[chainId] = new MoonbeamNativeCurrency(chainId)
  else cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId)

  return cachedNativeCurrency[chainId]
}

import invariant from 'tiny-invariant'

import { Currency } from './currency'
import { NativeCurrency } from './nativeCurrency'
import { Token } from './token'
import { WETH9 } from './weth9'

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Ether extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'ETH', 'Ether')
  }

  public get wrapped(): Token {
    const weth9 = WETH9[this.chainId]
    invariant(!!weth9, 'WRAPPED')
    return weth9
  }

  private static _etherCache: { [chainId: number]: Ether } = {}

  public static onChain(chainId: number): Ether {
    return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Ether(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

export class BNB extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'BNB', 'Binance Coin')
  }

  public get wrapped(): Token {
    const weth9 = WETH9[this.chainId]
    invariant(!!weth9, 'WRAPPED')
    return weth9
  }

  private static _bnbCache: { [chainId: number]: Ether } = {}

  public static onChain(chainId: number): BNB {
    return this._bnbCache[chainId] ?? (this._bnbCache[chainId] = new BNB(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

export class PLS extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'PLS', 'Pulse')
  }

  public get wrapped(): Token {
    const weth9 = WETH9[this.chainId]
    invariant(!!weth9, 'WRAPPED')
    return weth9
  }

  private static _plsCache: { [chainId: number]: PLS } = {}

  public static onChain(chainId: number): PLS {
    return this._plsCache[chainId] ?? (this._plsCache[chainId] = new PLS(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

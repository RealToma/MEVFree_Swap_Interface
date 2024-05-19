import { Token } from './token'

/**
 * Known WETH9 implementation addresses, used in our implementation of Ether#wrapped
 */
export const WETH9: { [chainId: number]: Token } = {
  1: new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'),
  3: new Token(3, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'),
  4: new Token(4, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped Ether'),
  5: new Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 18, 'WETH', 'Wrapped Ether'),
  42: new Token(42, '0xd0A1E359811322d97991E03f863a0C30C2cF029C', 18, 'WETH', 'Wrapped Ether'),

  10: new Token(10, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
  56: new Token(69, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
  69: new Token(69, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),

  568: new Token(568, '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101', 18, 'WWDOGE', 'Wrapped Doge'),
  2000: new Token(2000, '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101', 18, 'WWDOGE', 'Wrapped Doge'),

  9001: new Token(9001, '0xD4949664cD82660AaE99bEdc034a0deA8A0bd517', 18, 'WEVMOS', 'Wrapped EVMOS'),

  42161: new Token(42161, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
  421611: new Token(421611, '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681', 18, 'WETH', 'Wrapped Ether'),

  369: new Token(369, '0xA1077a294dDE1B09bB078844df40758a5D0f9a27', 18, 'WPLS', 'Wrapped Pulse'),
  940: new Token(940, '0xA1077a294dDE1B09bB078844df40758a5D0f9a27', 18, 'WPLS', 'Wrapped Pulse'),

  8543: new Token(8543, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
}

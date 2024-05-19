import { BNB, Currency, Ether, NativeCurrency, PLS, Token, WETH9 } from 'mevswap/sdk-core'
import invariant from 'tiny-invariant'

import { UNI_ADDRESS } from './addresses'
import { SupportedChainId } from './chains'

export const MEVFREE_MAINNET = new Token(
  SupportedChainId.MAINNET,
  '0x1936c91190e901b7dd55229a574ae22b58ff498a',
  18,
  'MEVFree',
  'MEVFree'
)

export const USDC_MAINNET = new Token(
  SupportedChainId.MAINNET,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)
export const USDC_DOGECHAIN = new Token(
  SupportedChainId.DOGECHAIN,
  '0x765277EebeCA2e31912C9946eAe1021199B39C61',
  6,
  'USDC',
  'USD//C'
)
export const USDC_DOGECHAINTESTNET = new Token(
  SupportedChainId.DOGECHAIN,
  '0x765277EebeCA2e31912C9946eAe1021199B39C61',
  6,
  'USDC',
  'USD//C'
)
export const USDC_EVMOS = new Token(
  SupportedChainId.EVMOS,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  6,
  'USDC',
  'USD//C'
)
export const USDC_ROPSTEN = new Token(
  SupportedChainId.ROPSTEN,
  '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  6,
  'USDC',
  'USD//C'
)
export const USDC_RINKEBY = new Token(
  SupportedChainId.RINKEBY,
  '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
  6,
  'tUSDC',
  'test USD//C'
)
export const USDC_GOERLI = new Token(
  SupportedChainId.GOERLI,
  '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  6,
  'USDC',
  'USD//C'
)
export const USDC_KOVAN = new Token(
  SupportedChainId.KOVAN,
  '0x31eeb2d0f9b6fd8642914ab10f4dd473677d80df',
  6,
  'USDC',
  'USD//C'
)
export const USDC_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
  6,
  'USDC',
  'USD//C'
)
export const USDC_OPTIMISTIC_KOVAN = new Token(
  SupportedChainId.OPTIMISTIC_KOVAN,
  '0x3b8e53b3ab8e01fb57d0c9e893bc4d655aa67d84',
  6,
  'USDC',
  'USD//C'
)
export const USDC_ARBITRUM = new Token(
  SupportedChainId.ARBITRUM_ONE,
  '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  6,
  'USDC',
  'USD//C'
)
export const USDC_ARBITRUM_RINKEBY = new Token(
  SupportedChainId.ARBITRUM_RINKEBY,
  '0x09b98f8b2395d076514037ff7d39a091a536206c',
  6,
  'USDC',
  'USD//C'
)
export const USDC_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  6,
  'USDC',
  'USD//C'
)
export const USDC_POLYGON_MUMBAI = new Token(
  SupportedChainId.POLYGON_MUMBAI,
  '0xe11a86849d99f524cac3e7a0ec1241828e332c62',
  6,
  'USDC',
  'USD//C'
)
export const PORTAL_USDC_CELO = new Token(
  SupportedChainId.CELO,
  '0x37f750B7cC259A2f741AF45294f6a16572CF5cAd',
  6,
  'USDCet',
  'USDC (Portal from Ethereum)'
)
export const USDC_CELO_ALFAJORES = new Token(
  SupportedChainId.CELO_ALFAJORES,
  '0x41F4a5d2632b019Ae6CE9625bE3c9CaC143AcC7D',
  6,
  'USDC',
  'USD//C'
)
export const AMPL = new Token(
  SupportedChainId.MAINNET,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth'
)
export const DAI_MAINNET = new Token(
  SupportedChainId.MAINNET,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const DAI_ARBITRUM_ONE = new Token(
  SupportedChainId.ARBITRUM_ONE,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai stable coin'
)
export const DAI_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai stable coin'
)
export const WBNB = new Token(
  SupportedChainId.BSC,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB',
  'Wrapped Binance Coin'
)
export const USDC_BSC = new Token(
  SupportedChainId.BSC,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'USD Coin'
)
export const CAKE_BSC = new Token(
  SupportedChainId.BSC,
  '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  18,
  'CAKE',
  'PancakeSwap Token'
)
export const DAI_BSC = new Token(
  SupportedChainId.BSC,
  '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USD_BSC = new Token(
  SupportedChainId.BSC,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'Binance USD'
)
export const BTCB_BSC = new Token(
  SupportedChainId.BSC,
  '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
  18,
  'BTCB',
  'Bitcoin'
)
export const WETH_BSC = new Token(
  SupportedChainId.BSC,
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  18,
  'WETH',
  'Wrapped Ether'
)
export const MIM_BSC = new Token(
  SupportedChainId.BSC,
  '0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba',
  18,
  'MIM',
  'Magic Internet Money'
)
export const ICE_BSC = new Token(
  SupportedChainId.BSC,
  '0xf16e81dce15B08F326220742020379B855B87DF9',
  18,
  'ICE',
  'IceToken'
)
export const SPELL_BSC = new Token(
  SupportedChainId.BSC,
  '0x9Fe28D11ce29E340B7124C493F59607cbAB9ce48',
  18,
  'SPELL',
  'SpellToken'
)
export const FRAX_BSC = new Token(
  SupportedChainId.BSC,
  '0x90C97F71E18723b0Cf0dfa30ee176Ab653E89F40',
  18,
  'FRAX',
  'Frax'
)
export const FXS_BSC = new Token(
  SupportedChainId.BSC,
  '0xe48A3d7d0Bc88d552f730B62c006bC925eadB9eE',
  18,
  'FXS',
  'Frax Share'
)
export const STG_BSC = new Token(
  SupportedChainId.BSC,
  '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
  18,
  'STG',
  'StargateToken'
)

export const DAI_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDT_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  6,
  'USDT',
  'Tether USD'
)
export const WBTC_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const USDT_MAINNET = new Token(
  SupportedChainId.MAINNET,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)
export const USDT_BSC = new Token(
  SupportedChainId.BSC,
  '0x55d398326f99059fF775485246999027B3197955',
  6,
  'USDT',
  'Tether USD'
)
export const USDT_ARBITRUM_ONE = new Token(
  SupportedChainId.ARBITRUM_ONE,
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  6,
  'USDT',
  'Tether USD'
)
export const USDT_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  6,
  'USDT',
  'Tether USD'
)
export const WBTC = new Token(
  SupportedChainId.MAINNET,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const WBTC_ARBITRUM_ONE = new Token(
  SupportedChainId.ARBITRUM_ONE,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const WBTC_OPTIMISM = new Token(
  SupportedChainId.OPTIMISM,
  '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const FEI = new Token(
  SupportedChainId.MAINNET,
  '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
  18,
  'FEI',
  'Fei USD'
)
export const TRIBE = new Token(
  SupportedChainId.MAINNET,
  '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  18,
  'TRIBE',
  'Tribe'
)
export const FRAX = new Token(
  SupportedChainId.MAINNET,
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  18,
  'FRAX',
  'Frax'
)
export const FXS = new Token(
  SupportedChainId.MAINNET,
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  18,
  'FXS',
  'Frax Share'
)
export const renBTC = new Token(
  SupportedChainId.MAINNET,
  '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  8,
  'renBTC',
  'renBTC'
)
export const ETH2X_FLI = new Token(
  SupportedChainId.MAINNET,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
export const sETH2 = new Token(
  SupportedChainId.MAINNET,
  '0xFe2e637202056d30016725477c5da089Ab0A043A',
  18,
  'sETH2',
  'StakeWise Staked ETH2'
)
export const rETH2 = new Token(
  SupportedChainId.MAINNET,
  '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
  18,
  'rETH2',
  'StakeWise Reward ETH2'
)
export const SWISE = new Token(
  SupportedChainId.MAINNET,
  '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
  18,
  'SWISE',
  'StakeWise'
)
export const WETH_POLYGON_MUMBAI = new Token(
  SupportedChainId.POLYGON_MUMBAI,
  '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa',
  18,
  'WETH',
  'Wrapped Ether'
)

export const WETH_POLYGON = new Token(
  SupportedChainId.POLYGON,
  '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  18,
  'WETH',
  'Wrapped Ether'
)
export const CELO_CELO = new Token(
  SupportedChainId.CELO,
  '0x471EcE3750Da237f93B8E339c536989b8978a438',
  18,
  'CELO',
  'Celo'
)
export const CUSD_CELO = new Token(
  SupportedChainId.CELO,
  '0x765DE816845861e75A25fCA122bb6898B8B1282a',
  18,
  'cUSD',
  'Celo Dollar'
)
export const CEUR_CELO = new Token(
  SupportedChainId.CELO,
  '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73',
  18,
  'cEUR',
  'Celo Euro Stablecoin'
)
export const PORTAL_ETH_CELO = new Token(
  SupportedChainId.CELO,
  '0x66803FB87aBd4aaC3cbB3fAd7C3aa01f6F3FB207',
  18,
  'ETH',
  'Portal Ether'
)
export const CMC02_CELO = new Token(
  SupportedChainId.CELO,
  '0x32A9FE697a32135BFd313a6Ac28792DaE4D9979d',
  18,
  'cMCO2',
  'Celo Moss Carbon Credit'
)
export const CELO_CELO_ALFAJORES = new Token(
  SupportedChainId.CELO_ALFAJORES,
  '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
  18,
  'CELO',
  'Celo'
)
export const CUSD_CELO_ALFAJORES = new Token(
  SupportedChainId.CELO_ALFAJORES,
  '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
  18,
  'CUSD',
  'Celo Dollar'
)
export const CEUR_CELO_ALFAJORES = new Token(
  SupportedChainId.CELO_ALFAJORES,
  '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F',
  18,
  'CEUR',
  'Celo Euro Stablecoin'
)

/**
 * Grav Tokens (from tokenlist)
 */

export const GRAV = new Token(
  SupportedChainId.EVMOS,
  '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd',
  18,
  'GRAV',
  'Graviton - channel-8'
)

export const gWETH = new Token(
  SupportedChainId.EVMOS,
  '0xc03345448969Dd8C00e9E4A85d2d9722d093aF8E',
  18,
  'gWETH',
  'Wrapped Ether - Gravity'
)

export const gUSDC = new Token(
  SupportedChainId.EVMOS,
  '0x5FD55A1B9FC24967C4dB09C513C3BA0DFa7FF687',
  6,
  'gUSDC',
  'Gravity USDC'
)

export const gWBTC = new Token(
  SupportedChainId.EVMOS,
  '0x1d54ecb8583ca25895c512a8308389ffd581f9c9',
  8,
  'gWBTC',
  'Wrapped BTC - Gravity'
)

export const gDAI = new Token(
  SupportedChainId.EVMOS,
  '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75',
  18,
  'gDAI',
  'Wrapped DAI - Gravity'
)

export const gUSDT = new Token(
  SupportedChainId.EVMOS,
  '0xeceeefcee421d8062ef8d6b4d814efe4dc898265',
  6,
  'gUSDT',
  'USDT - Gravity'
)

/** ---------- NOMAD TOKENS
 * https://docs.nomad.xyz/bridge/domains.html#milkomeda-c1
 * ----------- */
export const madWETH = new Token(
  SupportedChainId.EVMOS,
  '0x5842C5532b61aCF3227679a8b1BD0242a41752f2',
  18,
  'WETH',
  'Wrapped Ether - Nomad'
)

export const madWBTC = new Token(
  SupportedChainId.EVMOS,
  '0xF80699Dc594e00aE7bA200c7533a07C1604A106D',
  8,
  'madWBTC',
  'Wrapped BTC - Nomad'
)

export const madDAI = new Token(
  SupportedChainId.EVMOS,
  '0x63743ACF2c7cfee65A5E356A4C4A005b586fC7AA',
  18,
  'madDAI',
  'Dai Stablecoin - Nomad'
)

export const madUSDC = new Token(
  SupportedChainId.EVMOS,
  '0x51e44FfaD5C2B122C8b635671FCC8139dc636E82',
  6,
  'madUSDC',
  'USD Coin - Nomad'
)

export const TETHER_EVMOS = new Token(
  SupportedChainId.EVMOS,
  '0x7FF4a56B32ee13D7D4D405887E0eA37d61Ed919e',
  6,
  'madUSDT',
  'Tether USD - Nomad'
)

export const DIFFUSION = new Token(
  SupportedChainId.EVMOS,
  '0x3f75ceabCDfed1aCa03257Dc6Bdc0408E2b4b026',
  18,
  'DIFF',
  'Diffusion'
)

export const XDIFFUSION = new Token(
  SupportedChainId.EVMOS,
  '0x75aeE82a16BD1fB98b11879af93AB7CE055f66Da',
  18,
  'XDIFF',
  'xDiffusion'
)

// Pulsechain tokens
export const USDC_PULSECHAIN = new Token(
  SupportedChainId.PULSECHAIN,
  '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07',
  6,
  'USDC',
  'USD//C'
)
export const USDC_PULSECHAIN_TESTNET = new Token(
  SupportedChainId.PULSECHAIN_TESTNET,
  '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07',
  6,
  'USDC',
  'USD//C'
)
export const DAI_PULSECHAIN = new Token(
  SupportedChainId.PULSECHAIN,
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const DAI_PULSECHAIN_TESTNET = new Token(
  SupportedChainId.PULSECHAIN_TESTNET,
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDT_PULSECHAIN = new Token(
  SupportedChainId.PULSECHAIN,
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  6,
  'USDT',
  'Tether USD'
)
export const USDT_PULSECHAIN_TESTNET = new Token(
  SupportedChainId.PULSECHAIN_TESTNET,
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  6,
  'USDT',
  'Tether USD'
)

// Base tokens
export const USDC_BASE = new Token(
  SupportedChainId.BASE,
  '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
  6,
  'USDbC',
  'USDbC'
)
export const DAI_BASE = new Token(
  SupportedChainId.BASE,
  '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  18,
  'DAI',
  'Dai Stablecoin'
)

export const USDC: { [chainId in SupportedChainId]: Token } = {
  [SupportedChainId.MAINNET]: USDC_MAINNET,
  [SupportedChainId.BASE]: USDC_BASE,
  [SupportedChainId.BSC]: USDC_BSC,
  [SupportedChainId.DOGECHAIN]: USDC_DOGECHAIN,
  [SupportedChainId.DOGECHAIN_TESTNET]: USDC_DOGECHAINTESTNET,
  [SupportedChainId.EVMOS]: USDC_EVMOS,
  [SupportedChainId.ARBITRUM_ONE]: USDC_ARBITRUM,
  [SupportedChainId.OPTIMISM]: USDC_OPTIMISM,
  [SupportedChainId.ARBITRUM_RINKEBY]: USDC_ARBITRUM_RINKEBY,
  [SupportedChainId.OPTIMISTIC_KOVAN]: USDC_OPTIMISTIC_KOVAN,
  [SupportedChainId.POLYGON]: USDC_POLYGON,
  [SupportedChainId.POLYGON_MUMBAI]: USDC_POLYGON_MUMBAI,
  [SupportedChainId.CELO]: PORTAL_USDC_CELO,
  [SupportedChainId.CELO_ALFAJORES]: USDC_CELO_ALFAJORES,
  [SupportedChainId.GOERLI]: USDC_GOERLI,
  [SupportedChainId.RINKEBY]: USDC_RINKEBY,
  [SupportedChainId.KOVAN]: USDC_KOVAN,
  [SupportedChainId.ROPSTEN]: USDC_ROPSTEN,
  [SupportedChainId.PULSECHAIN]: USDC_PULSECHAIN,
  [SupportedChainId.PULSECHAIN_TESTNET]: USDC_PULSECHAIN_TESTNET,
}
export const USDT: { [chainId in SupportedChainId]: Token } = {
  [SupportedChainId.MAINNET]: USDT_MAINNET,
  [SupportedChainId.BASE]: USDT_MAINNET,
  [SupportedChainId.BSC]: USDT_BSC,
  [SupportedChainId.DOGECHAIN]: USDT_MAINNET,
  [SupportedChainId.DOGECHAIN_TESTNET]: USDT_MAINNET,
  [SupportedChainId.EVMOS]: USDT_MAINNET,
  [SupportedChainId.ARBITRUM_ONE]: USDT_ARBITRUM_ONE,
  [SupportedChainId.OPTIMISM]: USDT_OPTIMISM,
  [SupportedChainId.ARBITRUM_RINKEBY]: USDT_MAINNET,
  [SupportedChainId.OPTIMISTIC_KOVAN]: USDT_MAINNET,
  [SupportedChainId.POLYGON]: USDT_POLYGON,
  [SupportedChainId.POLYGON_MUMBAI]: USDT_MAINNET,
  [SupportedChainId.CELO]: USDT_MAINNET,
  [SupportedChainId.CELO_ALFAJORES]: USDT_MAINNET,
  [SupportedChainId.GOERLI]: USDT_MAINNET,
  [SupportedChainId.RINKEBY]: USDT_MAINNET,
  [SupportedChainId.KOVAN]: USDT_MAINNET,
  [SupportedChainId.ROPSTEN]: USDT_MAINNET,
  [SupportedChainId.PULSECHAIN]: USDT_PULSECHAIN,
  [SupportedChainId.PULSECHAIN_TESTNET]: USDT_PULSECHAIN_TESTNET,
}
export const DAI: { [chainId in SupportedChainId]: Token } = {
  [SupportedChainId.MAINNET]: DAI_MAINNET,
  [SupportedChainId.BASE]: DAI_BASE,
  [SupportedChainId.BSC]: DAI_BSC,
  [SupportedChainId.DOGECHAIN]: DAI_MAINNET,
  [SupportedChainId.DOGECHAIN_TESTNET]: DAI_MAINNET,
  [SupportedChainId.EVMOS]: DAI_MAINNET,
  [SupportedChainId.ARBITRUM_ONE]: DAI_ARBITRUM_ONE,
  [SupportedChainId.OPTIMISM]: DAI_OPTIMISM,
  [SupportedChainId.ARBITRUM_RINKEBY]: DAI_MAINNET,
  [SupportedChainId.OPTIMISTIC_KOVAN]: DAI_MAINNET,
  [SupportedChainId.POLYGON]: DAI_POLYGON,
  [SupportedChainId.POLYGON_MUMBAI]: DAI_MAINNET,
  [SupportedChainId.CELO]: DAI_MAINNET,
  [SupportedChainId.CELO_ALFAJORES]: DAI_MAINNET,
  [SupportedChainId.GOERLI]: DAI_MAINNET,
  [SupportedChainId.RINKEBY]: DAI_MAINNET,
  [SupportedChainId.KOVAN]: DAI_MAINNET,
  [SupportedChainId.ROPSTEN]: DAI_MAINNET,
  [SupportedChainId.PULSECHAIN]: DAI_PULSECHAIN,
  [SupportedChainId.PULSECHAIN_TESTNET]: DAI_PULSECHAIN_TESTNET,
}

export const UNI: { [chainId: number]: Token } = {
  [SupportedChainId.MAINNET]: new Token(SupportedChainId.MAINNET, UNI_ADDRESS[1], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.RINKEBY]: new Token(SupportedChainId.RINKEBY, UNI_ADDRESS[4], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.ROPSTEN]: new Token(SupportedChainId.ROPSTEN, UNI_ADDRESS[3], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.GOERLI]: new Token(SupportedChainId.GOERLI, UNI_ADDRESS[5], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.KOVAN]: new Token(SupportedChainId.KOVAN, UNI_ADDRESS[42], 18, 'UNI', 'Uniswap'),
}

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } = {
  ...(WETH9 as Record<SupportedChainId, Token>),
  [SupportedChainId.BSC]: new Token(
    SupportedChainId.BSC,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB'
  ),
  [SupportedChainId.EVMOS]: new Token(
    SupportedChainId.EVMOS,
    '0xD4949664cD82660AaE99bEdc034a0deA8A0bd517',
    18,
    'WEVMOS',
    'Wrapped EVMOS'
  ),
  [SupportedChainId.DOGECHAIN]: new Token(
    SupportedChainId.DOGECHAIN,
    '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101',
    18,
    'WWDoge',
    'Wrapped Doge'
  ),
  [SupportedChainId.DOGECHAIN_TESTNET]: new Token(
    SupportedChainId.DOGECHAIN,
    '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101',
    18,
    'WWDoge',
    'Wrapped Doge'
  ),
  [SupportedChainId.OPTIMISM]: new Token(
    SupportedChainId.OPTIMISM,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.OPTIMISTIC_KOVAN]: new Token(
    SupportedChainId.OPTIMISTIC_KOVAN,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.ARBITRUM_ONE]: new Token(
    SupportedChainId.ARBITRUM_ONE,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.ARBITRUM_RINKEBY]: new Token(
    SupportedChainId.ARBITRUM_RINKEBY,
    '0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainId.POLYGON]: new Token(
    SupportedChainId.POLYGON,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped MATIC'
  ),
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    18,
    'WMATIC',
    'Wrapped MATIC'
  ),
  [SupportedChainId.PULSECHAIN]: new Token(
    SupportedChainId.PULSECHAIN,
    '0xa1077a294dde1b09bb078844df40758a5d0f9a27',
    18,
    'WPLS',
    'Wrapped Pulse'
  ),
  [SupportedChainId.BASE]: new Token(
    SupportedChainId.BASE,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  ),
}

export function isCelo(chainId: number): chainId is SupportedChainId.CELO | SupportedChainId.CELO_ALFAJORES {
  return chainId === SupportedChainId.CELO_ALFAJORES || chainId === SupportedChainId.CELO
}

function getCeloNativeCurrency(chainId: number) {
  switch (chainId) {
    case SupportedChainId.CELO_ALFAJORES:
      return CELO_CELO_ALFAJORES
    case SupportedChainId.CELO:
      return CELO_CELO
    default:
      throw new Error('Not celo')
  }
}

function isMatic(chainId: number): chainId is SupportedChainId.POLYGON | SupportedChainId.POLYGON_MUMBAI {
  return chainId === SupportedChainId.POLYGON_MUMBAI || chainId === SupportedChainId.POLYGON
}

class MaticNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isMatic(this.chainId)) throw new Error('Not matic')
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(wrapped instanceof Token)
    return wrapped
  }

  public constructor(chainId: number) {
    if (!isMatic(chainId)) throw new Error('Not matic')
    super(chainId, 18, 'MATIC', 'Polygon Matic')
  }
}

function isBSC(chainId: number): chainId is SupportedChainId.BSC {
  return chainId === SupportedChainId.BSC
}

function isDogechain(chainId: number): chainId is SupportedChainId.DOGECHAIN {
  return chainId === SupportedChainId.DOGECHAIN
}

function isEVMOS(chainId: number): chainId is SupportedChainId.EVMOS {
  return chainId === SupportedChainId.EVMOS
}

function isPulsechain(chainId: number): chainId is SupportedChainId.PULSECHAIN {
  return chainId === SupportedChainId.PULSECHAIN
}

function isBase(chainId: number): chainId is SupportedChainId.BASE {
  return chainId === SupportedChainId.BASE
}

class DogechainNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isDogechain(this.chainId)) throw new Error('Not Doge')
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(wrapped instanceof Token)
    return wrapped
  }

  public constructor(chainId: number) {
    if (!isDogechain(chainId)) throw new Error('Not Doge')
    super(chainId, 18, 'WDOGE', 'Dogechain Native Token')
  }
}

class EVMOSNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isEVMOS(this.chainId)) throw new Error('Not EVMOS')
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    invariant(wrapped instanceof Token)
    return wrapped
  }

  public constructor(chainId: number) {
    if (!isEVMOS(chainId)) throw new Error('Not EVMOS')
    super(chainId, 18, 'EVMOS', 'EVMOS Native Token')
  }
}

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error('Unsupported chain ID')
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }
}

export class ExtendedBNB extends BNB {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error('Unsupported chain ID')
  }

  private static _cachedExtendedBNB: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedBNB[chainId] ?? (this._cachedExtendedBNB[chainId] = new ExtendedBNB(chainId))
  }
}

class ExtendedPLS extends PLS {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error('Unsupported chain ID')
  }

  private static _cachedExtendedPLS: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedPLS[chainId] ?? (this._cachedExtendedPLS[chainId] = new ExtendedPLS(chainId))
  }
}

export class ExtendedBaseEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error('Unsupported chain ID')
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}
export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]
  let nativeCurrency: NativeCurrency | Token
  if (isMatic(chainId)) {
    nativeCurrency = new MaticNativeCurrency(chainId)
  } else if (isCelo(chainId)) {
    nativeCurrency = getCeloNativeCurrency(chainId)
  } else if (isBSC(chainId)) {
    nativeCurrency = ExtendedBNB.onChain(chainId)
  } else if (isDogechain(chainId)) {
    nativeCurrency = new DogechainNativeCurrency(chainId)
  } else if (isEVMOS(chainId)) {
    nativeCurrency = new EVMOSNativeCurrency(chainId)
  } else if (isPulsechain(chainId)) {
    nativeCurrency = ExtendedPLS.onChain(chainId)
  } else if (isBase(chainId)) {
    nativeCurrency = ExtendedBaseEther.onChain(chainId)
  } else {
    nativeCurrency = ExtendedEther.onChain(chainId)
  }
  return (cachedNativeCurrency[chainId] = nativeCurrency)
}

export const TOKEN_SHORTHANDS: { [shorthand: string]: { [chainId in SupportedChainId]?: string } } = {
  USDC: {
    [SupportedChainId.MAINNET]: USDC_MAINNET.address,
    [SupportedChainId.BASE]: USDC_BASE.address,
    [SupportedChainId.BSC]: USDC_BSC.address,
    [SupportedChainId.DOGECHAIN]: USDC_DOGECHAIN.address,
    [SupportedChainId.DOGECHAIN_TESTNET]: USDC_DOGECHAINTESTNET.address,
    [SupportedChainId.EVMOS]: USDC_EVMOS.address,
    [SupportedChainId.ARBITRUM_ONE]: USDC_ARBITRUM.address,
    [SupportedChainId.OPTIMISM]: USDC_OPTIMISM.address,
    [SupportedChainId.ARBITRUM_RINKEBY]: USDC_ARBITRUM_RINKEBY.address,
    [SupportedChainId.OPTIMISTIC_KOVAN]: USDC_OPTIMISTIC_KOVAN.address,
    [SupportedChainId.POLYGON]: USDC_POLYGON.address,
    [SupportedChainId.POLYGON_MUMBAI]: USDC_POLYGON_MUMBAI.address,
    [SupportedChainId.CELO]: PORTAL_USDC_CELO.address,
    [SupportedChainId.CELO_ALFAJORES]: PORTAL_USDC_CELO.address,
    [SupportedChainId.GOERLI]: USDC_GOERLI.address,
    [SupportedChainId.RINKEBY]: USDC_RINKEBY.address,
    [SupportedChainId.KOVAN]: USDC_KOVAN.address,
    [SupportedChainId.ROPSTEN]: USDC_ROPSTEN.address,
    [SupportedChainId.PULSECHAIN]: USDC_PULSECHAIN.address,
    [SupportedChainId.PULSECHAIN_TESTNET]: USDC_PULSECHAIN_TESTNET.address,
  },
}

const STABLE_COINS = {
  [SupportedChainId.MAINNET]: [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    '0x4Fabb145d64652a948d72533023f6E7A623C7C53', // BUSD
  ],
  [SupportedChainId.POLYGON]: [
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', //DAI
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', //usdc
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', //usdt
    '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1', //MAI
  ],
  [SupportedChainId.BSC]: [
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', //dai
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // usdc
    '0x55d398326f99059fF775485246999027B3197955', //usdt
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // busd
  ],
  [SupportedChainId.EVMOS]: [
    '0xF2001B145b43032AAF5Ee2884e456CCd805F677D', // dai
    '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', //usdc
    '0x66e428c3f67a68878562e79A0234c1F83c208770', //'usdt'
  ],
  [SupportedChainId.ARBITRUM_ONE]: [
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', //dai
    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', //usdc
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', //usdt
  ],
  [SupportedChainId.OPTIMISM]: [
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // Dai
    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', //usdt
    '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', //usdc
  ],
}

const handler = {
  get(target: any, name: string) {
    return target.hasOwnProperty(name) ? target[name] : []
  },
}

export const STABLE_COINS_ADDRESS: { [chainId in SupportedChainId]: string[] } = new Proxy(STABLE_COINS, handler)

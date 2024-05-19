import { SupportedChainId } from './chains'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

const QUICKNODE_KEY = '431018adfc942ab42266bb3de510ecb39bf5432e'

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: `https://node.mevfree.com:8585/rpc`,
  //[SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  //[SupportedChainId.MAINNET]: `https://warmhearted-autumn-asphalt.quiknode.pro/${QUICKNODE_KEY}`,
  // [SupportedChainId.MAINNET]: `https://node.mevfree.com:8585/rpc`,
  //[SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  //[SupportedChainId.MAINNET]: `https://warmhearted-autumn-asphalt.quiknode.pro/${QUICKNODE_KEY}`,
  [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.BSC]: `https://bsc-dataseed.binance.org/`,
  [SupportedChainId.DOGECHAIN]: `https://rpc01-sg.dogechain.dog/`,
  [SupportedChainId.DOGECHAIN_TESTNET]: `https://rpc-testnet.dogechain.dog/`,
  [SupportedChainId.EVMOS]: `https://evmos-rpc2.binary.host`,
  [SupportedChainId.OPTIMISM]: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.OPTIMISTIC_KOVAN]: `https://optimism-kovan.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ARBITRUM_ONE]: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ARBITRUM_RINKEBY]: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.POLYGON]: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.POLYGON_MUMBAI]: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.CELO]: `https://forno.celo.org`,
  [SupportedChainId.CELO_ALFAJORES]: `https://alfajores-forno.celo-testnet.org`,
  [SupportedChainId.PULSECHAIN]: `https://rpc.pulsechain.com`,
  [SupportedChainId.PULSECHAIN_TESTNET]: `https://rpc.v2.testnet.pulsechain.com`,
  [SupportedChainId.BASE]: `https://developer-access-mainnet.base.org`,
}

export const NETWORKS_INFO_CONFIG: { [chain in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: 'ethereum',
  [SupportedChainId.ROPSTEN]: 'ropsten',
  [SupportedChainId.RINKEBY]: 'rinkeby',
  [SupportedChainId.KOVAN]: 'kovan',
  [SupportedChainId.POLYGON]: 'matic',
  [SupportedChainId.POLYGON_MUMBAI]: 'mumbai',
  [SupportedChainId.BASE]: 'base',
  [SupportedChainId.BSC]: 'bnb',
  [SupportedChainId.OPTIMISM]: 'optimism',
  5: '',
  42161: '',
  421611: '',
  69: '',
  2000: '',
  568: '',
  9001: '',
  42220: '',
  44787: '',
  [SupportedChainId.PULSECHAIN]: 'pulsechain',
  [SupportedChainId.PULSECHAIN_TESTNET]: '',
}

//this Proxy helps fallback undefined ChainId by Ethereum info
export const NETWORKS_INFO = new Proxy(NETWORKS_INFO_CONFIG, {
  get(target, p) {
    const prop = p as any as SupportedChainId
    if (p && target[prop]) return target[prop]
    return target[SupportedChainId.MAINNET]
  },
})

const UNI_LIST = 'https://tokens.uniswap.org'
const AAVE_LIST = 'tokenlist.aave.eth'
const CMC_ALL_LIST = 'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const KLEROS_LIST = 't2crtokens.eth'
const ROLL_LIST = 'https://app.tryroll.com/tokens.json'
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'
const SUSHI_LIST = 'https://token-list.sushi.com'
const CHAINLINK_LIST = 'https://token-list.sushi.com/chainlink'
const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'
const DOGESHREK_LIST =
  'https://raw.githubusercontent.com/cyberminter/dogeshrek-tokens-list/main/tokenLists/dogeShrekTokenList.json'
const YODESWAP_LIST =
  'https://raw.githubusercontent.com/yodedex/yodeswap-default-tokenlist/main/yodeswap.tokenlist.json'

export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const CELO_LIST = 'https://celo-org.github.io/celo-token-list/celo.tokenlist.json'

export const DIFFUSION_LIST = 'https://raw.githubusercontent.com/diffusion-fi/tokenlist/main/src/tokenlist.json'

export const BASE_LIST = 'https://tokens.coingecko.com/base/all.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// this is the default list of lists that are exposed to users
// lower index == higher priority for token import
const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [
  UNI_LIST,
  SUSHI_LIST,
  CHAINLINK_LIST,
  PANCAKE_EXTENDED,
  DOGESHREK_LIST,
  YODESWAP_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  COINGECKO_LIST,
  KLEROS_LIST,
  GEMINI_LIST,
  WRAPPED_LIST,
  SET_LIST,
  ROLL_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  CELO_LIST,
  DIFFUSION_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST, GEMINI_LIST]

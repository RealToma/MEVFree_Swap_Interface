import { SupportedChainId } from 'constants/chains'
import useHttpLocations from 'hooks/useHttpLocations'
import { Currency } from 'mevswap/sdk-core'
import { useMemo } from 'react'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'

import BscLogo from '../../assets/images/bsc-logo.png'
import DogechainLogo from '../../assets/images/dogechain-logo.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import EvmosLogo from '../../assets/images/evmos-icon.png'
import CeloLogo from '../../assets/svg/celo_logo.svg'
import MaticLogo from '../../assets/svg/matic-token-icon.svg'
import { isCelo, MEVFREE_MAINNET, nativeOnChain } from '../../constants/tokens'

type Network = 'ethereum' | 'arbitrum' | 'optimism' | 'bsc' | 'dogechain' | 'evmos'

function chainIdToNetworkName(networkId: SupportedChainId): Network {
  switch (networkId) {
    case SupportedChainId.MAINNET:
      return 'ethereum'
    case SupportedChainId.BSC:
      return 'bsc'
    case SupportedChainId.DOGECHAIN:
      return 'dogechain'
    case SupportedChainId.EVMOS:
      return 'evmos'
    case SupportedChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case SupportedChainId.OPTIMISM:
      return 'optimism'
    default:
      return 'ethereum'
  }
}

function getNativeLogoURI(chainId: SupportedChainId = SupportedChainId.MAINNET): string {
  switch (chainId) {
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return MaticLogo
    case SupportedChainId.CELO:
    case SupportedChainId.CELO_ALFAJORES:
      return CeloLogo
    case SupportedChainId.BSC:
      return BscLogo
    case SupportedChainId.DOGECHAIN:
      return DogechainLogo
    case SupportedChainId.EVMOS:
      return EvmosLogo
    default:
      return EthereumLogo
  }
}

function getTokenLogoURI(address: string, chainId: SupportedChainId = SupportedChainId.MAINNET): string | void {
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [SupportedChainId.ARBITRUM_ONE, SupportedChainId.MAINNET, SupportedChainId.OPTIMISM]

  // hard code mevfree logo for now.
  if (address === MEVFREE_MAINNET.address) {
    return 'https://mevfree.com/images/mevfree200.png'
  } else if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }

  // Celo logo logo is hosted elsewhere.
  if (isCelo(chainId)) {
    if (address === nativeOnChain(chainId).wrapped.address) {
      return 'https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_CELO.png'
    }
  }
}

export default function useCurrencyLogoURIs(currency?: Currency | null): string[] {
  const locations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  return useMemo(() => {
    const logoURIs = [...locations]
    if (currency) {
      if (currency.isNative) {
        logoURIs.push(getNativeLogoURI(currency.chainId))
      } else if (currency.isToken) {
        const logoURI = getTokenLogoURI(currency.address, currency.chainId)
        if (logoURI) {
          logoURIs.push(logoURI)
        }
      }
    }
    return logoURIs
  }, [currency, locations])
}

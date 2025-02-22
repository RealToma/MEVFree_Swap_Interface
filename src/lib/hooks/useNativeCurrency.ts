import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { nativeOnChain } from 'constants/tokens'
import { NativeCurrency, Token } from 'mevswap/sdk-core'
import { useMemo } from 'react'

export default function useNativeCurrency(): NativeCurrency | Token {
  const { chainId } = useWeb3React()
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
          nativeOnChain(SupportedChainId.MAINNET),
    [chainId]
  )
}

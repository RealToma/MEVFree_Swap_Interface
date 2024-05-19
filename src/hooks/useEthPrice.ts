import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useTokenDetailQuery } from 'graphql/data/TokenDetailQuery'
import { nativeOnChain } from 'mevswap/smart-order-router'

export function useETHPrice(): number | null | undefined {
  const { chainId } = useWeb3React()

  const safeChainId = chainId || SupportedChainId.MAINNET
  const wrappedNativeCurrency = nativeOnChain(safeChainId).wrapped

  const tokenDetailData = useTokenDetailQuery(wrappedNativeCurrency.address, 'ETHEREUM')
  return tokenDetailData?.price?.value
}

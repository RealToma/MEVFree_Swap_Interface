import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useTokenDetailQuery } from 'graphql/data/TokenDetailQuery'

export function useTokenPrice(tokenAddress) {
  const { chainId } = useWeb3React()

  const safeChainId = chainId || SupportedChainId.MAINNET

  const tokenDetailData = useTokenDetailQuery(tokenAddress, 'ETHEREUM')
  return tokenDetailData?.price?.value
}

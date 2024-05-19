import { useWeb3React } from '@web3-react/core'
import AnimatedPage from 'components/AnimatedPage/AnimatedPage'
import { SupportedChainId } from 'constants/chains'
import { useUserLegacyMode } from 'state/user/hooks'
import styled from 'styled-components/macro'

import AutoRouterSwap from './AutoRouterSwap'
import LegacySwap from './LegacySwap'

const Wrapper = styled.div`
  display: auto;
  width: 100%;
  height: 100%;
`

const Swap = () => {
  const { chainId } = useWeb3React()
  const [swapLegacyMode] = useUserLegacyMode()
  if (
    chainId === SupportedChainId.DOGECHAIN ||
    chainId === SupportedChainId.EVMOS ||
    chainId === SupportedChainId.PULSECHAIN ||
    swapLegacyMode
  ) {
    console.log('Swap returned LegacySwap')
    return (
      <Wrapper>
        <AnimatedPage>
          <LegacySwap />
        </AnimatedPage>
      </Wrapper>
    )
  } else {
    console.log('Swap returned AutoRouterSwap')
    return (
      <Wrapper>
        <AnimatedPage>
          <AutoRouterSwap />
        </AnimatedPage>
      </Wrapper>
    )
  }
}
export default Swap

import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'

import { SupportedChainId } from '../constants/chains'

const initialStyles = {
  width: '200vw',
  height: '200vh',
  transform: 'translate(-50vw, -100vh)',
  backgroundBlendMode: '',
}
const backgroundResetStyles = {
  width: '100vw',
  height: '100vh',
  transform: 'unset',
  backgroundBlendMode: '',
}

type TargetBackgroundStyles = typeof initialStyles | typeof backgroundResetStyles

const backgroundRadialGradientElement = document.getElementById('background-radial-gradient')
const setBackground = (newValues: TargetBackgroundStyles) =>
  Object.entries(newValues).forEach(([key, value]) => {
    if (backgroundRadialGradientElement) {
      backgroundRadialGradientElement.style[key as keyof typeof backgroundResetStyles] = value
    }
  })
export default function RadialGradientByChainUpdater(): null {
  const { chainId } = useWeb3React()
  // manage background color
  useEffect(() => {
    if (!backgroundRadialGradientElement) {
      return
    }

    switch (chainId) {
      case SupportedChainId.ARBITRUM_ONE:
      case SupportedChainId.ARBITRUM_RINKEBY:
        setBackground(backgroundResetStyles)
        const arbitrumDarkGradient = 'radial-gradient(150% 100% at 50% 0%, #0A294B 0%, #221E30 50%, #1F2128 100%)'
        backgroundRadialGradientElement.style.background = arbitrumDarkGradient
        break
      case SupportedChainId.OPTIMISM:
      case SupportedChainId.OPTIMISTIC_KOVAN:
        setBackground(backgroundResetStyles)
        const optimismDarkGradient = 'radial-gradient(150% 100% at 50% 0%, #3E2E38 2%, #2C1F2D 53%, #1F2128 100%)'
        backgroundRadialGradientElement.style.background = optimismDarkGradient
        break
      case SupportedChainId.POLYGON:
      case SupportedChainId.POLYGON_MUMBAI:
        setBackground(backgroundResetStyles)
        const polygonDarkGradient =
          'radial-gradient(150.6% 98.22% at 48.06% 0%, rgba(130, 71, 229, 0.6) 0%, rgba(200, 168, 255, 0) 100%), #1F2128'
        backgroundRadialGradientElement.style.background = polygonDarkGradient
        backgroundRadialGradientElement.style.backgroundBlendMode = 'overlay,normal'
        break
      case SupportedChainId.CELO:
      case SupportedChainId.CELO_ALFAJORES:
        setBackground(backgroundResetStyles)
        const celoDarkGradient =
          'radial-gradient(150% 100% at 50% 0%, rgb(2 80 47) 2%, rgb(12 41 28) 53%, rgb(31, 33, 40) 100%)'
        backgroundRadialGradientElement.style.background = celoDarkGradient
        backgroundRadialGradientElement.style.backgroundBlendMode = 'overlay,normal'
        break
      default:
        setBackground(initialStyles)
        backgroundRadialGradientElement.style.background = ''
    }
  }, [chainId])
  return null
}

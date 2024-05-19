import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { Box, Flex } from 'components/UIKit'
//import { BarChartLoader } from 'components/UIKit/BarChartLoader'
import LoadingWave from 'components/UIKit/Waves'
import useDebounce from 'hooks/useDebounce'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'

import { SupportedChainId } from '../../constants/chains'
import TradingView, { useTradingViewEvent } from './TradingView'

interface TradingViewChartProps {
  outputSymbol: string
  inputSymbol: string
  onTwChartSymbol?: (symbol: string) => void
}

const TradingViewWrapper = styled.div<{ $show: boolean }>`
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.2s ease-in;
  height: 100%;
`

const LoadingWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: ${({ theme }) => theme.mevbggrey};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  background: '#2E2E42';
`};
`

const wrapSymbol = (sym: string) => {
  switch (sym) {
    case 'ETH':
      return 'WETH'
    case 'BNB':
      return 'WBNB'
    case 'WDOGE':
      return 'WWDOGE'
    case 'EVMOS':
      return 'WEVMOS'
    case 'PLS':
      return 'WPLS'
    default:
      return sym
  }
}

const ID = 'TV_SWAP_CHART'

function getPrefix(
  chainId: SupportedChainId | undefined,
  inputSymbol: string | undefined,
  outputSymbol: string | undefined
) {
  if (!(inputSymbol && outputSymbol)) {
    return ''
  }

  const input = wrapSymbol(inputSymbol)
  const output = wrapSymbol(outputSymbol)

  switch (chainId) {
    case SupportedChainId.MAINNET:
      return `${input}${output}`
    case SupportedChainId.BSC:
      return `${input}/${output}`
    case SupportedChainId.DOGECHAIN:
      return `${input}/${output}`
    case SupportedChainId.PULSECHAIN:
      return `${input}/${output}`
    default:
      return `${input}/${output}`
  }
}

const TradingViewChart = ({ outputSymbol, inputSymbol, onTwChartSymbol }: TradingViewChartProps) => {
  const { chainId } = useWeb3React()

  const [isLoading, setIsLoading] = useState(true)

  const [hasNoData, setHasNoData] = useState(false)

  const symbolName = useMemo(() => {
    return getPrefix(chainId, inputSymbol, outputSymbol)
  }, [chainId, inputSymbol, outputSymbol])

  const onNoDataEvent = useCallback(() => {
    console.debug('No data from TV widget')
    setHasNoData(true)
  }, [])

  const onLoadedEvent = useCallback(() => {
    setIsLoading(false)
  }, [])

  useTradingViewEvent({
    id: ID,
    onNoDataEvent,
    onLoadedEvent,
  })

  // debounce the loading to wait for no data event from TV widget.
  // we cover the loading spinner over TV, let TV try to load data from pairs
  // if there's no no-data event coming between the debounce time, we assume the chart is loaded
  const debouncedLoading = useDebounce(isLoading, 800)

  useEffect(() => {
    if (!(isLoading || debouncedLoading) && !hasNoData && symbolName) {
      onTwChartSymbol?.(symbolName)
    } else {
      onTwChartSymbol?.('')
    }
  }, [debouncedLoading, hasNoData, isLoading, onTwChartSymbol, symbolName])

  //<BarChartLoader />

  return (
    <Box height="100%" width="100%" pt="4px" position="relative">
      {hasNoData && (
        <Flex height="100%" justifyContent="center" alignItems="center" flexDirection="column">
          <Trans>{'TradingView chart not available'}</Trans>
        </Flex>
      )}
      {(isLoading || debouncedLoading) && !hasNoData && (
        <LoadingWrapper>
          <LoadingWave></LoadingWave>
        </LoadingWrapper>
      )}
      {!hasNoData && (
        <TradingViewWrapper $show={!isLoading}>
          {symbolName && <TradingView id={ID} symbol={symbolName} />}
        </TradingViewWrapper>
      )}
    </Box>
  )
}

export default memo(TradingViewChart)

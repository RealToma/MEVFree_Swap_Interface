// eslint-disable-next-line simple-import-sort/imports
import styled from 'styled-components/macro'
import { Box } from 'components/UIKit'
import BarChartLoaderSVG from './BarChartLoaderSVG'
import { Trans } from '@lingui/react'

const LoadingText = styled(Box)`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
`

const LoadingIndicator = styled(Box)`
  height: 100%;
  position: relative;
`

export const BarChartLoader: React.FC<React.PropsWithChildren> = () => {
  return (
    <LoadingIndicator>
      <BarChartLoaderSVG />
      <LoadingText>
        <Trans id={''}>Loading chart data...</Trans>
      </LoadingText>
    </LoadingIndicator>
  )
}

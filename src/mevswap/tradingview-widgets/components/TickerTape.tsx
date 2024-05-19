import React from 'react'
import { useUserShowTickerTape } from 'state/user/hooks'
import styled from 'styled-components/macro'

import { ColorTheme, CopyrightStyles, DisplayMode, Locales } from '../index'
import Widget from './Widget'

const TickerTapeOuterWrapper = styled.div`
  padding: 0 16px 0 16px;
`

const TickerTapeInnerWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.bg0};
  border: solid;
  border-radius: 24px;
  border-width: 2px;
  border-color: ${({ theme }) => theme.gray200};
  padding: 8px 16px 8px 16px;
  justify-content: space-between;
`

export interface TickerTapeSymbol {
  proName: string
  title: string
}

export interface TickerTapeProps {
  symbols?: TickerTapeSymbol[]
  showSymbolLogo?: boolean
  colorTheme?: ColorTheme
  isTransparent?: boolean
  largeChartUrl?: string
  displayMode?: DisplayMode
  locale?: Locales

  children?: never

  copyrightStyles?: CopyrightStyles
}

const defaultSymbols: TickerTapeSymbol[] = [
  {
    proName: 'BITSTAMP:BTCUSD',
    title: 'BTC/USD',
  },
  {
    proName: 'BITSTAMP:ETHUSD',
    title: 'ETH/USD',
  },
  {
    proName: 'BITSTAMP:XRPUSD',
    title: 'XRP/USD',
  },
  {
    proName: 'BITSTAMP:ADAUSD',
    title: 'ADA/USD',
  },
  {
    proName: 'BITSTAMP:DAIUSD',
    title: 'DAI/USD',
  },
  {
    proName: 'BITSTAMP:BNBUSD',
    title: 'BNB/USD',
  },
  {
    proName: 'BITSTAMP:MATICUSD',
    title: 'MATIC/USD',
  },
  {
    proName: 'BITSTAMP:AVAXUSD',
    title: 'AVAX/USD',
  },
  {
    proName: 'BITSTAMP:SHIBUSD',
    title: 'SHIB/USD',
  },
  {
    proName: 'BITSTAMP:DOGEUSD',
    title: 'DOGE/USD',
  },
  {
    proName: 'BITSTAMP:UNIUSD',
    title: 'UNI/USD',
  },
  {
    proName: 'BITSTAMP:LTCUSD',
    title: 'LTC/USD',
  },
]

const TickerTape: React.FC<TickerTapeProps> = ({
  symbols = defaultSymbols,
  showSymbolLogo = true,
  colorTheme = 'light',
  isTransparent = false,
  largeChartUrl = undefined,
  displayMode = 'adaptive',
  locale = 'en',
  copyrightStyles,
  ...props
}) => {
  const [showTickerTape] = useUserShowTickerTape()

  if (showTickerTape) {
    return (
      <TickerTapeOuterWrapper>
        <TickerTapeInnerWrapper>
          <div id="tradingview_widget_wrapper">
            <Widget
              scriptHTML={{
                symbols,
                showSymbolLogo,
                colorTheme,
                isTransparent,
                largeChartUrl,
                displayMode,
                locale,
                ...props,
              }}
              scriptSRC="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
            ></Widget>
          </div>
        </TickerTapeInnerWrapper>
      </TickerTapeOuterWrapper>
    )
  } else {
    return null
  }
}

export default TickerTape

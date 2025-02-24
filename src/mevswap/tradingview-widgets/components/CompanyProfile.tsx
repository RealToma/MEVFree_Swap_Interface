import React from 'react'

import { ColorTheme, CopyrightStyles, Locales } from '../index'

export type CompanyProfileProps = {
  symbol?: string
  width?: string | number
  height?: string | number
  autosize?: boolean
  colorTheme?: ColorTheme
  isTransparent?: boolean
  locale?: Locales
  largeChartUrl?: string

  children?: never

  copyrightStyles?: CopyrightStyles
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({
  symbol = 'NASDAQ:AAPL',
  width = 480,
  height = 650,
  autosize = false,
  colorTheme = 'light',
  isTransparent = false,
  locale = 'en',
  largeChartUrl = undefined,
  copyrightStyles,
  ...props
}) => {
  return <div id="tradingview_widget_wrapper"></div>
}

export default CompanyProfile

/* eslint-disable react/prop-types */
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import ScreenshotTab from 'components/Screenshot'
import TradePrice from 'components/swap/TradePrice'
import { getPriceData } from 'components/TradingViewChart/datafeed'
import { Flex } from 'components/UIKit'
import { SupportedChainId } from 'constants/chains'
import { WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { useBestTrade } from 'hooks/useBestTrade'
import { HoneypotResponse } from 'hooks/useTokenInfo'
import { Currency, TradeType } from 'mevswap/sdk-core'
import { Trade as V2Trade } from 'mevswap/v2-sdk/entities'
import { useEffect, useState } from 'react'
import { Maximize2, Minimize2 } from 'react-feather'
import { InterfaceTrade } from 'state/routing/types'
import { Field } from 'state/swap/actions'
import { useUserLargeChart } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { formatUSDPrice } from 'uniswap/conedison/format'
import tryParseAmount from 'utils/tryParseAmount'

import { ThemedText } from '../../../theme'
import { RowBetween, RowFixed } from '../../Row'
import { formatDelta, getDeltaArrow } from '../TokenDetails/PriceChart'
import { ArrowCell } from '../TokenList'

const StyledSwapHeader = styled.div`
  padding: 0 2px 2px 2px;
  width: 100%;
  color: ${({ theme }) => theme.text2};
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: ${({ theme }) => theme.white};
`

const StyledMaximizeMenuIcon = styled(Maximize2)`
  height: 20px;
  width: 20px;

  stroke: ${({ theme }) => theme.text1};

  :hover {
    stroke: ${({ theme }) => theme.mevblue};
    opacity: 0.7;
  }
`

const StyledMinimizeMenuIcon = styled(Minimize2)`
  height: 20px;
  width: 20px;

  stroke: ${({ theme }) => theme.text1};

  :hover {
    stroke: ${({ theme }) => theme.mevblue};
    opacity: 0.7;
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  border-radius: 0.5rem;
  height: 20px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`

const StyledButtonCintainer = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  stroke: ${({ theme }) => theme.text1};
`

const NameCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  gap: 8px;
`
const PriceCell = styled(Cell)`
  padding-right: 8px;
  stroke: ${({ theme }) => theme.text1};
`
const PercentChangeCell = styled(Cell)`
  padding-right: 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

type TokenChartHeaderProps = {
  inputCurrency: Currency | null | undefined
  outputCurrency: Currency | null | undefined
  nativeInputCurrency: Currency | null | undefined
  nativeOutputCurrency: Currency | null | undefined
  currencies: { [field in Field]?: Currency | null }
  isChartDisplayed: boolean
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  inputTokenHoneypotInfo: HoneypotResponse
  inputTokenHpLoading: boolean
  outputTokenHoneypotInfo: HoneypotResponse
  outputTokenHpLoading: boolean
  targetContent: string
  trade: InterfaceTrade<Currency, Currency, TradeType> | undefined
}

type LegacyTokenChartHeaderProps = {
  inputCurrency: Currency | null | undefined
  outputCurrency: Currency | null | undefined
  nativeInputCurrency: Currency | null | undefined
  nativeOutputCurrency: Currency | null | undefined
  currencies: { [field in Field]?: Currency | null }
  v2Trade: V2Trade<Currency, Currency, TradeType> | undefined
  isChartDisplayed: boolean
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
  targetContent: string
}

export const TokenChartHeader: React.FC<React.PropsWithChildren<TokenChartHeaderProps>> = ({
  inputCurrency,
  outputCurrency,
  nativeInputCurrency,
  nativeOutputCurrency,
  currencies,
  isChartDisplayed,
  showInverted,
  setShowInverted,
  inputTokenHoneypotInfo,
  inputTokenHpLoading,
  outputTokenHoneypotInfo,
  outputTokenHpLoading,
  targetContent,
  trade,
}) => {
  const { chainId } = useWeb3React()
  const [largeChart, setLargeChart] = useUserLargeChart()

  const inputTokenName = inputCurrency?.isNative
    ? WRAPPED_NATIVE_CURRENCY[chainId as SupportedChainId]?.symbol
    : nativeInputCurrency?.name

  const outputTokenName = outputCurrency?.isNative
    ? WRAPPED_NATIVE_CURRENCY[chainId as SupportedChainId]?.symbol
    : nativeOutputCurrency?.name

  const tokenLabel = inputTokenName + '/' + outputTokenName + ' '
  const [currencyA, currencyB] = Object.values(currencies)
  const currency = currencyA?.isNative ? currencyB : currencyA

  // Price data state
  const [priceData, setPriceData] = useState<{ currentPrice: number | null; prevDayPrice: number | null }>({
    currentPrice: null,
    prevDayPrice: null,
  })

  // Calculate price difference and percentage change
  const priceDifference =
    priceData.currentPrice && priceData.prevDayPrice ? priceData.currentPrice - priceData.prevDayPrice : null
  const priceChangePercentage =
    priceDifference && priceData.prevDayPrice ? (priceDifference / priceData.prevDayPrice) * 100 : null

  // Format price change data
  const arrow = getDeltaArrow(priceChangePercentage)
  const smallArrow = getDeltaArrow(priceChangePercentage, 14)
  const formattedDelta = formatDelta(priceChangePercentage)

  // Fetch price data
  useEffect(() => {
    if (currency) {
      const fetchPriceData = async () => {
        try {
          const data = await getPriceData(currency, chainId)
          setPriceData(data)
        } catch (error) {
          console.error('Error fetching price data:', error)
        }
      }

      fetchPriceData()
    }
  }, [chainId, currency])

  return (
    <StyledSwapHeader>
      <RowBetween>
        <Flex justifyContent="start" alignItems="baseline" flexWrap="wrap">
          {currencies && currencies.INPUT && currencies.OUTPUT && (
            <>
              <DoubleCurrencyLogo
                currency0={nativeInputCurrency}
                currency1={nativeOutputCurrency}
                size={24}
                margin={true}
              />
              <ThemedText.SubHeader fontWeight={500} fontSize={20} style={{ marginRight: '8px' }}>
                {tokenLabel}
              </ThemedText.SubHeader>
            </>
          )}
        </Flex>
        {!inputCurrency?.isNative &&
          !inputCurrency?.wrapped &&
          !inputTokenHpLoading &&
          inputTokenHoneypotInfo?.isHoneypot && (
            <ThemedText.Red fontWeight={800} fontSize={20} style={{ marginRight: '8px' }}>
              ❌❌❌ SEEMS TO BE A HONEYPOT! ❌❌❌
            </ThemedText.Red>
          )}
        {!outputCurrency?.isNative &&
          !outputCurrency?.wrapped &&
          !outputTokenHpLoading &&
          outputTokenHoneypotInfo?.isHoneypot && (
            <ThemedText.Red fontWeight={800} fontSize={20} style={{ marginRight: '8px' }}>
              ❌❌❌ SEEMS TO BE A HONEYPOT! ❌❌❌
            </ThemedText.Red>
          )}
        <RowFixed>
          <ThemedText.SubHeader fontWeight={500} fontSize={20}>
            <PriceCell data-testid="price-cell">{formatUSDPrice(priceData?.currentPrice)}</PriceCell>
          </ThemedText.SubHeader>
          <ThemedText.SubHeader fontWeight={500} fontSize={20}>
            <PercentChangeCell data-testid="percent-change-cell">
              <ArrowCell>{smallArrow}</ArrowCell>
              {formattedDelta}
            </PercentChangeCell>
          </ThemedText.SubHeader>
          <StyledButtonCintainer>
            <ScreenshotTab targetContent={targetContent} />
          </StyledButtonCintainer>
          <StyledButtonCintainer>
            {largeChart ? (
              <StyledMenuButton
                onClick={() => {
                  setLargeChart(false)
                }}
              >
                <StyledMinimizeMenuIcon />
              </StyledMenuButton>
            ) : (
              <StyledMenuButton
                onClick={() => {
                  setLargeChart(true)
                }}
              >
                <StyledMaximizeMenuIcon />
              </StyledMenuButton>
            )}
          </StyledButtonCintainer>
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}

export const LegacyTokenChartHeader: React.FC<React.PropsWithChildren<LegacyTokenChartHeaderProps>> = ({
  inputCurrency,
  outputCurrency,
  nativeInputCurrency,
  nativeOutputCurrency,
  currencies,
  v2Trade,
  isChartDisplayed,
  showInverted,
  setShowInverted,
  targetContent,
}) => {
  const [largeChart, setLargeChart] = useUserLargeChart()

  const parsedAmount = tryParseAmount('1', inputCurrency ?? undefined)

  const bestTradeExactIn = useBestTrade(TradeType.EXACT_INPUT, parsedAmount, outputCurrency ?? undefined)

  const bestTrade = bestTradeExactIn.trade

  const trade: any = v2Trade === undefined ? bestTrade : v2Trade

  return (
    <StyledSwapHeader>
      <RowBetween>
        <Flex justifyContent="start" alignItems="baseline" flexWrap="wrap">
          {bestTrade && (
            <>
              <DoubleCurrencyLogo
                currency0={nativeInputCurrency}
                currency1={nativeOutputCurrency}
                size={24}
                margin={true}
              />
              <ThemedText.Black fontWeight={500} fontSize={20} style={{ marginRight: '8px' }}>
                <Trans>
                  {inputCurrency?.name}/{outputCurrency?.name} Chart
                </Trans>
              </ThemedText.Black>
              <TradePrice price={trade.executionPrice} showInverted={showInverted} setShowInverted={setShowInverted} />
            </>
          )}
        </Flex>
        <RowFixed>
          <StyledButtonCintainer>
            <ScreenshotTab targetContent={targetContent} />
          </StyledButtonCintainer>
          <StyledButtonCintainer>
            {largeChart ? (
              <StyledMenuButton
                onClick={() => {
                  setLargeChart(false)
                }}
              >
                <StyledMinimizeMenuIcon />
              </StyledMenuButton>
            ) : (
              <StyledMenuButton
                onClick={() => {
                  setLargeChart(true)
                }}
              >
                <StyledMaximizeMenuIcon />
              </StyledMenuButton>
            )}
          </StyledButtonCintainer>
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}

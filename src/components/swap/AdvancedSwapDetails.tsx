import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import Card from 'components/Card'
import { LoadingRows } from 'components/Loader/styled'
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from 'constants/chains'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { Currency, Percent, TradeType } from 'mevswap/sdk-core'
import { Trade as V2Trade } from 'mevswap/v2-sdk/entities'
import { useContext, useMemo } from 'react'
import { InterfaceTrade } from 'state/routing/types'
import styled, { ThemeContext } from 'styled-components/macro'

import { Separator, ThemedText } from '../../theme'
import { computeLegacyRealizedLPFeePercent, computeRealizedLPFeePercent } from '../../utils/prices'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import { MouseoverTooltip } from '../Tooltip'
import FormattedPriceImpact from './FormattedPriceImpact'

const StyledCard = styled(Card)`
  padding: 0;
`

interface AdvancedSwapDetailsProps {
  trade?: InterfaceTrade<Currency, Currency, TradeType>
  allowedSlippage: Percent
  syncing?: boolean
  hideInfoTooltips?: boolean
}

interface LegacyAdvancedSwapDetailsProps {
  trade?: V2Trade<Currency, Currency, TradeType>
  allowedSlippage: Percent
  syncing?: boolean
  hideInfoTooltips?: boolean
}

function TextWithLoadingPlaceholder({
  syncing,
  width,
  children,
}: {
  syncing: boolean
  width: number
  children: JSX.Element
}) {
  return syncing ? (
    <LoadingRows>
      <div style={{ height: '15px', width: `${width}px` }} />
    </LoadingRows>
  ) : (
    children
  )
}

export function getPriceImpactPercent(
  lpFeePercent: Percent,
  trade: InterfaceTrade<Currency, Currency, TradeType>
): Percent {
  return trade.priceImpact.subtract(lpFeePercent)
}

export function getLegacyPriceImpactPercent(
  lpFeePercent: Percent,
  trade: V2Trade<Currency, Currency, TradeType>
): Percent {
  return trade.priceImpact.subtract(lpFeePercent)
}

export function AdvancedSwapDetails({
  trade,
  allowedSlippage,
  syncing = false,
  hideInfoTooltips = false,
}: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)
  const { chainId } = useWeb3React()
  const nativeCurrency = useNativeCurrency()

  const { expectedOutputAmount, priceImpact } = useMemo(() => {
    if (!trade) return { expectedOutputAmount: undefined, priceImpact: undefined }
    const expectedOutputAmount = trade.outputAmount
    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const priceImpact = getPriceImpactPercent(realizedLpFeePercent, trade)
    return { expectedOutputAmount, priceImpact }
  }, [trade])

  return !trade ? null : (
    <StyledCard>
      <AutoColumn gap="8px">
        <RowBetween>
          <RowFixed>
            <MouseoverTooltip
              text={
                <Trans>
                  The amount you expect to receive at the current market price. You may receive less or more if the
                  market price changes while your transaction is pending.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text1}>
                <Trans>Expected Output</Trans>
              </ThemedText.SubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={65}>
            <ThemedText.Black textAlign="right" fontSize={14}>
              {expectedOutputAmount
                ? `${expectedOutputAmount.toSignificant(6)}  ${expectedOutputAmount.currency.symbol}`
                : '-'}
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <MouseoverTooltip
              text={<Trans>The impact your trade has on the market price of this pool.</Trans>}
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text1}>
                <Trans>Price Impact</Trans>
              </ThemedText.SubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={50}>
            <ThemedText.Black textAlign="right" fontSize={14}>
              <FormattedPriceImpact priceImpact={priceImpact} />
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <Separator />
        <RowBetween>
          <RowFixed style={{ marginRight: '20px' }}>
            <MouseoverTooltip
              text={
                <Trans>
                  The minimum amount you are guaranteed to receive. If the price slips any further, your transaction
                  will revert.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text3}>
                {trade.tradeType === TradeType.EXACT_INPUT ? (
                  <Trans>Minimum received</Trans>
                ) : (
                  <Trans>Maximum sent</Trans>
                )}{' '}
                <Trans>after slippage</Trans> ({allowedSlippage.toFixed(2)}%)
              </ThemedText.SubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={70}>
            <ThemedText.Black textAlign="right" fontSize={14} color={theme.text3}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? `${trade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${trade.outputAmount.currency.symbol}`
                : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${trade.inputAmount.currency.symbol}`}
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        {!trade?.gasUseEstimateUSD || !chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
          <RowBetween>
            <MouseoverTooltip
              text={
                <Trans>
                  The fee paid to miners who process your transaction. This must be paid in {nativeCurrency.symbol}.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text3}>
                <Trans>Network Fee</Trans>
              </ThemedText.SubHeader>
            </MouseoverTooltip>
            <TextWithLoadingPlaceholder syncing={syncing} width={50}>
              <ThemedText.Black textAlign="right" fontSize={14} color={theme.text3}>
                ~${trade.gasUseEstimateUSD.toFixed(2)}
              </ThemedText.Black>
            </TextWithLoadingPlaceholder>
          </RowBetween>
        )}
      </AutoColumn>
    </StyledCard>
  )
}

export function LegacyAdvancedSwapDetails({
  trade,
  allowedSlippage,
  syncing = false,
  hideInfoTooltips = false,
}: LegacyAdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)
  const { chainId } = useWeb3React()
  const nativeCurrency = useNativeCurrency()
  const realizedLpFeePercent = trade ? computeLegacyRealizedLPFeePercent(trade) : undefined

  const { expectedOutputAmount, priceImpact } = useMemo(() => {
    if (!trade) return { expectedOutputAmount: undefined, priceImpact: undefined }
    const expectedOutputAmount = trade.outputAmount
    const realizedLpFeePercent = computeLegacyRealizedLPFeePercent(trade)
    const priceImpact = getLegacyPriceImpactPercent(realizedLpFeePercent, trade)
    return { expectedOutputAmount, priceImpact }
  }, [trade])

  return !trade ? null : (
    <StyledCard>
      <AutoColumn gap="8px">
        <RowBetween>
          <RowFixed>
            <MouseoverTooltip
              text={
                <Trans>
                  The amount you expect to receive at the current market price. You may receive less or more if the
                  market price changes while your transaction is pending.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text1}>
                <Trans>Expected Output</Trans>
              </ThemedText.SubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={65}>
            <ThemedText.Black textAlign="right" fontSize={14}>
              {expectedOutputAmount
                ? `${expectedOutputAmount.toSignificant(6)}  ${expectedOutputAmount.currency.symbol}`
                : '-'}
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <MouseoverTooltip
              text={<Trans>The impact your trade has on the market price of this pool.</Trans>}
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text1}>
                <Trans>Price Impact</Trans>
              </ThemedText.SubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={50}>
            <ThemedText.Black textAlign="right" fontSize={14}>
              <FormattedPriceImpact priceImpact={priceImpact} />
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <MouseoverTooltip
              text={<Trans>A portion of each trade (0.20%) goes to liquidity providers as a protocol incentive.</Trans>}
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text1}>
                <Trans>Liquidity Provider Fee</Trans>
              </ThemedText.SubHeader>
            </MouseoverTooltip>
          </RowFixed>
          {realizedLpFeePercent && (
            <TextWithLoadingPlaceholder syncing={syncing} width={50}>
              <ThemedText.Black textAlign="right" fontSize={14}>
                ({realizedLpFeePercent.toFixed(2)}%)
              </ThemedText.Black>
            </TextWithLoadingPlaceholder>
          )}
        </RowBetween>
        <Separator />
        <RowBetween>
          <RowFixed style={{ marginRight: '20px' }}>
            <MouseoverTooltip
              text={
                <Trans>
                  The minimum amount you are guaranteed to receive. If the price slips any further, your transaction
                  will revert.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text1}>
                {trade.tradeType === TradeType.EXACT_INPUT ? (
                  <Trans>Minimum received</Trans>
                ) : (
                  <Trans>Maximum sent</Trans>
                )}{' '}
                <Trans>after slippage</Trans> ({allowedSlippage.toFixed(2)}%)
              </ThemedText.SubHeader>
            </MouseoverTooltip>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={70}>
            <ThemedText.Black textAlign="right" fontSize={14} color={theme.text1}>
              {trade.tradeType === TradeType.EXACT_INPUT
                ? `${trade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${trade.outputAmount.currency.symbol}`
                : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${trade.inputAmount.currency.symbol}`}
            </ThemedText.Black>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        {!chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
          <RowBetween>
            <MouseoverTooltip
              text={
                <Trans>
                  The fee paid to miners who process your transaction. This must be paid in {nativeCurrency.symbol}.
                </Trans>
              }
              disableHover={hideInfoTooltips}
            >
              <ThemedText.SubHeader color={theme.text3}>
                <Trans>Network Fee</Trans>
              </ThemedText.SubHeader>
            </MouseoverTooltip>
            <TextWithLoadingPlaceholder syncing={syncing} width={50}>
              <ThemedText.Black textAlign="right" fontSize={14} color={theme.text3}></ThemedText.Black>
            </TextWithLoadingPlaceholder>
          </RowBetween>
        )}
      </AutoColumn>
    </StyledCard>
  )
}

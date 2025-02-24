import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import Card, { OutlineCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { LoadingOpacityContainer } from 'components/Loader/styled'
import Row, { RowBetween, RowFixed } from 'components/Row'
import { MouseoverTooltipContent } from 'components/Tooltip'
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from 'constants/chains'
import { Currency, Percent, TradeType } from 'mevswap/sdk-core'
import { Trade as V2Trade } from 'mevswap/v2-sdk/entities'
import { Info } from 'react-feather'
import { InterfaceTrade } from 'state/routing/types'
import styled, { keyframes, useTheme } from 'styled-components/macro'
import { HideSmall, ThemedText } from 'theme'

import { AdvancedSwapDetails, LegacyAdvancedSwapDetails } from './AdvancedSwapDetails'
import GasEstimateBadge from './GasEstimateBadge'
import { ResponsiveTooltipContainer } from './styleds'
import SwapRoute from './SwapRoute'
import TradePrice from './TradePrice'

const Wrapper = styled(Row)`
  width: 100%;
  justify-content: center;
`

const StyledInfoIcon = styled(Info)`
  height: 16px;
  width: 16px;
  margin-right: 4px;
  color: ${({ theme }) => theme.text3};
`

const StyledCard = styled(OutlineCard)`
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.bg2};
`

const StyledHeaderRow2 = styled(RowBetween)`
  padding: 4px 8px;
  border-radius: 12px;
  align-items: center;
  min-height: 40px;
`

const StyledPolling = styled.div`
  display: flex;
  height: 16px;
  width: 16px;
  margin-right: 2px;
  margin-left: 10px;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  transition: 250ms ease color;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`

const StyledPollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme }) => theme.bg2};
  transition: 250ms ease background-color;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);
  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.text1};
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;
  transition: 250ms ease border-color;
  left: -3px;
  top: -3px;
`

interface SwapDetailsInlineProps {
  trade: InterfaceTrade<Currency, Currency, TradeType> | undefined
  syncing: boolean
  loading: boolean
  showInverted: boolean
  setShowInverted: React.Dispatch<React.SetStateAction<boolean>>
  allowedSlippage: Percent
}

interface LegacySwapDetailsInlineProps {
  trade: V2Trade<Currency, Currency, TradeType> | undefined
  syncing: boolean
  loading: boolean
  showInverted: boolean
  setShowInverted: React.Dispatch<React.SetStateAction<boolean>>
  allowedSlippage: Percent
}

export default function SwapDetailsDropdown({
  trade,
  syncing,
  loading,
  showInverted,
  setShowInverted,
  allowedSlippage,
}: SwapDetailsInlineProps) {
  const theme = useTheme()
  const { chainId } = useWeb3React()

  return (
    <Wrapper>
      <AutoColumn gap={'8px'} style={{ width: '100%', marginBottom: '-8px' }}>
        <StyledHeaderRow2>
          <RowFixed style={{ position: 'relative' }}>
            {loading || syncing ? (
              <StyledPolling>
                <StyledPollingDot>
                  <Spinner />
                </StyledPollingDot>
              </StyledPolling>
            ) : (
              <HideSmall>
                <MouseoverTooltipContent
                  wrap={false}
                  content={
                    <ResponsiveTooltipContainer origin="top right" style={{ padding: '0' }}>
                      <Card padding="12px">
                        <AdvancedSwapDetails
                          trade={trade}
                          allowedSlippage={allowedSlippage}
                          syncing={syncing}
                          hideInfoTooltips={true}
                        />
                      </Card>
                    </ResponsiveTooltipContainer>
                  }
                  placement="bottom"
                >
                  <StyledInfoIcon color={trade ? theme.text3 : theme.bg3} />
                </MouseoverTooltipContent>
              </HideSmall>
            )}
            {trade ? (
              <LoadingOpacityContainer $loading={syncing}>
                <TradePrice
                  price={trade.executionPrice}
                  showInverted={showInverted}
                  setShowInverted={setShowInverted}
                />
              </LoadingOpacityContainer>
            ) : loading || syncing ? (
              <ThemedText.Main fontSize={14}>
                <Trans>Fetching best price...</Trans>
              </ThemedText.Main>
            ) : null}
          </RowFixed>
          <RowFixed>
            {!trade?.gasUseEstimateUSD || !chainId || !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
              <GasEstimateBadge trade={trade} loading={syncing || loading} showRoute={true} disableHover={true} />
            )}
          </RowFixed>
        </StyledHeaderRow2>
        <AutoColumn gap={'8px'} style={{ padding: '0', paddingBottom: '8px' }}>
          {trade ? (
            <StyledCard>
              <AdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} syncing={syncing} />
            </StyledCard>
          ) : null}
          {trade ? <SwapRoute trade={trade} syncing={syncing} /> : null}
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}

export function LegacySwapDetailsDropdown({
  trade,
  syncing,
  loading,
  showInverted,
  setShowInverted,
  allowedSlippage,
}: LegacySwapDetailsInlineProps) {
  const theme = useTheme()

  return (
    <Wrapper>
      <AutoColumn gap={'8px'} style={{ width: '100%', marginBottom: '-8px' }}>
        <StyledHeaderRow2>
          <RowFixed style={{ position: 'relative' }}>
            {loading || syncing ? (
              <StyledPolling>
                <StyledPollingDot>
                  <Spinner />
                </StyledPollingDot>
              </StyledPolling>
            ) : (
              <HideSmall>
                <MouseoverTooltipContent
                  wrap={false}
                  content={
                    <ResponsiveTooltipContainer origin="top right" style={{ padding: '0' }}>
                      <Card padding="12px">
                        <LegacyAdvancedSwapDetails
                          trade={trade}
                          allowedSlippage={allowedSlippage}
                          syncing={syncing}
                          hideInfoTooltips={true}
                        />
                      </Card>
                    </ResponsiveTooltipContainer>
                  }
                  placement="bottom"
                >
                  <StyledInfoIcon color={trade ? theme.text3 : theme.bg3} />
                </MouseoverTooltipContent>
              </HideSmall>
            )}
            {trade ? (
              <LoadingOpacityContainer $loading={syncing}>
                <TradePrice
                  price={trade.executionPrice}
                  showInverted={showInverted}
                  setShowInverted={setShowInverted}
                />
              </LoadingOpacityContainer>
            ) : loading || syncing ? (
              <ThemedText.Main fontSize={14}>
                <Trans>Fetching best price...</Trans>
              </ThemedText.Main>
            ) : null}
          </RowFixed>
        </StyledHeaderRow2>
        <AutoColumn gap={'8px'} style={{ padding: '0', paddingBottom: '8px' }}>
          {trade ? (
            <StyledCard>
              <LegacyAdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} syncing={syncing} />
            </StyledCard>
          ) : null}
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}

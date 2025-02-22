import { Trans } from '@lingui/macro'
import { Currency, Percent, TradeType } from 'mevswap/sdk-core'
import { Trade as V2Trade } from 'mevswap/v2-sdk/entities'
import { ReactNode } from 'react'
import { Text } from 'rebass'
import { InterfaceTrade } from 'state/routing/types'

import { ButtonError } from '../Button'
import { AutoRow } from '../Row'
import { SwapCallbackError } from './styleds'

export default function SwapModalFooter({
  trade,
  allowedSlippage,
  txHash,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: InterfaceTrade<Currency, Currency, TradeType>
  txHash: string | undefined
  allowedSlippage: Percent
  onConfirm: () => void
  swapErrorMessage: ReactNode | undefined
  disabledConfirm: boolean
}) {
  return (
    <>
      <AutoRow>
        <ButtonError onClick={onConfirm} disabled={disabledConfirm} style={{ margin: '10px 0 0 0' }}>
          <Text fontSize={20} fontWeight={500}>
            <Trans>Confirm Swap</Trans>
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}

export function SwapModalFooterV2({
  trade,
  allowedSlippage,
  txHash,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: V2Trade<Currency, Currency, TradeType>
  txHash: string | undefined
  allowedSlippage: Percent
  onConfirm: () => void
  swapErrorMessage: ReactNode | undefined
  disabledConfirm: boolean
}) {
  return (
    <>
      <AutoRow>
        <ButtonError onClick={onConfirm} disabled={disabledConfirm} style={{ margin: '10px 0 0 0' }}>
          <Text fontSize={20} fontWeight={500}>
            <Trans>Confirm Swap</Trans>
          </Text>
        </ButtonError>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}

import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Fraction, Percent } from 'mevswap/sdk-core'
import { Text } from 'rebass'

import { ButtonPrimary } from '../../components/Button'
import CurrencyLogo from '../../components/CurrencyLogo'
import { RowBetween, RowFixed } from '../../components/Row'
import { Field } from '../../state/mint/actions'
import { ThemedText } from '../../theme'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  return (
    <>
      <RowBetween>
        <ThemedText.Body>
          <Trans>{currencies[Field.CURRENCY_A]?.symbol} Deposited</Trans>
        </ThemedText.Body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <ThemedText.Body>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</ThemedText.Body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <ThemedText.Body>
          <Trans>{currencies[Field.CURRENCY_B]?.symbol} Deposited</Trans>
        </ThemedText.Body>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <ThemedText.Body>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</ThemedText.Body>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <ThemedText.Body>
          <Trans>Rates</Trans>
        </ThemedText.Body>
        <ThemedText.Body>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </ThemedText.Body>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <ThemedText.Body>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </ThemedText.Body>
      </RowBetween>
      <RowBetween>
        <ThemedText.Body>
          <Trans>Share of Pool:</Trans>
        </ThemedText.Body>
        <ThemedText.Body>
          <Trans>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Trans>
        </ThemedText.Body>
      </RowBetween>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? <Trans>Create Pool & Supply</Trans> : <Trans>Confirm Supply</Trans>}
        </Text>
      </ButtonPrimary>
    </>
  )
}

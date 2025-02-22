import { Trans } from '@lingui/macro'
import { Currency, Percent, Price } from 'mevswap/sdk-core'
import { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components/macro'

import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants/misc'
import { Field } from '../../state/mint/actions'
import { ThemedText } from '../../theme'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price<Currency, Currency>
}) {
  const theme = useContext(ThemeContext)
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <ThemedText.Black>{price?.toSignificant(6) ?? '-'}</ThemedText.Black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            <Trans>
              {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
            </Trans>
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <ThemedText.Black>{price?.invert()?.toSignificant(6) ?? '-'}</ThemedText.Black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            <Trans>
              {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
            </Trans>
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <ThemedText.Black>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </ThemedText.Black>
          <Text fontWeight={500} fontSize={14} color={theme.text2} pt={1}>
            <Trans>Share of Pool</Trans>
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}

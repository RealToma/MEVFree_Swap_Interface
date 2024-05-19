import { FlexGap, FlexGapProps } from 'components/Layout/Flex'
import { Flex, Skeleton } from 'components/UIKit'
import { FC } from 'react'
import styled from 'styled-components/macro'
import { formatAmount, formatAmountNotation } from 'utils/formatInfoNumbers'

const formatOptions = {
  notation: 'standard' as formatAmountNotation,
  displayThreshold: 0.001,
  tokenPrecision: true,
}

interface TokenDisplayProps extends FlexGapProps {
  value?: number | string
  inputSymbol?: string
  outputSymbol?: string
  format?: boolean
}

export const TokenNameCell = styled.div`
  display: flex;
  gap: 8px;
  font-size: 20px;
  line-height: 28px;
  align-items: center;
`

const PairPriceDisplay: FC<React.PropsWithChildren<TokenDisplayProps>> = ({
  value,
  inputSymbol,
  outputSymbol,
  children,
  format = true,
  ...props
}) => {
  return value ? (
    <FlexGap alignItems="baseline" {...props}>
      <Flex alignItems="inherit">
        {inputSymbol && outputSymbol && <TokenNameCell>{`1 ${inputSymbol} =`} </TokenNameCell>}
        <TokenNameCell>
          {format ? formatAmount(typeof value === 'string' ? parseFloat(value) : value, formatOptions) : value}
        </TokenNameCell>
        {inputSymbol && outputSymbol && <TokenNameCell>{`${outputSymbol}`}</TokenNameCell>}
      </Flex>
      {children}
    </FlexGap>
  ) : (
    <Skeleton height="36px" width="128px" {...props} />
  )
}

export default PairPriceDisplay

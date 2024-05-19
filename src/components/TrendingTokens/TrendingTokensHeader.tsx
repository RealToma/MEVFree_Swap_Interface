import { Trans } from '@lingui/macro'
import styled from 'styled-components/macro'

import { ThemedText } from '../../theme'
import { RowBetween, RowFixed } from '../Row'

const StyledSwapHeader = styled.div`
  padding: 0 0.5rem 0.5rem 0.5rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
  border-style: solid;
  border-width: 0 0 2px 0;
  border-color: ${({ theme }) => theme.white};
  z-index: 1;
`

export default function TrendingTokensHeader() {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <ThemedText.Black fontWeight={500} fontSize={20} style={{ marginRight: '8px' }}>
            <Trans>Trending Tokens</Trans>
          </ThemedText.Black>
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}

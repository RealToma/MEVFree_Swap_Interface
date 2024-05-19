import { Trans } from '@lingui/macro'
import { Percent } from 'mevswap/sdk-core'
import styled from 'styled-components/macro'

import { ThemedText } from '../../theme'
import { RowBetween, RowFixed } from '../Row'
import SettingsTab from '../Settings'

const StyledSwapHeader = styled.div`
  padding: 0 0.5rem 0.5rem 0.5rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: ${({ theme }) => theme.white};
`
const legacyModeSettings = true

export default function LegacySwapHeader({ allowedSlippage }: { allowedSlippage: Percent }) {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <ThemedText.SubHeader fontWeight={500} fontSize={20} style={{ marginRight: '8px' }}>
            <Trans>Trade Tokens</Trans>
          </ThemedText.SubHeader>
        </RowFixed>
        <RowFixed>
          <SettingsTab placeholderSlippage={allowedSlippage} legacyMode={legacyModeSettings} />
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}

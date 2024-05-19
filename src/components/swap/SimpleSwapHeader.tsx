import { Trans } from '@lingui/macro'
import { Percent } from 'mevswap/sdk-core'
import styled from 'styled-components/macro'

import { ThemedText } from '../../theme'
import { RowBetween, RowFixed } from '../Row'
import ScreenshotTab from '../Screenshot'
import SettingsTab from '../Settings'

const StyledSwapHeader = styled.div`
  padding: 0 0.5rem 0.5rem 0.5rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: ${({ theme }) => theme.white};
`

const autoRouterMode = false

export default function SimpleSwapHeader({
  allowedSlippage,
  targetContent,
}: {
  allowedSlippage: Percent
  targetContent: string
}) {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <ThemedText.Black fontWeight={500} fontSize={20} style={{ marginRight: '8px' }}>
            <Trans>Purchase MEVFree Tokens</Trans>
          </ThemedText.Black>
        </RowFixed>
        <RowFixed>
          <ScreenshotTab targetContent={targetContent} />
          <SettingsTab placeholderSlippage={allowedSlippage} legacyMode={autoRouterMode} />
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}

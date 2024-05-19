import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import mevfreeCoin from 'assets/images/MEVFreeCoin500.png'
import Column from 'components/Column'
import { RowBetween } from 'components/Row'
import { memo, useContext } from 'react'
import { useToggleWalletModal } from 'state/application/hooks'
import styled, { ThemeContext } from 'styled-components/macro'
import { ExternalLink } from 'theme'

import { ButtonPrimary } from '../../components/Button'
import Modal from '../Modal'
import { PaddedColumn } from '../SearchModal/styleds'

const Logo = styled.img`
  height: 300px;
  width: 300px;
  margin: auto;
`

const StyledDiv = styled.div`
  margin: auto;
`
const ButtonDiv = styled.div`
  width: 300px;
  margin: auto;
`

const ContentWrapper = styled(Column)`
  width: 100%;
  height: 100%
  position: relative;
  border-style: solid;
  border-width: 2px;
  border-color: ${({ theme }) => theme.mevorange};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 4px;
`

const TokenContentWrapper = styled(Column)`
  width: 100%;
  display: grid;
  position: relative;
  border-style: none;
  height: 100%;
  padding: 0 0 8px 8px;
  overflow-x: hidden;
  overflow-y: auto;
`

// can't be customized under react-router-dom v6
// so we have to persist to the default one, i.e., .active
const activeClassName = 'active'

const StyledExternalLink = styled(ExternalLink)`
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.blue2};
  font-size: 16px;
  width: fit-content;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &.${activeClassName} {
    border-radius: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.mevorange};
    background-color: ${({ theme }) => theme.bg2};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.mevblue};
  }
`

interface TokenInfoModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default memo(function ConnectWalletModal(this: any | null, { isOpen, onDismiss }: TokenInfoModalProps) {
  const { account, chainId } = useWeb3React()

  const theme = useContext(ThemeContext)
  // toggle wallet when disconnected
  const toggleWalletModal = useToggleWalletModal()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={false}>
      <ContentWrapper>
        <PaddedColumn gap="8px">
          <RowBetween>
            <Logo src={mevfreeCoin} />
          </RowBetween>
          <RowBetween>
            <ButtonDiv>
              <ButtonPrimary onClick={toggleWalletModal}>
                <Trans>No Account - Connect Wallet</Trans>
              </ButtonPrimary>
            </ButtonDiv>
          </RowBetween>
        </PaddedColumn>
      </ContentWrapper>
    </Modal>
  )
})

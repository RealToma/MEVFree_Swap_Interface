import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import mevfreeCoin from 'assets/images/MEVFreeCoin500.png'
import Column from 'components/Column'
import { RowBetween } from 'components/Row'
//import { MEVFREE_MAINNET_ADDRESS } from 'constants/addresses'
import { SupportedChainId } from 'constants/chains'
import { Token } from 'mevswap/sdk-core'
import { darken } from 'polished'
import { memo, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { useTokenBalance } from 'state/connection/hooks'
import styled, { ThemeContext } from 'styled-components/macro'

import Modal from '../Modal'
import { PaddedColumn } from '../SearchModal/styleds'

const Logo = styled.img`
  height: 300px;
  width: 300px;
  margin: auto;
`

const StyledDiv = styled.div`
  margin: auto;
  text-align: center;
`
const ButtonDiv = styled.div`
  width: 300px;
  margin: auto;
  justify-self: center;
  background-color: ${({ theme }) => theme.bg0};
  width: fit-content;
  padding: 2px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
  align-items: center;
  background-color: ${({ theme }) => theme.primary1};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
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

const StyledNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.white};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;

  :hover {
    color: ${({ theme }) => theme.mevorange};
  }
`

interface TokenInfoModalProps {
  isOpen: boolean
  onDismiss: () => void
}

export default memo(function LowTokenBalanceModal(this: any | null, { isOpen, onDismiss }: TokenInfoModalProps) {
  const { account, chainId } = useWeb3React()
  const MEVFreeToken = new Token(
    SupportedChainId.MAINNET,
    '0x1936c91190e901b7dd55229a574ae22b58ff498a',
    18,
    'MEVFree',
    'MEVFree'
  )

  const userMEVFreeBalance = useTokenBalance(account ?? undefined, MEVFreeToken)
  const theme = useContext(ThemeContext)
  // toggle wallet when disconnected

  let userMBalance = 0
  userMBalance = Number(userMEVFreeBalance?.toSignificant(4))

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={false}>
      <ContentWrapper>
        <PaddedColumn gap="8px">
          <RowBetween>
            <Logo src={mevfreeCoin} />
          </RowBetween>
          <RowBetween>
            <StyledDiv>
              <Trans>20000 MEVFree Tokens required for access</Trans>
              <br />
              <Trans>Current balance: {userMBalance} MEVFree Tokens</Trans>
            </StyledDiv>
          </RowBetween>
          <RowBetween>
            <ButtonDiv>
              <StyledNavLink id={`simpleswap-nav-link`} to={'/simpleswap'}>
                <Trans>Insufficient MEVFree Balance - Click to Buy</Trans>
              </StyledNavLink>
            </ButtonDiv>
          </RowBetween>
        </PaddedColumn>
      </ContentWrapper>
    </Modal>
  )
})

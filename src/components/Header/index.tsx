import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { useWeb3React } from '@web3-react/core'
//import { MEVFREE_MAINNET_ADDRESS } from 'constants/addresses'
import { getChainInfoOrDefault } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { Token } from 'mevswap/sdk-core'
//import useTheme from 'hooks/useTheme'
import { NavLink, useLocation } from 'react-router-dom'
import { Text } from 'rebass'
import { useNativeCurrencyBalances, useTokenBalance } from 'state/connection/hooks'
import styled from 'styled-components/macro'

//import { ReactComponent as Logo } from '../../assets/svg/logo.svg'
//import { ExternalLink } from '../../theme'
import Menu from '../Menu'
import Row from '../Row'
import Web3Status from '../Web3Status'
//import HolidayOrnament from './HolidayOrnament'
import NetworkSelector from './NetworkSelector'
import RouterSelector from './RouterSelector'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  padding: 16px 8px 16px 8px;
  z-index: 21;
  position: fixed;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 1fr 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr 1fr;
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`

const HeaderElement = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  align-items: center;

  &:not(:first-child) {
    margin-left: 0.5em;
  }

  /* addresses safaris lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const NetworkHeaderElement = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  align-items: center;

  &:not(:first-child) {
    margin-left: 0.5em;
  }

  /* addresses safaris lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: row;
  justify-content: space-between;
  justify-self: center;
  z-index: 99;
  position: fixed;
  bottom: 0; right: 85%;
  transform: translate(50%,-50%);
  margin: 0 auto;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg0};
  border: 2px solid ${({ theme }) => theme.mevblue};
  box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};
`

const RouterHeaderElement = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  align-items: center;

  &:not(:first-child) {
    margin-left: 0.5em;
  }

  /* addresses safaris lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: row;
  justify-content: space-between;
  justify-self: center;
  z-index: 99;
  position: fixed;
  bottom: 0; right: 15%;
  transform: translate(50%,-50%);
  margin: 0 auto;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg0};
  border: 2px solid ${({ theme }) => theme.mevblue};
  box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};
`

const HeaderLinks = styled(Row)`
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
  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    z-index: 99;
    position: fixed;
    bottom: 0; right: 50%;
    transform: translate(50%,-50%);
    margin: 0 auto;
    background-color: ${({ theme }) => theme.bg0};
    border: 2px solid ${({ theme }) => theme.mevblue};
    box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg0 : theme.bg0)};
  border-radius: 16px;
  white-space: nowrap;
  width: 100%;
  height: 40px;

  :focus {
    border: 1px solid blue;
  }
`

const BalanceText = styled(Text)`
  font-size: 18px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
  width: 120px;
  height: 25px;
`

//const UniIcon = styled.div`
//  transition: transform 0.3s ease;
//  :hover {
//    transform: rotate(-5deg);
//  }

//  position: relative;
//`

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
  color: ${({ theme }) => theme.text2};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;
  justify-content: center;
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

  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 7px 8px 7px 8px;
  `};
`

const StyledMiddleNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;
  justify-content: center;
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

  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 7px 8px 7px 8px;
  `};
`

const StyledHomeLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;

  :hover,
  :focus {
    color: ${({ theme }) => theme.mevblue};
  }
`

export default function Header() {
  const { account, chainId } = useWeb3React()
  const MEVFreeToken = new Token(
    SupportedChainId.MAINNET,
    '0x1936c91190e901b7dd55229a574ae22b58ff498a',
    18,
    'MEVFree',
    'MEVFree'
  )

  const userEthBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']
  const userMEVFreeBalance = useTokenBalance(account ? account : undefined, MEVFreeToken)
  let userMBalance = 0
  userMBalance = Number(userMEVFreeBalance?.toSignificant(4))

  //console.log('Header userMBalance: ', userMBalance)

  const scrollY = useScrollPosition()

  const { pathname } = useLocation()

  const {
    nativeCurrency: { symbol: nativeCurrencySymbol },
  } = getChainInfoOrDefault(chainId)

  // work around https://github.com/remix-run/react-router/issues/8161
  // as we can't pass function `({isActive}) => ''` to className with styled-components
  const isPoolActive =
    pathname.startsWith('/pool') ||
    pathname.startsWith('/add') ||
    pathname.startsWith('/remove') ||
    pathname.startsWith('/increase') ||
    pathname.startsWith('/find')

  const isHomeActive = pathname.startsWith('/home')
  const isSwapActive = pathname.startsWith('/swap')

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <StyledHomeLink id={`swap-nav-link`} to={'/home'}>
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjAxJyBoZWlnaHQ9JzI2JyB2aWV3Qm94PScwIDAgMjAxIDI2JyBmaWxsPSdub25lJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPgo8cGF0aCBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGNsaXAtcnVsZT0nZXZlbm9kZCcgZD0nTTEzNiAwLjQzNTU0N1Y5LjU3MDk3SDIwMC43NzhWMC40MzU1NDdIMTM2Wk0xNzAuMDUgMS4yNjYwNEgxMzYuODNWOC43NDA0OEgxNzAuMDVWMS4yNjYwNFpNMTM5LjE2IDUuMzAwODlWNC42Njg4SDE0MC4xMDlWMy43MjA3SDE0MC43NDFWNC42Njg4SDE0MS42ODlWNS4zMDA4OUgxNDAuNzQxVjYuMjQ5MDZIMTQwLjEwOUwxNDAuMTA5IDUuMzAwODlIMTM5LjE2Wk0xNTYuOTkyIDIyLjIzOVYyMy4zNTgzQzE1Ni45OTIgMjMuNjYxIDE1Ni45NTcgMjMuOTI5MiAxNTYuODg1IDI0LjE2MjhDMTU2LjgxNiAyNC4zOTQyIDE1Ni43MTUgMjQuNTg3OCAxNTYuNTgzIDI0Ljc0MzVDMTU2LjQ1NCAyNC45MDM1IDE1Ni4yOTQgMjUuMDI0NyAxNTYuMTAzIDI1LjEwNjhDMTU1LjkxNSAyNS4xODY5IDE1NS43MDEgMjUuMjI2OSAxNTUuNDYxIDI1LjIyNjlDMTU1LjIyMyAyNS4yMjY5IDE1NS4wMDkgMjUuMTg2OSAxNTQuODE5IDI1LjEwNjhDMTU0LjYyOCAyNS4wMjQ3IDE1NC40NjcgMjQuOTAzNSAxNTQuMzM1IDI0Ljc0MzVDMTU0LjIwMSAyNC41ODc4IDE1NC4wOTggMjQuMzk0MiAxNTQuMDI3IDI0LjE2MjhDMTUzLjk1OCAyMy45MjkyIDE1My45MjMgMjMuNjYxIDE1My45MjMgMjMuMzU4M1YyMi4yMzlDMTUzLjkyMyAyMS45MzYzIDE1My45NTggMjEuNjY5MiAxNTQuMDI3IDIxLjQzNzdDMTU0LjA5OCAyMS4yMDQyIDE1NC4yIDIxLjAwNzQgMTU0LjMzMiAyMC44NDczQzE1NC40NjQgMjAuNjg5NCAxNTQuNjI0IDIwLjU3MDUgMTU0LjgxMiAyMC40OTA1QzE1NS4wMDIgMjAuNDA4MyAxNTUuMjE3IDIwLjM2NzIgMTU1LjQ1NSAyMC4zNjcyQzE1NS42OTUgMjAuMzY3MiAxNTUuOTA5IDIwLjQwODMgMTU2LjA5NyAyMC40OTA1QzE1Ni4yODcgMjAuNTcwNSAxNTYuNDQ5IDIwLjY4OTQgMTU2LjU4MyAyMC44NDczQzE1Ni43MTMgMjEuMDA3NCAxNTYuODE0IDIxLjIwNDIgMTU2Ljg4NSAyMS40Mzc3QzE1Ni45NTcgMjEuNjY5MiAxNTYuOTkyIDIxLjkzNjMgMTU2Ljk5MiAyMi4yMzlaTTE1NC43MDIgMjIuOTIzNVYyMy4wODI1TDE1Ni4yMDQgMjEuOTQzOEMxNTYuMTk1IDIxLjc3NTEgMTU2LjE3MSAyMS42MjkxIDE1Ni4xMzMgMjEuNTA1OUMxNTYuMDk2IDIxLjM4MjYgMTU2LjA0MyAyMS4yODIgMTU1Ljk3NCAyMS4yMDQyQzE1NS45MTMgMjEuMTM1IDE1NS44MzggMjEuMDgzMSAxNTUuNzUgMjEuMDQ4NUMxNTUuNjYzIDIxLjAxMzggMTU1LjU2NSAyMC45OTY1IDE1NS40NTUgMjAuOTk2NUMxNTUuMzM2IDIwLjk5NjUgMTU1LjIzMSAyMS4wMTcxIDE1NS4xNCAyMS4wNTgyQzE1NS4wNDkgMjEuMDk5MyAxNTQuOTczIDIxLjE1OTggMTU0LjkxMyAyMS4yMzk5QzE1NC44NDEgMjEuMzMwNyAxNTQuNzg4IDIxLjQ0ODYgMTU0Ljc1NCAyMS41OTM1QzE1NC43MTkgMjEuNzM2MiAxNTQuNzAyIDIxLjkwNDkgMTU0LjcwMiAyMi4wOTk1VjIyLjczNTRWMjIuOTIzNVpNMTU2LjE1NSAyNC4wMDcxQzE1Ni4xOTIgMjMuODYgMTU2LjIxIDIzLjY4NyAxNTYuMjEgMjMuNDg4VjIyLjg5MTFWMjIuNzIyNFYyMi41NDA3TDE1NC43MDggMjMuNjcyOUMxNTQuNzE5IDIzLjgyMjIgMTU0Ljc0MiAyMy45NTQxIDE1NC43NzYgMjQuMDY4N0MxNTQuODEzIDI0LjE4MzMgMTU0Ljg2MiAyNC4yNzg1IDE1NC45MjIgMjQuMzU0MkMxNTQuOTgzIDI0LjQzNjQgMTU1LjA1OCAyNC40OTggMTU1LjE0NiAyNC41MzkxQzE1NS4yMzcgMjQuNTgwMiAxNTUuMzQyIDI0LjYwMDggMTU1LjQ2MSAyNC42MDA4QzE1NS41NzggMjQuNjAwOCAxNTUuNjgxIDI0LjU4MTMgMTU1Ljc2OSAyNC41NDI0QzE1NS44NTggMjQuNTAxMyAxNTUuOTM0IDI0LjQ0MTggMTU1Ljk5NiAyNC4zNjM5QzE1Ni4wNjggMjQuMjczMSAxNTYuMTIxIDI0LjE1NDIgMTU2LjE1NSAyNC4wMDcxWk0xMzguMzc0IDI1LjU2NDNMMTQwLjIyNiAyMC40MzUzSDEzOS41MTZMMTM3LjY2IDI1LjU2NDNIMTM4LjM3NFpNMTQzLjg5MiAyNS41NjQzTDE0NS43NDUgMjAuNDM1M0gxNDUuMDM0TDE0My4xNzkgMjUuNTY0M0gxNDMuODkyWk0xNjEuMDAyIDIyLjE5NjlMMTYwLjEgMjAuNDM1M0gxNTkuMTg5TDE2MC41MzUgMjIuNzc3NkwxNTkuMTUzIDI1LjE1ODdIMTYwLjA3NEwxNjEuMDE1IDIzLjM2OEwxNjEuOTU5IDI1LjE1ODdIMTYyLjg2N0wxNjEuNDg5IDIyLjc3NzZMMTYyLjgzNSAyMC40MzUzSDE2MS45MkwxNjEuMDAyIDIyLjE5NjlaTTE2Ni44NjQgMjUuMTU4N0gxNjYuMTA1TDE2NC42NTIgMjAuNDM1M0gxNjUuNTA1TDE2Ni40MDQgMjMuNzA1NEwxNjYuNDgyIDIzLjk4NzZMMTY2LjU2MyAyMy43MDIxTDE2Ny40NjggMjAuNDM1M0gxNjguMzE4TDE2Ni44NjQgMjUuMTU4N1pNMTczLjI3NSAyMy4wNDAzVjIyLjQxMUgxNzEuMzIyVjIxLjA4MDlIMTczLjU4NlYyMC40MzUzSDE3MC41NFYyNS4xNTg3SDE3My42MDJWMjQuNTE2NEgxNzEuMzIyVjIzLjA0MDNIMTczLjI3NVpNMTc2Ljg1NiAyMy4wNTY2VjIyLjQ0NjdIMTc3LjMyQzE3Ny40NTkgMjIuNDQ2NyAxNzcuNTggMjIuNDI4MyAxNzcuNjg0IDIyLjM5MTVDMTc3Ljc4OCAyMi4zNTI2IDE3Ny44NzMgMjIuMjk4NSAxNzcuOTQgMjIuMjI5M0MxNzguMDAzIDIyLjE2ODggMTc4LjA1IDIyLjA5NDEgMTc4LjA4MyAyMi4wMDU1QzE3OC4xMTcgMjEuOTE0NiAxNzguMTM1IDIxLjgxNzMgMTc4LjEzNSAyMS43MTM1QzE3OC4xMzUgMjEuNjAxIDE3OC4xMTggMjEuNTAwNSAxNzguMDg2IDIxLjQxMThDMTc4LjA1NiAyMS4zMjMxIDE3OC4wMSAyMS4yNDc0IDE3Ny45NSAyMS4xODQ3QzE3Ny44ODkgMjEuMTI2MyAxNzcuODEyIDIxLjA4MDkgMTc3LjcxOSAyMS4wNDg1QzE3Ny42MjkgMjEuMDE2IDE3Ny41MjQgMjAuOTk5OCAxNzcuNDA1IDIwLjk5OThDMTc3LjI5OSAyMC45OTk4IDE3Ny4yIDIxLjAxNiAxNzcuMTA5IDIxLjA0ODVDMTc3LjAyMSAyMS4wNzg3IDE3Ni45NDQgMjEuMTIzMSAxNzYuODc5IDIxLjE4MTVDMTc2LjgxMiAyMS4yMzk5IDE3Ni43NTkgMjEuMzEwMSAxNzYuNzIgMjEuMzkyM0MxNzYuNjgzIDIxLjQ3NDUgMTc2LjY2NSAyMS41NjY0IDE3Ni42NjUgMjEuNjY4MUgxNzUuODlDMTc1Ljg5IDIxLjQ3OTkgMTc1LjkyOCAyMS4zMDY5IDE3Ni4wMDMgMjEuMTQ5QzE3Ni4wNzkgMjAuOTkxMSAxNzYuMTg0IDIwLjg1MzggMTc2LjMxOCAyMC43MzdDMTc2LjQ1MiAyMC42MjI0IDE3Ni42MSAyMC41MzI2IDE3Ni43OTIgMjAuNDY3OEMxNzYuOTc1IDIwLjQwMjkgMTc3LjE3NyAyMC4zNzA0IDE3Ny4zOTUgMjAuMzcwNEMxNzcuNjE4IDIwLjM3MDQgMTc3LjgyMiAyMC4zOTk2IDE3OC4wMDggMjAuNDU4QzE3OC4xOTYgMjAuNTE0MyAxNzguMzU2IDIwLjU5ODYgMTc4LjQ4OCAyMC43MTExQzE3OC42MjIgMjAuODI1NyAxNzguNzI2IDIwLjk2NjMgMTc4LjggMjEuMTMyOEMxNzguODczIDIxLjI5OTMgMTc4LjkxIDIxLjQ5MjkgMTc4LjkxIDIxLjcxMzVDMTc4LjkxIDIxLjgxMDggMTc4Ljg5NSAyMS45MDgxIDE3OC44NjUgMjIuMDA1NUMxNzguODM2IDIyLjEwMjggMTc4Ljc5MyAyMi4xOTY5IDE3OC43MzUgMjIuMjg3N0MxNzguNjc2IDIyLjM3NjQgMTc4LjYwMyAyMi40NTk2IDE3OC41MTQgMjIuNTM3NUMxNzguNDI2IDIyLjYxNTQgMTc4LjMyMiAyMi42ODEzIDE3OC4yMDMgMjIuNzM1NEMxNzguMzQzIDIyLjc4MyAxNzguNDYyIDIyLjg0NTcgMTc4LjU2IDIyLjkyMzVDMTc4LjY1OSAyMi45OTkyIDE3OC43NCAyMy4wODQ3IDE3OC44MDMgMjMuMTc5OEMxNzguODY2IDIzLjI3NzIgMTc4LjkxMSAyMy4zODIxIDE3OC45MzkgMjMuNDk0NUMxNzguOTY3IDIzLjYwNDggMTc4Ljk4MSAyMy43MTk0IDE3OC45ODEgMjMuODM4NEMxNzguOTgxIDI0LjA1OSAxNzguOTQgMjQuMjU1OCAxNzguODU4IDI0LjQyODhDMTc4Ljc3OCAyNC41OTk3IDE3OC42NjggMjQuNzQzNSAxNzguNTI3IDI0Ljg2MDNDMTc4LjM4NCAyNC45NzkyIDE3OC4yMTYgMjUuMDcwMSAxNzguMDIxIDI1LjEzMjhDMTc3LjgyOSAyNS4xOTMzIDE3Ny42MiAyNS4yMjM2IDE3Ny4zOTUgMjUuMjIzNkMxNzcuMTkyIDI1LjIyMzYgMTc2Ljk5NiAyNS4xOTU1IDE3Ni44MDggMjUuMTM5M0MxNzYuNjIgMjUuMDgzIDE3Ni40NTQgMjQuOTk4NyAxNzYuMzExIDI0Ljg4NjJDMTc2LjE2OSAyNC43NzM4IDE3Ni4wNTQgMjQuNjM1NCAxNzUuOTY4IDI0LjQ3MUMxNzUuODgzIDI0LjMwNDUgMTc1Ljg0MSAyNC4xMTA5IDE3NS44NDEgMjMuODkwM0gxNzYuNjE2QzE3Ni42MTYgMjMuOTk0MSAxNzYuNjM1IDI0LjA5MDMgMTc2LjY3MiAyNC4xNzlDMTc2LjcxIDI0LjI2NTUgMTc2Ljc2NiAyNC4zMzkxIDE3Ni44MzcgMjQuMzk5NkMxNzYuOTA2IDI0LjQ2MjMgMTc2Ljk4OCAyNC41MTEgMTc3LjA4NCAyNC41NDU2QzE3Ny4xODEgMjQuNTgwMiAxNzcuMjg4IDI0LjU5NzUgMTc3LjQwNSAyNC41OTc1QzE3Ny41MyAyNC41OTc1IDE3Ny42NDMgMjQuNTgxMyAxNzcuNzQyIDI0LjU0ODlDMTc3Ljg0NCAyNC41MTQyIDE3Ny45MjkgMjQuNDYzNCAxNzcuOTk4IDI0LjM5NjRDMTc4LjA2NSAyNC4zMzM3IDE3OC4xMTYgMjQuMjU1OCAxNzguMTUxIDI0LjE2MjhDMTc4LjE4OCAyNC4wNjc2IDE3OC4yMDYgMjMuOTU5NSAxNzguMjA2IDIzLjgzODRDMTc4LjIwNiAyMy43MDIxIDE3OC4xODUgMjMuNTg1MyAxNzguMTQ0IDIzLjQ4OEMxNzguMTAzIDIzLjM5MDcgMTc4LjA0NCAyMy4zMDk2IDE3Ny45NjYgMjMuMjQ0N0MxNzcuODg4IDIzLjE4MiAxNzcuNzk0IDIzLjEzNTUgMTc3LjY4NCAyMy4xMDUyQzE3Ny41NzYgMjMuMDcyOCAxNzcuNDU0IDIzLjA1NjYgMTc3LjMyIDIzLjA1NjZIMTc2Ljg1NlpNMTg0LjU4NCAyMy4zNTgzVjIyLjIzOUMxODQuNTg0IDIxLjkzNjMgMTg0LjU0OCAyMS42NjkyIDE4NC40NzcgMjEuNDM3N0MxODQuNDA2IDIxLjIwNDIgMTg0LjMwNSAyMS4wMDc0IDE4NC4xNzUgMjAuODQ3M0MxODQuMDQxIDIwLjY4OTQgMTgzLjg3OSAyMC41NzA1IDE4My42ODkgMjAuNDkwNUMxODMuNTAxIDIwLjQwODMgMTgzLjI4NiAyMC4zNjcyIDE4My4wNDYgMjAuMzY3MkMxODIuODA4IDIwLjM2NzIgMTgyLjU5NCAyMC40MDgzIDE4Mi40MDQgMjAuNDkwNUMxODIuMjE2IDIwLjU3MDUgMTgyLjA1NiAyMC42ODk0IDE4MS45MjQgMjAuODQ3M0MxODEuNzkyIDIxLjAwNzQgMTgxLjY5IDIxLjIwNDIgMTgxLjYxOSAyMS40Mzc3QzE4MS41NSAyMS42NjkyIDE4MS41MTUgMjEuOTM2MyAxODEuNTE1IDIyLjIzOVYyMy4zNTgzQzE4MS41MTUgMjMuNjYxIDE4MS41NSAyMy45MjkyIDE4MS42MTkgMjQuMTYyOEMxODEuNjkgMjQuMzk0MiAxODEuNzkzIDI0LjU4NzggMTgxLjkyNyAyNC43NDM1QzE4Mi4wNTkgMjQuOTAzNSAxODIuMjIgMjUuMDI0NyAxODIuNDExIDI1LjEwNjhDMTgyLjYwMSAyNS4xODY5IDE4Mi44MTUgMjUuMjI2OSAxODMuMDUzIDI1LjIyNjlDMTgzLjI5MyAyNS4yMjY5IDE4My41MDcgMjUuMTg2OSAxODMuNjk1IDI1LjEwNjhDMTgzLjg4NSAyNS4wMjQ3IDE4NC4wNDYgMjQuOTAzNSAxODQuMTc1IDI0Ljc0MzVDMTg0LjMwNyAyNC41ODc4IDE4NC40MDggMjQuMzk0MiAxODQuNDc3IDI0LjE2MjhDMTg0LjU0OCAyMy45MjkyIDE4NC41ODQgMjMuNjYxIDE4NC41ODQgMjMuMzU4M1pNMTgyLjI5NCAyMy4wODI1VjIyLjkyMzVWMjIuNzM1NFYyMi4wOTk1QzE4Mi4yOTQgMjEuOTA0OSAxODIuMzExIDIxLjczNjIgMTgyLjM0NiAyMS41OTM1QzE4Mi4zOCAyMS40NDg2IDE4Mi40MzMgMjEuMzMwNyAxODIuNTA1IDIxLjIzOTlDMTgyLjU2NSAyMS4xNTk4IDE4Mi42NDEgMjEuMDk5MyAxODIuNzMyIDIxLjA1ODJDMTgyLjgyMyAyMS4wMTcxIDE4Mi45MjcgMjAuOTk2NSAxODMuMDQ2IDIwLjk5NjVDMTgzLjE1NyAyMC45OTY1IDE4My4yNTUgMjEuMDEzOCAxODMuMzQyIDIxLjA0ODVDMTgzLjQzIDIxLjA4MzEgMTgzLjUwNSAyMS4xMzUgMTgzLjU2NSAyMS4yMDQyQzE4My42MzUgMjEuMjgyIDE4My42ODggMjEuMzgyNiAxODMuNzI0IDIxLjUwNTlDMTgzLjc2MyAyMS42MjkxIDE4My43ODcgMjEuNzc1MSAxODMuNzk2IDIxLjk0MzhMMTgyLjI5NCAyMy4wODI1Wk0xODMuODAyIDIzLjQ4OEMxODMuODAyIDIzLjY4NyAxODMuNzg0IDIzLjg2IDE4My43NDcgMjQuMDA3MUMxODMuNzEyIDI0LjE1NDIgMTgzLjY1OSAyNC4yNzMxIDE4My41ODggMjQuMzYzOUMxODMuNTI1IDI0LjQ0MTggMTgzLjQ1IDI0LjUwMTMgMTgzLjM2MSAyNC41NDI0QzE4My4yNzIgMjQuNTgxMyAxODMuMTcgMjQuNjAwOCAxODMuMDUzIDI0LjYwMDhDMTgyLjkzNCAyNC42MDA4IDE4Mi44MjkgMjQuNTgwMiAxODIuNzM4IDI0LjUzOTFDMTgyLjY0OSAyNC40OTggMTgyLjU3NSAyNC40MzY0IDE4Mi41MTQgMjQuMzU0MkMxODIuNDU0IDI0LjI3ODUgMTgyLjQwNSAyNC4xODMzIDE4Mi4zNjggMjQuMDY4N0MxODIuMzM0IDIzLjk1NDEgMTgyLjMxMSAyMy44MjIyIDE4Mi4zIDIzLjY3MjlMMTgzLjgwMiAyMi41NDA3VjIyLjcyMjRWMjIuODkxMVYyMy40ODhaTTE4OC45MzggMjUuMTU4N0gxODguMTc5TDE4Ni43MjUgMjAuNDM1M0gxODcuNTc5TDE4OC40NzcgMjMuNzA1NEwxODguNTU1IDIzLjk4NzZMMTg4LjYzNiAyMy43MDIxTDE4OS41NDEgMjAuNDM1M0gxOTAuMzkxTDE4OC45MzggMjUuMTU4N1pNMTk1LjE0MSAyMy40NzVWMjAuNDM1M0gxOTQuMzQzTDE5Mi4zMDIgMjMuNjI3NUwxOTIuMzIyIDI0LjEwNDRIMTk0LjM2NVYyNS4xNTg3SDE5NS4xNDFWMjQuMTA0NEgxOTUuNzM0VjIzLjQ3NUgxOTUuMTQxWk0xOTMuMDk0IDIzLjQ3NUwxOTQuMjc0IDIxLjY0MjFMMTk0LjM2NSAyMS40NzM0VjIzLjQ3NUgxOTMuMDk0Wk0yMDAuMjA4IDIwLjQzNTNWMjUuMTU4N0gxOTkuNDI2VjIxLjM5NTZMMTk4LjIxNiAyMS44NFYyMS4xNTU1TDIwMC4xNTkgMjAuNDM1M0gyMDAuMjA4WicgZmlsbD0nd2hpdGUnIGZpbGwtb3BhY2l0eT0nMC4yNScvPgo8cGF0aCBkPSdNMCAyNlYwSDQuNTEwNTNMNi4xNzkyNiAxMC41M0w3LjE1NDA2IDIzLjY2SDcuODE0OTVMOC43NTY3MSAxMC41M0wxMC40NDIgMEgxNC45NTI1VjI2SDEyLjQwODFWMTguMzYyNUwxMi44NzA3IDIuMjQyNUgxMi4wOTQyTDEwLjM5MjQgMTguNDkyNUw5LjA4NzE1IDI1LjkwMjVINS44NDg4Mkw0LjU3NjYyIDE4LjQ5MjVMMi44NTgzMiAyLjI0MjVIMi4xMTQ4M0wyLjU0NDQgMTguMzYyNVYyNkgwWicgZmlsbD0nd2hpdGUnLz4KPHBhdGggZD0nTTI0Ljk3MDMgMjZWMEgzMi45MzM5VjIuMjQyNUgyNy40OTgyVjExLjc2NUgzMi42MDM1VjE0LjAwNzVIMjcuNDk4MlYyMy43NTc1SDMyLjkzMzlWMjZIMjQuOTcwM1onIGZpbGw9J3doaXRlJy8+CjxwYXRoIGQ9J000NC4wMDE0IDI2TDQxLjA3NyAwSDQzLjcyMDVMNDUuMjI0IDE0LjNMNDUuODUxOSAyMy43NTc1SDQ2Ljc0NDFMNDcuMzcxOSAxNC4zTDQ4Ljg3NTQgMEg1MS41MzU1TDQ4LjU5NDYgMjZINDQuMDAxNFonIGZpbGw9J3doaXRlJy8+CjxwYXRoIGQ9J002MC42MTU0IDI2VjBINjguNTc5MVYyLjI0MjVINjMuMTQzM1YxMS43NjVINjguMjQ4NlYxNC4wMDc1SDYzLjE0MzNWMjZINjAuNjE1NFonIGZpbGw9J3doaXRlJy8+CjxwYXRoIGQ9J003Ny40MjE1IDI2VjBIODEuNzMzN0M4My4zNTI5IDAgODQuNTI2IDAuMzQ2NjY3IDg1LjI1MjkgMS4wNEM4NS45Nzk5IDEuNzMzMzMgODYuMzc2NCAyLjg3NjI1IDg2LjQ0MjUgNC40Njg3NUM4Ni40NzU2IDUuMzg5NTggODYuNDk3NiA2LjI1NjI1IDg2LjUwODYgNy4wNjg3NUM4Ni41MTk2IDcuODgxMjUgODYuNTE5NiA4LjY3MjA4IDg2LjUwODYgOS40NDEyNUM4Ni40OTc2IDEwLjE5OTYgODYuNDc1NiAxMC45NjMzIDg2LjQ0MjUgMTEuNzMyNUM4Ni4zOTg1IDEyLjgyNjcgODYuMjAwMiAxMy43MDQyIDg1Ljg0NzcgMTQuMzY1Qzg1LjQ5NTMgMTUuMDI1OCA4NC45NSAxNS41MDI1IDg0LjIxMiAxNS43OTVMODYuOTM4MiAyNkg4NC4yMjg2TDgxLjc4MzMgMTYuMjE3NUg3OS45NDk0VjI2SDc3LjQyMTVaTTc5Ljk0OTQgMTMuOTc1SDgxLjcxNzJDODIuNDU1MiAxMy45NzUgODIuOTk0OSAxMy44MDE3IDgzLjMzNjQgMTMuNDU1QzgzLjY3NzggMTMuMTA4MyA4My44NjUxIDEyLjU3MjEgODMuODk4MSAxMS44NDYyQzgzLjkzMTIgMTEuMDMzNyA4My45NTMyIDEwLjIwNSA4My45NjQyIDkuMzZDODMuOTc1MiA4LjUxNSA4My45NzUyIDcuNjc1NDIgODMuOTY0MiA2Ljg0MTI1QzgzLjk1MzIgNS45OTYyNSA4My45MzEyIDUuMTY3NSA4My44OTgxIDQuMzU1QzgzLjg2NTEgMy42MjkxNyA4My42Nzc4IDMuMDk4MzMgODMuMzM2NCAyLjc2MjVDODMuMDA1OSAyLjQxNTgzIDgyLjQ3MTcgMi4yNDI1IDgxLjczMzcgMi4yNDI1SDc5Ljk0OTRWMTMuOTc1WicgZmlsbD0nd2hpdGUnLz4KPHBhdGggZD0nTTk2LjA2NjkgMjZWMEgxMDQuMDMxVjIuMjQyNUg5OC41OTQ4VjExLjc2NUgxMDMuN1YxNC4wMDc1SDk4LjU5NDhWMjMuNzU3NUgxMDQuMDMxVjI2SDk2LjA2NjlaJyBmaWxsPSd3aGl0ZScvPgo8cGF0aCBkPSdNMTEzLjA5OSAyNlYwSDEyMS4wNjJWMi4yNDI1SDExNS42MjdWMTEuNzY1SDEyMC43MzJWMTQuMDA3NUgxMTUuNjI3VjIzLjc1NzVIMTIxLjA2MlYyNkgxMTMuMDk5WicgZmlsbD0nd2hpdGUnLz4KPC9zdmc+Cg=="
          alt="logocontainer694877"
          className="home-logo"
        />
      </StyledHomeLink>
      <HeaderLinks>
        <StyledNavLink id={`swap-nav-link`} to={'/home'}>
          <Trans>Home</Trans>
        </StyledNavLink>
        <StyledMiddleNavLink id={`swap-nav-link`} to={'/swap'}>
          <Trans>Swap</Trans>
        </StyledMiddleNavLink>
        <StyledNavLink id={`pool-nav-link`} to={'/pool'} className={isPoolActive ? activeClassName : undefined}>
          <Trans>Pools</Trans>
        </StyledNavLink>
      </HeaderLinks>

      <HeaderControls>
        <NetworkHeaderElement>
          <NetworkSelector />
        </NetworkHeaderElement>
        <RouterHeaderElement>
          <RouterSelector />
        </RouterHeaderElement>
        <HeaderElement>
          <AccountElement active={!!account}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0, userSelect: 'none' }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                <Trans>
                  {userEthBalance?.toSignificant(4)} {nativeCurrencySymbol}
                </Trans>
              </BalanceText>
            ) : null}
            {account && chainId === SupportedChainId.MAINNET ? (
              <BalanceText style={{ flexShrink: 0, userSelect: 'none' }} pr="0.5rem" fontWeight={500}>
                <Trans>{userMBalance} MEVFree</Trans>
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElement>
          <Menu />
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}

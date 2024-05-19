import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { CHAIN_INFO } from 'constants/chainInfo'
import { SupportedChainId } from 'constants/chains'
import { ArrowUpRight } from 'react-feather'
import styled from 'styled-components/macro'
import { ExternalLink, HideSmall } from 'theme'

import { AutoRow } from '../Row'

const L2Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 16px;
`

export const Controls = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  padding: 0 20px 20px 20px;
`

const BodyText = styled.div`
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 8px;
  font-size: 14px;
`
const RootWrapper = styled.div`
  position: relative;
  margin-top: 16px;
`

const SHOULD_SHOW_ALERT = {
  [SupportedChainId.OPTIMISM]: true,
  [SupportedChainId.OPTIMISTIC_KOVAN]: true,
  [SupportedChainId.ARBITRUM_ONE]: true,
  [SupportedChainId.ARBITRUM_RINKEBY]: true,
  [SupportedChainId.POLYGON]: true,
  [SupportedChainId.POLYGON_MUMBAI]: true,
  [SupportedChainId.CELO]: true,
  [SupportedChainId.CELO_ALFAJORES]: true,
}

type NetworkAlertChains = keyof typeof SHOULD_SHOW_ALERT

const ContentWrapper = styled.div<{ chainId: NetworkAlertChains; logoUrl: string }>`
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
  width: 100%;

  :before {
    background-image: url(${({ logoUrl }) => logoUrl});
    background-repeat: no-repeat;
    background-size: 300px;
    content: '';
    height: 300px;
    opacity: 0.1;
    position: absolute;
    transform: rotate(25deg) translate(-90px, -40px);
    width: 300px;
    z-index: -1;
  }
`
const Header = styled.h2`
  font-weight: 600;
  font-size: 16px;
  margin: 0;
`

const LinkOutToBridge = styled(ExternalLink)`
  align-items: center;
  border-radius: 8px;
  color: white;
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  padding: 6px 8px;
  margin-right: 12px;
  text-decoration: none !important;
  width: 100%;
`

const StyledArrowUpRight = styled(ArrowUpRight)`
  margin-left: 12px;
  width: 24px;
  height: 24px;
`

const TEXT_COLORS: { [chainId in NetworkAlertChains]: string } = {
  [SupportedChainId.POLYGON]: 'rgba(130, 71, 229)',
  [SupportedChainId.POLYGON_MUMBAI]: 'rgba(130, 71, 229)',
  [SupportedChainId.CELO]: 'rgba(53, 178, 97)',
  [SupportedChainId.CELO_ALFAJORES]: 'rgba(53, 178, 97)',
  [SupportedChainId.OPTIMISM]: '#ff3856',
  [SupportedChainId.OPTIMISTIC_KOVAN]: '#ff3856',
  [SupportedChainId.ARBITRUM_ONE]: '#0490ed',
  [SupportedChainId.ARBITRUM_RINKEBY]: '#0490ed',
}

function shouldShowAlert(chainId: number | undefined): chainId is NetworkAlertChains {
  return Boolean(chainId && SHOULD_SHOW_ALERT[chainId as unknown as NetworkAlertChains])
}

export function NetworkAlert() {
  const { chainId } = useWeb3React()

  if (!shouldShowAlert(chainId)) {
    return null
  }

  const { label, logoUrl, bridge } = CHAIN_INFO[chainId]
  const textColor = TEXT_COLORS[chainId]

  return bridge ? (
    <RootWrapper>
      <ContentWrapper chainId={chainId} logoUrl={logoUrl}>
        <LinkOutToBridge href={bridge}>
          <BodyText color={textColor}>
            <L2Icon src={logoUrl} />
            <AutoRow>
              <Header>
                <Trans>{label} token bridge</Trans>
              </Header>
              <HideSmall>
                <Trans>Deposit tokens to the {label} network.</Trans>
              </HideSmall>
            </AutoRow>
          </BodyText>
          <StyledArrowUpRight color={textColor} />
        </LinkOutToBridge>
      </ContentWrapper>
    </RootWrapper>
  ) : null
}

import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { getConnection } from 'connection/utils'
import { getChainInfo } from 'constants/chainInfo'
import { CHAIN_IDS_TO_NAMES, SupportedChainId } from 'constants/chains'
import useParsedQueryString from 'hooks/useParsedQueryString'
import usePrevious from 'hooks/usePrevious'
import { darken } from 'polished'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, ArrowDownCircle, ChevronsDown, ChevronsUp } from 'react-feather'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCloseModal, useModalIsOpen, useOpenModal, useToggleModal } from 'state/application/hooks'
import { addPopup, ApplicationModal } from 'state/application/reducer'
import { updateConnectionError } from 'state/connection/reducer'
import { useAppDispatch } from 'state/hooks'
import styled from 'styled-components/macro'
import { ExternalLink, MEDIA_WIDTHS } from 'theme'
import { replaceURLParam } from 'utils/routes'
import { isChainAllowed, switchChain } from 'utils/switchChain'
import { isMobile } from 'utils/userAgent'

const ActiveRowLinkList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  & > a {
    align-items: center;
    color: ${({ theme }) => theme.text2};
    display: flex;
    flex-direction: row;
    font-size: 14px;
    font-weight: 500;
    justify-content: space-between;
    padding: 8px 0 4px;
    text-decoration: none;
  }
  & > a:first-child {
    margin: 0;
    margin-top: 0px;
    padding-top: 10px;
  }
`
const ActiveRowWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  width: 100%;
`
const FlyoutHeader = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
`
const FlyoutMenu = styled.div`
  position: absolute;
  top: 36px;
  right: 10px;
  width: 272px;
  z-index: 99;
  padding-top: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  top: auto;
  bottom: 140%;
  left: -8px;
  `};
`
const FlyoutMenuContents = styled.div`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg0};
  border-radius: 20px;
  border-style: solid;
  border-width: 2px;
  border-color: ${({ theme }) => theme.mevblue};
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px;
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
`
const FlyoutRow = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${({ active, theme }) => (active ? theme.bg2 : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-weight: ${({ active, theme }) => (active ? 700 : 500)};
  color: ${({ active, theme }) => (active ? theme.mevorange : theme.white)};
  justify-content: space-between;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
  :hover,
  :focus {
    color: ${({ theme }) => theme.mevblue};
  }
`
const FlyoutRowActiveIndicator = styled.div`
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
  height: 9px;
  width: 9px;
`

const CircleContainer = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
`

const LinkOutCircle = styled(ArrowDownCircle)`
  transform: rotate(230deg);
  width: 16px;
  height: 16px;
`
const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
`
const NetworkLabel = styled.div`
  flex: 1 1 auto;
`
const SelectorLabel = styled.div<{ isOpen: boolean }>`
  flex: 1 1 auto;
  display: none;
  font-size: 18px;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToMedium}px) {
    display: block;
    margin-right: 8px;
  }
  ${({ isOpen }) =>
    isOpen &&
    `
    font-weight: 700;
    color: ${({ theme }) => theme.mevorange};
    background-color: ${({ theme }) => theme.bg2};
  `}
  :hover,
  :focus {
    color: ${({ theme }) => theme.mevblue};
  }
`
const NetworkAlertLabel = styled(NetworkLabel)`
  display: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.4rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToMedium}px) {
    display: block;
  }
`

const SelectorControls = styled.div<{ supportedChain: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.bg0};
  border: 2px solid ${({ theme }) => theme.bg0};
  border-radius: 16px;
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
  ${({ supportedChain, theme }) =>
    !supportedChain &&
    `
  color: ${theme.white};
  background-color: ${theme.red1};
  border: 2px solid ${theme.red1};
`}
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`
const SelectorLogo = styled(Logo)<{ interactive?: boolean }>`
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  margin-right: 8px;
`
const SelectorWrapper = styled.div`
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    position: relative;
  }
`
const StyledChevronDown = styled(ChevronsDown)`
  width: 16px;
`

const StyledChevronUp = styled(ChevronsUp)`
  width: 16px;
`

const NetworkIcon = styled(AlertTriangle)`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  width: 16px;
  height: 16px;
`

const BridgeLabel = ({ chainId }: { chainId: SupportedChainId }) => {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.ARBITRUM_RINKEBY:
      return <Trans>Arbitrum Bridge</Trans>
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISTIC_KOVAN:
      return <Trans>Optimism Bridge</Trans>
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return <Trans>Polygon Bridge</Trans>
    case SupportedChainId.CELO:
    case SupportedChainId.CELO_ALFAJORES:
      return <Trans>Portal Bridge</Trans>
    case SupportedChainId.PULSECHAIN:
    case SupportedChainId.PULSECHAIN_TESTNET:
      return <Trans>Pulsechain Bridge</Trans>
    case SupportedChainId.BASE:
      return <Trans>Base Bridge</Trans>
    default:
      return <Trans>Bridge</Trans>
  }
}
const ExplorerLabel = ({ chainId }: { chainId: SupportedChainId }) => {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.ARBITRUM_RINKEBY:
      return <Trans>Arbiscan</Trans>
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISTIC_KOVAN:
      return <Trans>Optimistic Etherscan</Trans>
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return <Trans>Polygonscan</Trans>
    case SupportedChainId.CELO:
    case SupportedChainId.CELO_ALFAJORES:
      return <Trans>Blockscout</Trans>
    case SupportedChainId.BSC:
      return <Trans>BNB Chain</Trans>
    case SupportedChainId.DOGECHAIN:
      return <Trans>Dogechain</Trans>
    case SupportedChainId.EVMOS:
      return <Trans>Evmos Chain</Trans>
    case SupportedChainId.PULSECHAIN:
    case SupportedChainId.PULSECHAIN_TESTNET:
      return <Trans>Pulsechain Explorer</Trans>
    case SupportedChainId.BASE:
      return <Trans>Base Explorer</Trans>
    default:
      return <Trans>Etherscan</Trans>
  }
}

function Row({
  targetChain,
  onSelectChain,
}: {
  targetChain: SupportedChainId
  onSelectChain: (targetChain: number) => void
}) {
  const { chainId, provider } = useWeb3React()
  if (!provider || !chainId) {
    return null
  }
  const active = chainId === targetChain
  const { helpCenterUrl, explorer, bridge, label, logoUrl } = getChainInfo(targetChain)

  const rowContent = (
    <FlyoutRow onClick={() => onSelectChain(targetChain)} active={active}>
      <SelectorLogo src={logoUrl} />
      <NetworkLabel>{label}</NetworkLabel>
      {chainId === targetChain && (
        <CircleContainer>
          <FlyoutRowActiveIndicator />
        </CircleContainer>
      )}
    </FlyoutRow>
  )

  if (active) {
    return (
      <ActiveRowWrapper>
        {rowContent}
        <ActiveRowLinkList>
          {bridge && (
            <ExternalLink href={bridge}>
              <BridgeLabel chainId={chainId} />
              <CircleContainer>
                <LinkOutCircle />
              </CircleContainer>
            </ExternalLink>
          )}
          {explorer && (
            <ExternalLink href={explorer}>
              <ExplorerLabel chainId={chainId} />
              <CircleContainer>
                <LinkOutCircle />
              </CircleContainer>
            </ExternalLink>
          )}
          {helpCenterUrl && (
            <ExternalLink href={helpCenterUrl}>
              <Trans>Help Center</Trans>
              <CircleContainer>
                <LinkOutCircle />
              </CircleContainer>
            </ExternalLink>
          )}
        </ActiveRowLinkList>
      </ActiveRowWrapper>
    )
  }
  return rowContent
}

const getParsedChainId = (parsedQs?: ParsedQs) => {
  const chain = parsedQs?.chain
  if (!chain || typeof chain !== 'string') return

  return getChainIdFromName(chain)
}

const getChainIdFromName = (name: string) => {
  const entry = Object.entries(CHAIN_IDS_TO_NAMES).find(([_, n]) => n === name)
  const chainId = entry?.[0]
  return chainId ? parseInt(chainId) : undefined
}

const getChainNameFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_NAMES[id as SupportedChainId] || ''
}

const NETWORK_SELECTOR_CHAINS = [
  SupportedChainId.MAINNET,
  SupportedChainId.BASE,
  SupportedChainId.BSC,
  SupportedChainId.DOGECHAIN,
  SupportedChainId.POLYGON,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.CELO,
  SupportedChainId.EVMOS,
  SupportedChainId.PULSECHAIN,
]

export default function NetworkSelector() {
  const dispatch = useAppDispatch()
  const { chainId, connector, isActive, provider } = useWeb3React()
  const [previousChainId, setPreviousChainId] = useState<number | undefined>(undefined)

  // Can't use `usePrevious` because `chainId` can be undefined while activating.
  useEffect(() => {
    if (chainId && chainId !== previousChainId) {
      setPreviousChainId(chainId)
    }
  }, [chainId, previousChainId])

  const parsedQs = useParsedQueryString()
  const urlChainId = getParsedChainId(parsedQs)
  const previousUrlChainId = usePrevious(urlChainId)

  const navigate = useNavigate()
  const { search } = useLocation()

  const node = useRef<HTMLDivElement>(null)
  const isOpen = useModalIsOpen(ApplicationModal.NETWORK_SELECTOR)
  const openModal = useOpenModal(ApplicationModal.NETWORK_SELECTOR)
  const closeModal = useCloseModal(ApplicationModal.NETWORK_SELECTOR)
  const toggleModal = useToggleModal(ApplicationModal.NETWORK_SELECTOR)

  const info = getChainInfo(chainId)

  const replaceURLChainParam = useCallback(() => {
    if (chainId) {
      navigate({ search: replaceURLParam(search, 'chain', getChainNameFromId(chainId)) }, { replace: true })
    }
  }, [chainId, search, navigate])

  const onSelectChain = useCallback(
    async (targetChain: SupportedChainId, skipClose?: boolean) => {
      if (!connector) return

      const connectionType = getConnection(connector).type

      try {
        dispatch(updateConnectionError({ connectionType, error: undefined }))
        await switchChain(connector, targetChain)
      } catch (error) {
        console.error('Failed to switch networks', error)

        dispatch(updateConnectionError({ connectionType, error: error.message }))
        dispatch(addPopup({ content: { failedSwitchNetwork: targetChain }, key: `failed-network-switch` }))

        // If we activate a chain and it fails, reset the query param to the current chainId
        replaceURLChainParam()
      }

      if (!skipClose) {
        closeModal()
      }
    },
    [connector, dispatch, replaceURLChainParam, closeModal]
  )

  // If there is no chain query param, set it to the current chain
  useEffect(() => {
    const chainQueryUnpopulated = !urlChainId
    if (chainQueryUnpopulated && chainId) {
      replaceURLChainParam()
    }
  }, [chainId, urlChainId, replaceURLChainParam])

  // If the chain changed but the query param is stale, update to the current chain
  useEffect(() => {
    const chainChanged = chainId !== previousChainId
    const chainQueryStale = urlChainId !== chainId
    if (chainChanged && chainQueryStale) {
      replaceURLChainParam()
    }
  }, [chainId, previousChainId, replaceURLChainParam, urlChainId])

  // If the query param changed, and the chain didn't change, then activate the new chain
  useEffect(() => {
    const chainQueryManuallyUpdated = urlChainId && urlChainId !== previousUrlChainId
    if (chainQueryManuallyUpdated && isActive) {
      onSelectChain(urlChainId, true)
    }
  }, [onSelectChain, urlChainId, previousUrlChainId, isActive])

  if (!provider || !chainId) {
    return null
  }

  const onSupportedChain = info !== undefined

  return (
    <SelectorWrapper
      ref={node}
      onMouseEnter={openModal}
      onMouseLeave={closeModal}
      onClick={isMobile ? toggleModal : undefined}
    >
      <SelectorControls supportedChain={onSupportedChain}>
        {onSupportedChain ? (
          <>
            <SelectorLogo src={info.logoUrl} />
            <SelectorLabel isOpen={isOpen}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </>
        ) : (
          <>
            <NetworkIcon />
            <NetworkAlertLabel>Switch Network</NetworkAlertLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </>
        )}
      </SelectorControls>
      {isOpen && (
        <FlyoutMenu>
          <FlyoutMenuContents>
            <FlyoutHeader>
              <Trans>Select a {!onSupportedChain ? ' supported ' : ''}network</Trans>
            </FlyoutHeader>
            {NETWORK_SELECTOR_CHAINS.map((chainId: SupportedChainId) =>
              isChainAllowed(connector, chainId) ? (
                <Row onSelectChain={onSelectChain} targetChain={chainId} key={chainId} />
              ) : null
            )}
          </FlyoutMenuContents>
        </FlyoutMenu>
      )}
    </SelectorWrapper>
  )
}

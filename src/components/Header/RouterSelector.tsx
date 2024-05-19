import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { CHAIN_IDS_TO_DEFAULT_ROUTER, CHAIN_IDS_TO_NAMES, SupportedChainId } from 'constants/chains'
import { ROUTER_INFO } from 'constants/routerInfo'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useParsedQueryString from 'hooks/useParsedQueryString'
import usePrevious from 'hooks/usePrevious'
import { SetRouterId } from 'mevswap/v2-sdk'
import { PAIR, ROUTER_ID_TO_NAMES, SupportedRouterId } from 'mevswap/v2-sdk/constants'
//import useGetRouterId from 'lib/hooks/useRouterId'
import { ParsedQs } from 'qs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronsDown, ChevronsUp } from 'react-feather'
import { useLocation, useNavigate } from 'react-router-dom'
import { useModalIsOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
//import { useRouterId, useSetRouterId } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { MEDIA_WIDTHS } from 'theme'
import { replaceURLParam } from 'utils/routes'
import { isMobile } from 'utils/userAgent'

//import { replaceURLParam } from 'utils/routes'
import { switchRouter } from '../../utils/switchRouter'

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
const FlyoutMenuR = styled.div`
  position: absolute;
  top: 36px;
  right: 10px;
  width: 272px;
  z-index: 99;
  padding-top: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  top: auto;
  bottom: 140%;
  left: -200px;
  `};
`
const FlyoutMenuContentsR = styled.div`
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
const FlyoutRowR = styled.div<{ active: boolean }>`
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
const FlyoutRowActiveIndicatorR = styled.div`
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
  height: 9px;
  width: 9px;
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

const SelectorControls = styled.div<{ interactive: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.bg0};
  border: 2px solid ${({ theme }) => theme.bg0};
  border-radius: 16px;
  color: ${({ theme }) => theme.text1};
  cursor: ${({ interactive }) => (interactive ? 'pointer' : 'auto')};
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
`
const SelectorLogo = styled(Logo)<{ interactive?: boolean }>`
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 8px;
  `};
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

function Row({
  targetRouter,
  onSelectRouter,
  id,
}: {
  targetRouter: SupportedRouterId
  onSelectRouter: (targetRouter: number) => void
  id: SupportedRouterId
}) {
  const active = id === targetRouter
  const { label, logoUrl } = ROUTER_INFO[targetRouter]

  const rowContent = (
    <FlyoutRowR onClick={() => onSelectRouter(targetRouter)} active={active}>
      <Logo src={logoUrl} />
      <NetworkLabel>{label}</NetworkLabel>
      {id === targetRouter && <FlyoutRowActiveIndicatorR />}
    </FlyoutRowR>
  )

  if (active) {
    return <ActiveRowWrapper>{rowContent}</ActiveRowWrapper>
  }
  return rowContent
}

const getParsedRouterId = (parsedQs?: ParsedQs) => {
  const router = parsedQs?.router
  if (!router || typeof router !== 'string') return { urlRouter: undefined, urlRouterId: undefined }

  return { urlRouter: router.toLowerCase(), urlRouterId: getRouterIdFromName(router) }
}

const getRouterIdFromName = (name: string) => {
  const entry = Object.entries(ROUTER_ID_TO_NAMES).find(([_, n]) => n === name)
  const routerId = entry?.[0]
  return routerId ? parseInt(routerId) : undefined
}

const getRouterNameFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return ROUTER_ID_TO_NAMES[id as SupportedRouterId] || ''
}

const getDefaultRouterFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_DEFAULT_ROUTER[id as SupportedChainId]
}

export const currentRouterId = 0

const getChainNameFromId = (id: string | number) => {
  // casting here may not be right but fine to return undefined if it's not a supported chain ID
  return CHAIN_IDS_TO_NAMES[id as SupportedChainId] || ''
}

export default function RouterSelector() {
  const parsedQs = useParsedQueryString()
  const { chainId } = useWeb3React()
  const routerId = useRef(1)
  const { urlRouter, urlRouterId } = getParsedRouterId(parsedQs)
  const prevRouterId = usePrevious(routerId)
  //const previousChainId = usePrevious(chainId)
  const [previousChainId, setPreviousChainId] = useState<number | undefined>(undefined)
  const node = useRef<HTMLDivElement>()
  const open = useModalIsOpen(ApplicationModal.ROUTER_SELECTOR)
  const toggle = useToggleModal(ApplicationModal.ROUTER_SELECTOR)
  useOnClickOutside(node, open ? toggle : undefined)

  // Can't use `usePrevious` because `chainId` can be undefined while activating.
  useEffect(() => {
    if (chainId && chainId !== previousChainId) {
      setPreviousChainId(chainId)
      routerId.current = getDefaultRouterFromId(chainId || 1)
    }
  }, [chainId, previousChainId])

  //const storedRouterId = useSetRouterId()
  //storedRouterId(routerId.current)
  SetRouterId(routerId.current)

  //const useStoredRouterId = useRouterId()

  const navigate = useNavigate()
  const { search } = useLocation()

  //console.log('routerId: ', routerId.current)
  //console.log('prevRouterId: ', prevRouterId)
  //console.log('urlRouter: ', urlRouter)
  //console.log('urlRouterId: ', urlRouterId)
  //console.log('useStoredRouterId: ', useStoredRouterId)
  //console.log('GET_ROUTER_ID: ', PAIR.ROUTERID)

  const info = ROUTER_INFO[PAIR.ROUTERID]

  const replaceURLRouterParam = useCallback(() => {
    if (routerId) {
      navigate({ search: replaceURLParam(search, 'router', getRouterNameFromId(routerId.current)) }, { replace: true })
    }
  }, [routerId, search, navigate])

  const replaceURLRouterParamFromChainId = useCallback(() => {
    if (chainId) {
      const searchParamsWithChain = replaceURLParam(search, 'chain', getChainNameFromId(chainId))
      const finalSearchParams = replaceURLParam(
        searchParamsWithChain,
        'router',
        getRouterNameFromId(getDefaultRouterFromId(chainId))
      )
      navigate({ search: finalSearchParams }, { replace: true })
    }
  }, [navigate, search, chainId])

  const handleRouterSwitch = useCallback(
    (targetRouter: number, skipToggle?: boolean) => {
      console.log('handleRouterSwitch:', targetRouter)
      switchRouter({ routerId: targetRouter })
        .then(() => {
          console.log('handleRouterSwitch: then loop', targetRouter)
          routerId.current = targetRouter
          if (!skipToggle) {
            toggle()
          }
          // router change triggered from menu:
          replaceURLRouterParam()
        })
        .catch(() => {
          // we want app network <-> chainId param to be in sync, so if user changes the network by changing the URL
          // but the request fails, revert the URL back to current chainId
          console.log('handleRouterSwitch: catch')
          if (routerId) {
            replaceURLRouterParam()
          }

          if (!skipToggle) {
            toggle()
          }
        })
    },
    [replaceURLRouterParam, toggle]
  )

  useEffect(() => {
    if (!routerId || !prevRouterId) return

    // when network change originates from wallet or dropdown selector, just update URL
    if (routerId !== prevRouterId) {
      replaceURLRouterParam()
      // otherwise assume network change originates from URL
    } else if (urlRouterId && urlRouterId !== routerId.current) {
      routerId.current = urlRouterId
      toggle()
    }
    // if the Network changed then update the url with the default router for the new chain
    if (chainId !== previousChainId) {
      replaceURLRouterParamFromChainId()
    }
  }, [
    routerId,
    urlRouterId,
    prevRouterId,
    handleRouterSwitch,
    toggle,
    replaceURLRouterParam,
    chainId,
    previousChainId,
    replaceURLRouterParamFromChainId,
  ])

  // set chain parameter on initial load if not there
  useEffect(() => {
    if (routerId && !urlRouterId) {
      replaceURLRouterParam()
    }
  }, [routerId, urlRouterId, urlRouter, replaceURLRouterParam])

  switch (chainId) {
    case SupportedChainId.MAINNET:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.MEVSWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.UNISWAPV3}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.SUSHISWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.SHIBASWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.PANCAKESWAPETH}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    case SupportedChainId.BSC:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.PANCAKESWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.BSCSWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.BSCUNISWAPV3}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    case SupportedChainId.DOGECHAIN:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.DOGECHAINDOGESWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.DOGECHAINDOGESHREK}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.DOGECHAINYODESWAP}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    case SupportedChainId.DOGECHAIN_TESTNET:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.DOGECHAINTESTNETDOGESWAP}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    case SupportedChainId.PULSECHAIN:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.PULSEX}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    case SupportedChainId.PULSECHAIN_TESTNET:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.PULSEX}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    case SupportedChainId.ROPSTEN:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.ROPSTENMEVSWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.ROPSTENUNISWAPV2}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.ROPSTENUNISWAPV3}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    case SupportedChainId.EVMOS:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.DIFFUSION}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.CRONUS}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    case SupportedChainId.BASE:
      return (
        <SelectorWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
          <SelectorControls interactive>
            <SelectorLogo interactive src={info.logoUrl} />
            <SelectorLabel isOpen={open}>{info.shortlabel}</SelectorLabel>
            {isMobile && <StyledChevronUp />}
            {!isMobile && <StyledChevronDown />}
          </SelectorControls>
          {open && (
            <FlyoutMenuR>
              <FlyoutMenuContentsR>
                <FlyoutHeader>
                  <Trans>Select the Router</Trans>
                </FlyoutHeader>
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.BASEBASESWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.BASETHORNSWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.BASESUSHISWAP}
                  id={routerId.current}
                />
                <Row
                  onSelectRouter={handleRouterSwitch}
                  targetRouter={SupportedRouterId.BASEUNISWAPV3}
                  id={routerId.current}
                />
              </FlyoutMenuContentsR>
            </FlyoutMenuR>
          )}
        </SelectorWrapper>
      )
    default:
      return null
  }
}

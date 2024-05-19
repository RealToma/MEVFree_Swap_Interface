import { darken, transparentize } from 'polished'
import { ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components/macro'

import { ExternalLink } from '../../theme'
import Popover, { PopoverProps } from '../Popover'

export const TooltipContainer = styled.div`
  max-width: 256px;
  padding: 0.6rem 1rem;
  font-weight: 400;
  word-break: break-word;

  background: ${({ theme }) => theme.bg0};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bg2};
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.9, theme.shadow1)};
`

// can't be customized under react-router-dom v6
// so we have to persist to the default one, i.e., .active
const activeClassName = 'active'

const StyledExternalLink = styled(ExternalLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
    text-decoration: none;
  }
`

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: ReactNode
  disableHover?: boolean // disable the hover and content display
}

interface TooltipExternalLinkProps extends Omit<PopoverProps, 'content'> {
  text: ReactNode
  poolLink: string // external link href content
  disableHover?: boolean // disable the hover and content display
}

interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
  content: ReactNode
  onOpen?: () => void
  // whether to wrap the content in a `TooltipContainer`
  wrap?: boolean
  disableHover?: boolean // disable the hover and content display
}

interface TooltipContentExternalLinkProps extends Omit<PopoverProps, 'content'> {
  content: ReactNode
  poolLink: string // external link href content
  onOpen?: () => void
  // whether to wrap the content in a `TooltipContainer`
  wrap?: boolean
  disableHover?: boolean // disable the hover and content display
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return <Popover content={text && <TooltipContainer>{text}</TooltipContainer>} {...rest} />
}

function TooltipContent({ content, wrap = false, ...rest }: TooltipContentProps) {
  return <Popover content={wrap ? <TooltipContainer>{content}</TooltipContainer> : content} {...rest} />
}

/** Standard text tooltip. */
export function MouseoverTooltip({ text, disableHover, children, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show} text={disableHover ? null : text}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}

export function newTab(link: string) {
  window.open(link, '_blank')
  return
}

/** Standard text tooltip. */
export function MouseoverTooltipExternalLink({
  text,
  poolLink,
  disableHover,
  children,
  ...rest
}: Omit<TooltipExternalLinkProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show} text={disableHover ? null : text}>
      <div onMouseEnter={open} onMouseLeave={close} onClick={(event) => newTab(poolLink)}>
        {children}
      </div>
    </Tooltip>
  )
}

/** Tooltip that displays custom content. */
export function MouseoverTooltipContent({
  content,
  children,
  onOpen: openCallback = undefined,
  disableHover,
  ...rest
}: Omit<TooltipContentProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => {
    setShow(true)
    openCallback?.()
  }, [openCallback])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <TooltipContent {...rest} show={show} content={disableHover ? null : content}>
      <div
        style={{ display: 'inline-block', lineHeight: 0, padding: '0.25rem' }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  )
}

/** Tooltip that displays custom content. */
export function MouseoverTooltipContentExternalLink({
  content,
  poolLink,
  children,
  onOpen: openCallback = undefined,
  disableHover,
  ...rest
}: Omit<TooltipContentExternalLinkProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => {
    setShow(true)
    openCallback?.()
  }, [openCallback])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <TooltipContent {...rest} show={show} content={disableHover ? null : content}>
      <div
        style={{ display: 'inline-block', lineHeight: 0, padding: '0.25rem' }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
      <StyledExternalLink id={`dextools-link`} href={poolLink}></StyledExternalLink>
    </TooltipContent>
  )
}

import { DialogContent, DialogOverlay } from '@reach/dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import { isMobile } from '../../utils/userAgent'

const StyledDialogOverlay = styled(DialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    background-color: transparent;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${({ theme }) => theme.modalBG};
  }
`

const StyledDialogContent = styled(DialogContent)<{
  margin?: string
  maxWidth?: string
  maxHeight?: number
  minHeight?: number | false
  mobile?: boolean
}>`
  overflow-y: auto;

  &[data-reach-dialog-content] {
    margin: 0 0 2rem 0;
    background-color: ${({ theme }) => theme.bg0};
    border: 1px solid ${({ theme }) => theme.bg1};
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
    padding: 0px;
    width: 50vw;
    overflow-y: auto;
    overflow-x: hidden;

    align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};

    max-width: 440px;
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    border-radius: 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      margin: 0;
    `}
    ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width:  85vw;
      ${
        mobile &&
        css`
          width: 100vw;
          border-radius: 20px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `
      }
    `}
  }
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function Modal({
  isOpen,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  children,
}: ModalProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <StyledDialogOverlay
            isOpen={isOpen}
            onDismiss={onDismiss}
            initialFocusRef={initialFocusRef}
            unstable_lockFocusAcrossFrames={false}
          >
            <motion.div
              initial={{ y: -500, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -500,
                opacity: 0,
              }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            >
              <StyledDialogContent minHeight={minHeight} maxHeight={maxHeight} mobile={isMobile}>
                {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </motion.div>
          </StyledDialogOverlay>
        )}
      </AnimatePresence>
    </>
  )
}

import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { Currency } from 'mevswap/sdk-core'
import { useCallback, useRef, useState } from 'react'
import { Eye } from 'react-feather'
import { useModalIsOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
//import { useRouterId, useSetRouterId } from 'state/user/hooks'
import styled from 'styled-components/macro'

import TokenInfoModal from './TokenInfoModal'

const TokenInfoWrapper = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const StyledInfoMenuIcon = styled(Eye)`
  height: 16px;
  width: 16px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }

  :hover {
    opacity: 0.7;
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 2px;
  border-radius: 0.5rem;
  height: 16px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`

interface ShowTokenInfoProps {
  currency: Currency | null
  tokenHoneypotInfo?: any
  tokenHpLoading?: boolean
}

export default function ShowTokenInfo({ currency, tokenHoneypotInfo, tokenHpLoading }: ShowTokenInfoProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const node = useRef<HTMLDivElement>()
  const open = useModalIsOpen(ApplicationModal.TOKEN_INFO)
  const toggle = useToggleModal(ApplicationModal.TOKEN_INFO)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <>
      <StyledMenuButton
        onClick={() => {
          setModalOpen(true)
        }}
      >
        <StyledInfoMenuIcon />
      </StyledMenuButton>
      <TokenInfoWrapper ref={node as any} onMouseEnter={toggle} onMouseLeave={toggle}>
        {modalOpen && !currency?.isNative && currency?.isToken ? (
          <TokenInfoModal
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            currency={currency}
            data={tokenHoneypotInfo}
            loading={tokenHpLoading}
          />
        ) : null}
      </TokenInfoWrapper>
    </>
  )
}

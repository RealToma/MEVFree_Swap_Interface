import { Trans } from '@lingui/macro'
import { Currency } from 'mevswap/sdk-core'
import { useCallback, useState } from 'react'
import { Edit, Search } from 'react-feather'
import { useUserShowEditTokenList } from 'state/user/hooks'
import styled from 'styled-components/macro'

import { ThemedText } from '../../theme'
import { RowBetween, RowFixed } from '../Row'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'

const StyledSwapHeader = styled.div`
  padding: 0 0.5rem 0.5rem 0.5rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: ${({ theme }) => theme.white};
`

const StyledSearchMenuIcon = styled(Search)`
  height: 20px;
  width: 20px;

  stroke: ${({ theme }) => theme.text1};

  :hover {
    stroke: ${({ theme }) => theme.mevblue};
    opacity: 0.7;
  }
`

const StyledEditMenuIcon = styled(Edit)`
  height: 20px;
  width: 20px;

  stroke: ${({ theme }) => theme.text1};

  :hover {
    stroke: ${({ theme }) => theme.mevblue};
    opacity: 0.7;
  }
`

const StyledActiveEditMenuIcon = styled(Edit)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.yellowVibrant};
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
  padding: 0;
  border-radius: 0.5rem;
  height: 20px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`

const StyledButtonCintainer = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

interface TokenHeaderProps {
  isOpen: boolean
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
}

export default function TokenHeader(
  this: any,
  {
    isOpen,
    onCurrencySelect,
    selectedCurrency,
    otherSelectedCurrency,
    showCommonBases = false,
    showCurrencyAmount = true,
    disableNonToken = false,
  }: TokenHeaderProps
) {
  const [modalOpen, setModalOpen] = useState(false)
  const [showEditTokenList, setShowEditTokenList] = useUserShowEditTokenList()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <ThemedText.SubHeader fontWeight={500} fontSize={20} style={{ marginRight: '8px' }}>
            <Trans>Your Portfolio</Trans>
          </ThemedText.SubHeader>
        </RowFixed>
        <RowFixed>
          <StyledMenuButton
            onClick={() => {
              if (onCurrencySelect !== null) {
                setModalOpen(true)
              }
            }}
          >
            <StyledSearchMenuIcon />
          </StyledMenuButton>
          <StyledButtonCintainer>
            {showEditTokenList ? (
              <StyledMenuButton
                onClick={() => {
                  setShowEditTokenList(false)
                }}
              >
                <StyledActiveEditMenuIcon />
              </StyledMenuButton>
            ) : (
              <StyledMenuButton
                onClick={() => {
                  setShowEditTokenList(true)
                }}
              >
                <StyledEditMenuIcon />
              </StyledMenuButton>
            )}
          </StyledButtonCintainer>
        </RowFixed>
      </RowBetween>
      {onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
          showCurrencyAmount={showCurrencyAmount}
          disableNonToken={disableNonToken}
        />
      )}
    </StyledSwapHeader>
  )
}

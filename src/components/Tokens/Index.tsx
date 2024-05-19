// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useUserWalletTokens } from 'hooks/Tokens'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useTheme from 'hooks/useTheme'
import useToggle from 'hooks/useToggle'
import JSBI from 'jsbi'
import { tokenComparator } from 'lib/hooks/useTokenList/sorting'
import { Currency, Token } from 'mevswap/sdk-core'
import { useCallback, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { useTokenBalancesWithLoadingIndicator } from 'state/connection/hooks'
import { useUserHiddenTokensList, useUserShowEditTokenList } from 'state/user/hooks'
import styled from 'styled-components/macro'

import { ThemedText } from '../../theme'
import Column from '../Column'
import { TokenPortfolioList } from './TokenList'

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`

interface TokenResultsProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  hideZeroBalanceTokens: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
  onMax: () => void
}

export function TokenResults({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  hideZeroBalanceTokens,
  showCurrencyAmount,
  disableNonToken,
  onMax,
}: TokenResultsProps) {
  const theme = useTheme()

  const { account } = useWeb3React()
  const fixedList = useRef<FixedSizeList>()
  const [userWalletTokens, setUserWalletTokens] = useState<Token[]>([])

  useUserWalletTokens(setUserWalletTokens)

  const [balances, balancesIsLoading] = useTokenBalancesWithLoadingIndicator(account ?? undefined, userWalletTokens)
  const hiddenTokensList = useUserHiddenTokensList()
  const [userShowEditTokenList] = useUserShowEditTokenList()

  const sortedTokens: Token[] = useMemo(() => {
    void balancesIsLoading // creates a new array once balances load to update hooks
    let tokenResult = [...userWalletTokens].sort(tokenComparator.bind(null, balances))
    if (hideZeroBalanceTokens) {
      tokenResult = tokenResult.filter((token) => {
        const balance = balances[token.address]
        if (balance && balance.equalTo(JSBI.BigInt('0'))) {
          return false
        }
        return true
      })
    }
    if (!userShowEditTokenList) {
      tokenResult = tokenResult.filter((token) => {
        const tokenAddress: string = token.address.toLowerCase()
        if (hiddenTokensList && hiddenTokensList.size && hiddenTokensList.has(tokenAddress)) {
          return false
        }
        return true
      })
    }
    return tokenResult
  }, [balances, userWalletTokens, balancesIsLoading, hideZeroBalanceTokens, hiddenTokensList, userShowEditTokenList])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
    },
    [onCurrencySelect]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  if (sortedTokens?.length > 0) {
    return (
      <ContentWrapper>
        <div style={{ flex: '1' }}>
          <TokenPortfolioList
            height={680}
            currencies={sortedTokens}
            onCurrencySelect={handleCurrencySelect}
            otherCurrency={otherSelectedCurrency}
            selectedCurrency={selectedCurrency}
            fixedListRef={fixedList}
            showCurrencyAmount={showCurrencyAmount}
            onMaxClick={onMax}
          />
        </div>
      </ContentWrapper>
    )
  } else {
    return (
      <ContentWrapper>
        <div style={{ flex: '1' }}>
          <Column style={{ padding: '20px', height: '100%' }}>
            <ThemedText.Main color={theme.text3} textAlign="center" mb="20px">
              <Trans>Loading Your Portfolio...</Trans>
            </ThemedText.Main>
          </Column>
        </div>
      </ContentWrapper>
    )
  }
}

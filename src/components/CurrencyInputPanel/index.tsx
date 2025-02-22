import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { AutoColumn } from 'components/Column'
import { LoadingOpacityContainer, loadingOpacityMixin } from 'components/Loader/styled'
import ShowTokenInfo from 'components/Tokens/TokenInfo/ShowTokenInfo'
import { SupportedChainId } from 'constants/chains'
// eslint-disable-next-line no-restricted-imports
import { ethers } from 'ethers'
import { Currency, CurrencyAmount, Percent, Token, WETH9 } from 'mevswap/sdk-core'
import { Pair } from 'mevswap/v2-sdk'
import { darken, rgba } from 'polished'
import { ReactNode, useCallback, useState } from 'react'
import { Lock } from 'react-feather'
import styled from 'styled-components/macro'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import useTheme from '../../hooks/useTheme'
import { useCurrencyBalance } from '../../state/connection/hooks'
import { ThemedText } from '../../theme'
import { ButtonGray } from '../Button'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Input as NumericalInput } from '../NumericalInput'
import { RowBetween, RowFixed } from '../Row'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { FiatValue } from './FiatValue'

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  border-style: solid;
  border-width: 2px;
  border-color: ${({ theme }) => theme.mevblue};
  background-color: ${({ theme, hideInput }) => (hideInput ? 'transparent' : theme.mevbggrey)};
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  transition: height 1s ease;
  will-change: height;
  :hover {
    background-color: ${({ theme, hideInput }) => (hideInput ? 'transparent' : theme.bg1)};
  }
`

const FixedContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.mevbggrey};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '20px')};
  background-color: ${({ theme }) => theme.mevbggrey};
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  :focus,
  :hover {
    background-color: ${({ theme, hideInput }) => (hideInput ? 'transparent' : theme.bg1)};
  }
`

const CurrencySelect = styled(ButtonGray)<{ visible: boolean; selected: boolean; hideInput?: boolean }>`
  align-items: center;
  background-color: ${({ selected, theme }) => (selected ? theme.bg2 : theme.primary1)};
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  cursor: pointer;
  border-radius: 16px;
  outline: none;
  user-select: none;
  border: none;
  font-size: 24px;
  font-weight: 500;
  height: ${({ hideInput }) => (hideInput ? '2.8rem' : '2.4rem')};
  width: ${({ hideInput }) => (hideInput ? '100%' : 'initial')};
  padding: 0 8px;
  justify-content: space-between;
  margin-left: ${({ hideInput }) => (hideInput ? '0' : '12px')};
  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg3 : darken(0.05, theme.primary1))};
  }
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
  padding: ${({ selected }) => (selected ? ' 1rem 1rem 0.75rem 1rem' : '1rem 1rem 1rem 1rem')};
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0 1rem 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  height: 16px;
`

const StatusRow = styled(LabelRow)`
  margin: 4px 0 0 0;
  justify-content: flex-end;
  height: 16px;
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.35rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '18px' : '18px')};
`

const StyledBalanceMax = styled.button`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ theme }) => rgba(theme.text2, 0.2)};
  color: ${({ theme }) => theme.text2};
  border-style: solid;
  border-width: 1px;
  border-color: ${({ theme }) => theme.primary1};
  border-radius: 999px;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.mevorange};
  }
`

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  ${loadingOpacityMixin};
  text-align: left;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  onHalf?: () => void
  onQuarter?: () => void
  onMaxTx?: () => void
  showMaxButton: boolean
  showMaxTxButton: boolean
  label?: ReactNode
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  fiatValue?: CurrencyAmount<Token> | null
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode
  locked?: boolean
  loading?: boolean
  tokenHoneypotInfo?: any
  tokenHpLoading?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  onHalf,
  onQuarter,
  onMaxTx,
  showMaxButton,
  showMaxTxButton,
  onCurrencySelect,
  currency,
  otherCurrency,
  id,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  loading = false,
  tokenHoneypotInfo,
  tokenHpLoading,
  ...rest
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account, chainId } = useWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const outputMaxTx =
    tokenHoneypotInfo !== undefined ? ethers.utils.formatUnits(tokenHoneypotInfo.maxTransaction) : '0.0'

  let combinedTaxes = 0
  if (tokenHoneypotInfo?.buyTax !== undefined && tokenHoneypotInfo?.sellTax !== undefined) {
    combinedTaxes = +tokenHoneypotInfo?.buyTax + +tokenHoneypotInfo?.sellTax
  }

  return (
    <InputPanel id={id} hideInput={hideInput} {...rest}>
      {locked && (
        <FixedContainer>
          <AutoColumn gap="sm" justify="center">
            <Lock />
            <ThemedText.Label fontSize="12px" textAlign="center" padding="0 12px">
              <Trans>The market price is outside your specified price range. Single-asset deposit only.</Trans>
            </ThemedText.Label>
          </AutoColumn>
        </FixedContainer>
      )}
      <Container hideInput={hideInput}>
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={!onCurrencySelect}>
          {!hideInput && (
            <StyledNumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={onUserInput}
              $loading={loading}
            />
          )}

          <CurrencySelect
            visible={currency !== undefined}
            selected={!!currency}
            hideInput={hideInput}
            className="open-currency-select-button"
            onClick={() => {
              if (onCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              <RowFixed>
                {pair ? (
                  <span style={{ marginRight: '0.5rem' }}>
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
                  </span>
                ) : currency ? (
                  <CurrencyLogo style={{ marginRight: '0.5rem' }} currency={currency} size={'24px'} />
                ) : null}
                {pair ? (
                  <StyledTokenName className="pair-name-container">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </StyledTokenName>
                ) : (
                  <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      : currency?.symbol) || <Trans>Select a token</Trans>}
                  </StyledTokenName>
                )}
              </RowFixed>
              {onCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
        {!hideInput && !hideBalance && currency && (
          <FiatRow>
            <RowBetween>
              <LoadingOpacityContainer $loading={loading}>
                <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
              </LoadingOpacityContainer>
              {account ? (
                <RowFixed style={{ height: '17px' }}>
                  <ThemedText.Body color={theme.text3} fontWeight={500} fontSize={14}>
                    {!hideBalance && currency && selectedCurrencyBalance ? (
                      renderBalance ? (
                        renderBalance(selectedCurrencyBalance)
                      ) : (
                        <Trans>Balance: {formatCurrencyAmount(selectedCurrencyBalance, 4)}</Trans>
                      )
                    ) : null}
                  </ThemedText.Body>
                  {showMaxButton && selectedCurrencyBalance ? (
                    <RowFixed alignItems="center" sx={{ gap: '4px' }}>
                      {'\xa0'}
                      <StyledBalanceMax onClick={onQuarter}>
                        <Trans>25%</Trans>
                      </StyledBalanceMax>
                      <StyledBalanceMax onClick={onHalf}>
                        <Trans>50%</Trans>
                      </StyledBalanceMax>
                      <StyledBalanceMax onClick={onMax}>
                        <Trans>100%</Trans>
                      </StyledBalanceMax>
                    </RowFixed>
                  ) : null}
                  {showMaxTxButton &&
                  !tokenHpLoading &&
                  tokenHoneypotInfo?.isHoneypot === false &&
                  outputMaxTx !== '0.0' ? (
                    <RowFixed alignItems="center" sx={{ gap: '4px' }}>
                      {'\xa0'}
                      <StyledBalanceMax onClick={onMaxTx}>
                        <Trans>Max Tx</Trans>
                      </StyledBalanceMax>
                    </RowFixed>
                  ) : null}
                </RowFixed>
              ) : (
                <span />
              )}
            </RowBetween>
          </FiatRow>
        )}
        {!hideInput && currency && (
          <StatusRow>
            <RowBetween>
              <RowFixed style={{ height: '17px' }}>
                <ThemedText.Body color={theme.text1} fontWeight={500} fontSize={14}>
                  <Trans>Trading Status:</Trans>
                  {'\xa0'}
                </ThemedText.Body>
                {currency.isNative ||
                currency.address.toLowerCase() === WETH9[chainId as SupportedChainId]?.address.toLowerCase() ? (
                  <ThemedText.Body color={theme.green1} fontWeight={500} fontSize={14}>
                    <Trans>SAFE</Trans>
                    {'\xa0'}
                  </ThemedText.Body>
                ) : tokenHpLoading ? (
                  <ThemedText.Body color={theme.mevorange} fontWeight={500} fontSize={14}>
                    <Trans>Loading Status</Trans>
                    {'\xa0'}
                  </ThemedText.Body>
                ) : tokenHoneypotInfo?.isHoneypot === false && combinedTaxes <= 10 ? (
                  <ThemedText.Body color={theme.green1} fontWeight={500} fontSize={14}>
                    <Trans>SAFE</Trans>
                    {'\xa0'}
                  </ThemedText.Body>
                ) : tokenHoneypotInfo?.isHoneypot === false && combinedTaxes > 15 && combinedTaxes < 25 ? (
                  <ThemedText.Body color={theme.mevorange} fontWeight={500} fontSize={14}>
                    <Trans>SAFE (Moderate Buy/Sell Tax)</Trans>
                    {'\xa0'}
                  </ThemedText.Body>
                ) : tokenHoneypotInfo?.isHoneypot === false && combinedTaxes >= 25 && combinedTaxes < 40 ? (
                  <ThemedText.Body color={theme.mevorange} fontWeight={500} fontSize={14}>
                    <Trans>CAUTION (High Buy/Sell Tax)</Trans>
                    {'\xa0'}
                  </ThemedText.Body>
                ) : tokenHoneypotInfo?.isHoneypot === false && combinedTaxes >= 40 ? (
                  <ThemedText.Body color={theme.red1} fontWeight={500} fontSize={14}>
                    <Trans>⚠️ ‼️ Effectively a honeypot ‼️ ⚠️</Trans>
                    {'\xa0'}
                  </ThemedText.Body>
                ) : tokenHoneypotInfo?.isHoneypot === true ? (
                  <ThemedText.Body color={theme.red1} fontWeight={500} fontSize={14}>
                    <Trans>❌ NOT SAFE! - HONEYPOT! ❌</Trans>
                    {'\xa0'}
                  </ThemedText.Body>
                ) : null}
              </RowFixed>
              {!currency.isNative ? (
                <RowFixed>
                  <ShowTokenInfo
                    currency={currency}
                    tokenHoneypotInfo={tokenHoneypotInfo}
                    tokenHpLoading={tokenHpLoading}
                  />
                </RowFixed>
              ) : null}
            </RowBetween>
          </StatusRow>
        )}
      </Container>
      {onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          showCurrencyAmount={showCurrencyAmount}
          disableNonToken={disableNonToken}
        />
      )}
    </InputPanel>
  )
}

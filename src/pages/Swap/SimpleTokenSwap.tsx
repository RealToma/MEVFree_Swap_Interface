import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import SimpleSwapHeader from 'components/swap/SimpleSwapHeader'
import SwapDetailsDropdown from 'components/swap/SwapDetailsDropdown'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { MouseoverTooltip } from 'components/Tooltip'
import { SupportedChainId } from 'constants/chains'
import { MEVFREE_MIN_BALANCE } from 'constants/misc'
import { ROUTER_INFO } from 'constants/routerInfo'
// eslint-disable-next-line no-restricted-imports
import { ethers } from 'ethers'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useCurrencyConvertedToNative, useHoneyPotInfo } from 'hooks/useTokenInfo'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import JSBI from 'jsbi'
import { useTokenBalance } from 'lib/hooks/useCurrencyBalance'
import { Trade } from 'mevswap/router-sdk'
import { Currency, CurrencyAmount, Token, TradeType } from 'mevswap/sdk-core'
import { PAIR } from 'mevswap/v2-sdk'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CheckCircle, HelpCircle } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Text } from 'rebass'
import { TradeState } from 'state/routing/types'
import styled, { ThemeContext } from 'styled-components/macro'

//import { isMobile } from 'utils/userAgent'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { GreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import Loader from '../../components/Loader'
import { AutoRow } from '../../components/Row'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import { SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { ApprovalState, useApprovalOptimizedTrade, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useERC20PermitFromTrade, UseERC20PermitState } from '../../hooks/useERC20Permit'
import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import { useStablecoinValue } from '../../hooks/useStablecoinPrice'
import useWrapCallback, { WrapErrorText, WrapType } from '../../hooks/useWrapCallback'
import { useToggleWalletModal } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from '../../state/swap/hooks'
import { useExpertModeManager, useUserSingleHopOnly } from '../../state/user/hooks'
import { LinkStyledButton, ThemedText } from '../../theme'
import { computeFiatValuePriceImpact } from '../../utils/computeFiatValuePriceImpact'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { warningSeverity } from '../../utils/prices'
import { AppBody } from '../AppBody'

const BodyWrapper3 = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  padding: 10px 16px 0px 16px;
  column-gap: 20px;
`

const LabelWrapper = styled.div`
  padding: 2px 2px 2px 2px;
`

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 10vh;
`

const AlertWrapper = styled.div`
  max-width: 460px;
  width: 100%;
`

export default function SimpleTokenSwap() {
  const { account } = useWeb3React()

  const MEVFreeToken = new Token(
    SupportedChainId.MAINNET,
    '0x1936c91190e901b7dd55229a574ae22b58ff498a',
    18,
    'MEVFree',
    'MEVFree'
  )

  const MEVFreeCurrency: Currency = MEVFreeToken

  const theme = useContext(ThemeContext)
  // toggle wallet when disconnected
  const toggleWalletModal = useToggleWalletModal()
  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  const [singleHopOnly] = useUserSingleHopOnly()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    trade: { state: tradeState, trade },
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    inputCurrency,
  } = useDerivedSwapInfo()

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  )

  const [routeNotFound, routeIsLoading, routeIsSyncing] = useMemo(
    () => [!trade?.swaps, TradeState.LOADING === tradeState, TradeState.SYNCING === tradeState],
    [trade, tradeState]
  )
  // show price estimates based on wrap trade
  const inputValue = showWrap ? parsedAmount : trade?.inputAmount
  const outputValue = showWrap ? parsedAmount : trade?.outputAmount
  const fiatValueInput = useStablecoinValue(inputValue)
  const fiatValueOutput = useStablecoinValue(outputValue)
  const priceImpact = useMemo(
    () => (routeIsSyncing ? undefined : computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)),
    [fiatValueInput, fiatValueOutput, routeIsSyncing]
  )

  const { onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [dependentField, independentField, parsedAmounts, showWrap, typedValue]
  )

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )

  const approvalOptimizedTrade = useApprovalOptimizedTrade(trade, allowedSlippage)

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)
  const transactionDeadline = useTransactionDeadline()
  const {
    state: signatureState,
    signatureData,
    gatherPermitSignature,
  } = useERC20PermitFromTrade(trade, allowedSlippage, transactionDeadline)

  const handleApprove = useCallback(async () => {
    if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
      try {
        await gatherPermitSignature()
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          await approveCallback()
        }
      }
    } else {
      await approveCallback()
    }
  }, [signatureState, gatherPermitSignature, approveCallback])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(currencyBalances[Field.INPUT]),
    [currencyBalances]
  )

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    approvalOptimizedTrade,
    allowedSlippage,
    recipient,
    signatureData
  )

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [swapCallback, priceImpact, tradeToConfirm, showConfirm])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on the greater of fiat value price impact and execution price impact
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])

  const isArgentWallet = useIsArgentWallet()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      onCurrencySelection(Field.OUTPUT, MEVFreeCurrency)
    },
    [MEVFreeCurrency, onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const handleHalfInput = useCallback(() => {
    onUserInput(Field.INPUT, currencyBalances[Field.INPUT]?.divide(2).toExact() || '')
  }, [currencyBalances, onUserInput])

  const handleQuarterInput = useCallback(() => {
    onUserInput(Field.INPUT, currencyBalances[Field.INPUT]?.divide(4).toExact() || '')
  }, [currencyBalances, onUserInput])

  const swapIsUnsupported = useIsSwapUnsupported(currencies[Field.INPUT], currencies[Field.OUTPUT])

  const priceImpactTooHigh = priceImpactSeverity > 10 && !isExpertMode

  const info = ROUTER_INFO[PAIR.ROUTERID]

  const nativeInputCurrency = useCurrencyConvertedToNative(inputCurrency)
  const inputToken = nativeInputCurrency?.wrapped
  const outputToken = MEVFreeCurrency

  const { data: inputTokenHoneypotInfo, loading: inputTokenHpLoading } = useHoneyPotInfo(inputToken)
  const { data: outputTokenHoneypotInfo, loading: outputTokenHpLoading } = useHoneyPotInfo(outputToken)

  const outputMaxTx = ethers.utils.formatUnits(outputTokenHoneypotInfo.maxTransaction)

  const handleMaxTxOutput = useCallback(() => {
    outputMaxTx && onUserInput(Field.OUTPUT, outputMaxTx)
  }, [onUserInput, outputMaxTx])

  useEffect(() => {
    onCurrencySelection(Field.OUTPUT, MEVFreeCurrency)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // <-- empty dependency array

  const userMBalance = useTokenBalance(account ? account : undefined, MEVFreeToken)

  let tokenBalance = false

  if (userMBalance) {
    tokenBalance = Number(userMBalance.toExact()) >= MEVFREE_MIN_BALANCE ? true : false
  }

  const navigate = useNavigate()
  const handleDismissSimpleSwap = useCallback(() => {
    navigate('/swap/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (tokenBalance) {
    handleDismissSimpleSwap()
  }

  return (
    <>
      <BodyWrapper3>
        <AppBody idString={'swap-id'}>
          <SimpleSwapHeader allowedSlippage={allowedSlippage} targetContent={'swap-id'} />
          <Wrapper id="swap-page">
            <ConfirmSwapModal
              isOpen={showConfirm}
              trade={trade}
              originalTrade={tradeToConfirm}
              onAcceptChanges={handleAcceptChanges}
              attemptingTxn={attemptingTxn}
              txHash={txHash}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onConfirm={handleSwap}
              swapErrorMessage={swapErrorMessage}
              onDismiss={handleConfirmDismiss}
            />

            <AutoColumn gap={'sm'}>
              <div style={{ display: 'relative' }}>
                <AutoRow justify="space-between" style={{ padding: '0 1rem 8px' }}>
                  <LabelWrapper>Input Token:</LabelWrapper>
                </AutoRow>
                <CurrencyInputPanel
                  label={
                    independentField === Field.OUTPUT && !showWrap ? <Trans>From (at most)</Trans> : <Trans>From</Trans>
                  }
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={true}
                  showMaxTxButton={false}
                  currency={currencies[Field.INPUT] ?? null}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onHalf={handleHalfInput}
                  onQuarter={handleQuarterInput}
                  fiatValue={fiatValueInput ?? undefined}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={MEVFreeCurrency ?? null}
                  showCommonBases={true}
                  id="swap-currency-input"
                  loading={independentField === Field.OUTPUT && routeIsSyncing}
                  tokenHoneypotInfo={inputTokenHoneypotInfo}
                  tokenHpLoading={inputTokenHpLoading}
                />
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <LabelWrapper>Output Token:</LabelWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Enable Send To (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.OUTPUT]}
                  onUserInput={handleTypeOutput}
                  label={
                    independentField === Field.INPUT && !showWrap ? <Trans>To (at least)</Trans> : <Trans>To</Trans>
                  }
                  showMaxButton={false}
                  showMaxTxButton={true}
                  onMaxTx={handleMaxTxOutput}
                  hideBalance={false}
                  fiatValue={fiatValueOutput ?? undefined}
                  priceImpact={priceImpact}
                  currency={MEVFreeCurrency ?? null}
                  otherCurrency={currencies[Field.INPUT]}
                  showCommonBases={true}
                  id="swap-currency-output"
                  loading={independentField === Field.INPUT && routeIsSyncing}
                  tokenHoneypotInfo={outputTokenHoneypotInfo}
                  tokenHpLoading={outputTokenHpLoading}
                />
              </div>

              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      <Trans>- Remove recipient</Trans>
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}
              {!showWrap && userHasSpecifiedInputOutput && (trade || routeIsLoading || routeIsSyncing) && (
                <SwapDetailsDropdown
                  trade={trade}
                  syncing={routeIsSyncing}
                  loading={routeIsLoading}
                  showInverted={showInverted}
                  setShowInverted={setShowInverted}
                  allowedSlippage={allowedSlippage}
                />
              )}
              <div>
                {swapIsUnsupported ? (
                  <ButtonPrimary disabled={true}>
                    <ThemedText.Main mb="4px">
                      <Trans>Unsupported Asset</Trans>
                    </ThemedText.Main>
                  </ButtonPrimary>
                ) : !account ? (
                  <ButtonLight onClick={toggleWalletModal}>
                    <Trans>Connect Wallet</Trans>
                  </ButtonLight>
                ) : showWrap ? (
                  <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                    {wrapInputError ? (
                      <WrapErrorText wrapInputError={wrapInputError} />
                    ) : wrapType === WrapType.WRAP ? (
                      <Trans>Wrap</Trans>
                    ) : wrapType === WrapType.UNWRAP ? (
                      <Trans>Unwrap</Trans>
                    ) : null}
                  </ButtonPrimary>
                ) : routeNotFound && userHasSpecifiedInputOutput && !routeIsLoading && !routeIsSyncing ? (
                  <GreyCard style={{ textAlign: 'center' }}>
                    <ThemedText.Main mb="4px">
                      <Trans>Insufficient liquidity for this trade.</Trans>
                      {singleHopOnly && <Text color="textSubtle">{'Try enabling multi-hop trades.'}</Text>}
                    </ThemedText.Main>
                  </GreyCard>
                ) : showApproveFlow ? (
                  <AutoRow style={{ flexWrap: 'nowrap', width: '100%' }}>
                    <AutoColumn style={{ width: '100%' }} gap="12px">
                      <ButtonConfirmed
                        onClick={handleApprove}
                        disabled={
                          approvalState !== ApprovalState.NOT_APPROVED ||
                          approvalSubmitted ||
                          signatureState === UseERC20PermitState.SIGNED
                        }
                        width="100%"
                        altDisabledStyle={approvalState === ApprovalState.PENDING} // show solid button while waiting
                        confirmed={
                          approvalState === ApprovalState.APPROVED || signatureState === UseERC20PermitState.SIGNED
                        }
                      >
                        <AutoRow justify="space-between" style={{ flexWrap: 'nowrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <CurrencyLogo
                              currency={currencies[Field.INPUT]}
                              size={'20px'}
                              style={{ marginRight: '8px', flexShrink: 0 }}
                            />
                            {/* we need to shorten this string on mobile */}
                            {approvalState === ApprovalState.APPROVED ||
                            signatureState === UseERC20PermitState.SIGNED ? (
                              <Trans>You can now trade {currencies[Field.INPUT]?.symbol}</Trans>
                            ) : (
                              <Trans>
                                Allow the {info.label} to use your {currencies[Field.INPUT]?.symbol}
                              </Trans>
                            )}
                          </span>
                          {approvalState === ApprovalState.PENDING ? (
                            <Loader stroke="white" />
                          ) : (approvalSubmitted && approvalState === ApprovalState.APPROVED) ||
                            signatureState === UseERC20PermitState.SIGNED ? (
                            <CheckCircle size="20" color={theme.green1} />
                          ) : (
                            <MouseoverTooltip
                              text={
                                <Trans>
                                  You must give the {info.label} smart contracts permission to use your{' '}
                                  {currencies[Field.INPUT]?.symbol}. You only have to do this once per token.
                                </Trans>
                              }
                            >
                              <HelpCircle size="20" color={'white'} style={{ marginLeft: '8px' }} />
                            </MouseoverTooltip>
                          )}
                        </AutoRow>
                      </ButtonConfirmed>
                      <ButtonError
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              showConfirm: true,
                              txHash: undefined,
                            })
                          }
                        }}
                        width="100%"
                        id="swap-button"
                        disabled={
                          !isValid ||
                          routeIsSyncing ||
                          routeIsLoading ||
                          (approvalState !== ApprovalState.APPROVED && signatureState !== UseERC20PermitState.SIGNED) ||
                          priceImpactTooHigh
                        }
                        error={isValid && priceImpactSeverity > 2}
                      >
                        <Text fontSize={16} fontWeight={500}>
                          {priceImpactTooHigh ? (
                            <Trans>High Price Impact</Trans>
                          ) : trade && priceImpactSeverity > 2 ? (
                            <Trans>Send Transaction Anyway</Trans>
                          ) : (
                            <Trans>Send Transaction</Trans>
                          )}
                        </Text>
                      </ButtonError>
                    </AutoColumn>
                  </AutoRow>
                ) : (
                  <ButtonError
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        })
                      }
                    }}
                    id="swap-button"
                    disabled={!isValid || routeIsSyncing || routeIsLoading || priceImpactTooHigh || !!swapCallbackError}
                    error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {swapInputError ? (
                        swapInputError
                      ) : routeIsSyncing || routeIsLoading ? (
                        <Trans>Send Transaction</Trans>
                      ) : priceImpactSeverity > 2 ? (
                        <Trans>Send Transaction Anyway</Trans>
                      ) : priceImpactTooHigh ? (
                        <Trans>Price Impact Too High</Trans>
                      ) : (
                        <Trans>Send Transaction</Trans>
                      )}
                    </Text>
                  </ButtonError>
                )}
                {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
              </div>
            </AutoColumn>
          </Wrapper>
        </AppBody>
      </BodyWrapper3>
      <AlertWrapper>
        <NetworkAlert />
        <ErrorContainer></ErrorContainer>
      </AlertWrapper>
      <SwitchLocaleLink />
      {!swapIsUnsupported ? null : (
        <UnsupportedCurrencyFooter
          show={swapIsUnsupported}
          currencies={[currencies[Field.INPUT], currencies[Field.OUTPUT]]}
        />
      )}
    </>
  )
}

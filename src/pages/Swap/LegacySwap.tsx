import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import SwapIcon from 'assets/images/swap-icon.png'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import NewTokensHeader from 'components/NewTokens/NewTokensHeader'
import { LegacySwapDetailsDropdown } from 'components/swap/SwapDetailsDropdown'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { TokenResults } from 'components/Tokens/Index'
import { LegacyTokenChartHeader } from 'components/Tokens/TokenChart/TokenChartHeader'
import TokenHeader from 'components/Tokens/TokensHeader'
import { MouseoverTooltip } from 'components/Tooltip'
import TrendingTokensHeader from 'components/TrendingTokens/TrendingTokensHeader'
import { SupportedChainId } from 'constants/chains'
import { ROUTER_INFO } from 'constants/routerInfo'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useCurrencyConvertedToNative, useHoneyPotInfo } from 'hooks/useTokenInfo'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import JSBI from 'jsbi'
import { Currency, CurrencyAmount, Token, TradeType } from 'mevswap/sdk-core'
import { PAIR } from 'mevswap/v2-sdk/constants'
import { Trade as V2Trade } from 'mevswap/v2-sdk/entities'
import { LegacyPriceChartContainer } from 'pages/TokenDetails/PriceChartContainer'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CheckCircle, HelpCircle } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'
import { isMobile } from 'utils/userAgent'

import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonConfirmed, ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { GreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import Loader from '../../components/Loader'
import { AutoRow } from '../../components/Row'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ConfirmLegacySwapModal } from '../../components/swap/ConfirmSwapModal'
import LegacySwapHeader from '../../components/swap/LegacySwapHeader'
import { ArrowWrapper, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import TokenWarningModal from '../../components/TokenWarningModal'
import { nativeOnChain, TOKEN_SHORTHANDS } from '../../constants/tokens'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useERC20PermitFromTrade, UseERC20PermitState } from '../../hooks/useERC20Permit'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import { useStablecoinValue } from '../../hooks/useStablecoinPrice'
import useWrapCallback, { WrapErrorText, WrapType } from '../../hooks/useWrapCallback'
import { useToggleWalletModal } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useLegacyDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import {
  useExpertModeManager,
  useUserHideZeroBalance,
  useUserLargeChart,
  useUserShowChart,
  useUserShowChartOnMobile,
  useUserSingleHopOnly,
} from '../../state/user/hooks'
import { LinkStyledButton, ThemedText } from '../../theme'
import { computeFiatValuePriceImpact } from '../../utils/computeFiatValuePriceImpact'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { warningSeverity } from '../../utils/prices'
import { supportedChainId } from '../../utils/supportedChainId'
import { AppBody, AppBody2, AppBody3 } from '../AppBody'

const BodyWrapper = styled.div<{ $showLargeChart: boolean }>`
  display: grid;
  grid-template-columns: ${({ $showLargeChart }) => ($showLargeChart ? '3fr 1fr' : '2fr 1fr 1fr')};
  width: 100%;
  padding: 10px 16px 0px 16px;
  column-gap: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 10px 8px 0px 8px;
    grid-template-columns: 1fr 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 10px 4px 0px 4px;
    grid-template-columns: 1fr;
  `};
`

const TrendingWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  padding: 10px 16px 0px 16px;
  margin-left: auto;
  margin-right: auto;
  z-index: 1;
`

const LabelWrapper = styled.div`
  padding: 2px 2px 2px 2px;
`

const InnerWrapper = styled.div`
  display: auto;
  width: 100%;
  height: 85%;
  padding: 4px 0 4px 0;
  margin-left: auto;
  margin-right: auto;
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

export default function LegacySwap() {
  const [rotate, setRotate] = useState(false)
  const navigate = useNavigate()
  const { account, chainId } = useWeb3React()
  const loadedUrlParams = useDefaultsFromURLSearch()

  const [hideZeroBalance] = useUserHideZeroBalance()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.[Field.INPUT]?.currencyId),
    useCurrency(loadedUrlParams?.[Field.OUTPUT]?.currencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault = useMemo(
    () =>
      urlLoadedTokens &&
      urlLoadedTokens
        .filter((token: Token) => {
          return !Boolean(token.address in defaultTokens)
        })
        .filter((token: Token) => {
          // Any token addresses that are loaded from the shorthands map do not need to show the import URL
          const supported = supportedChainId(chainId)
          if (!supported) return true
          return !Object.keys(TOKEN_SHORTHANDS).some((shorthand) => {
            const shorthandTokenAddress = TOKEN_SHORTHANDS[shorthand][supported]
            return shorthandTokenAddress && shorthandTokenAddress === token.address
          })
        }),
    [chainId, defaultTokens, urlLoadedTokens]
  )

  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useToggleWalletModal()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  const [singleHopOnly] = useUserSingleHopOnly()

  const [showChart] = useUserShowChart()

  const [largeChart] = useUserLargeChart()

  const [showChartOnMobile] = useUserShowChartOnMobile()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v2Trade,
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    inputCurrency,
    outputCurrency,
  } = useLegacyDerivedSwapInfo()

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const trade = showWrap ? undefined : v2Trade

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

  // show price estimates based on wrap trade
  const inputValue = showWrap ? parsedAmount : trade?.inputAmount
  const outputValue = showWrap ? parsedAmount : trade?.outputAmount
  const fiatValueInput = useStablecoinValue(inputValue)
  const fiatValueOutput = useStablecoinValue(outputValue)
  const priceImpact = useMemo(
    () => computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput),
    [fiatValueInput, fiatValueOutput]
  )

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
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

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
    navigate('/swap/')
  }, [navigate])

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined
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

  const routeNotFound = !trade?.route

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
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
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

  const [showInverted, setShowInverted] = useState<boolean>(false)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
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
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const handleListSelect = useCallback(
    (inputCurrency: Currency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      const nativeCurrency = chainId
        ? nativeOnChain(chainId)
        : // select mainnet when not connected to avoid null problems
          nativeOnChain(SupportedChainId.MAINNET)
      onCurrencySelection(Field.INPUT, inputCurrency)
      onCurrencySelection(Field.OUTPUT, nativeCurrency)
    },
    [chainId, onCurrencySelection]
  )

  const swapIsUnsupported = useIsSwapUnsupported(currencies[Field.INPUT], currencies[Field.OUTPUT])

  const priceImpactTooHigh = priceImpactSeverity > 10 && !isExpertMode

  const info = ROUTER_INFO[PAIR.ROUTERID]

  const nativeInputCurrency = useCurrencyConvertedToNative(inputCurrency)
  const nativeOutputCurrency = useCurrencyConvertedToNative(outputCurrency)
  const inputToken = nativeInputCurrency?.wrapped
  const outputToken = nativeOutputCurrency?.wrapped

  const { data: inputTokenHoneypotInfo, loading: inputTokenHpLoading } = useHoneyPotInfo(inputToken)
  const { data: outputTokenHoneypotInfo, loading: outputTokenHpLoading } = useHoneyPotInfo(outputToken)

  const chartMaxWidth = largeChart ? '2800px' : '1600px'

  return (
    <>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleDismissTokenWarning}
      />
      <BodyWrapper $showLargeChart={largeChart}>
        {showChart && !isMobile && (
          <AppBody3 maxWidth={chartMaxWidth} idString={'legacy-chart-id-1'}>
            <AutoColumn>
              <LegacyTokenChartHeader
                inputCurrency={inputCurrency}
                outputCurrency={outputCurrency}
                nativeInputCurrency={nativeInputCurrency}
                nativeOutputCurrency={nativeOutputCurrency}
                currencies={currencies}
                v2Trade={trade}
                isChartDisplayed={showChart}
                showInverted={showInverted}
                setShowInverted={setShowInverted}
                targetContent={'legacy-chart-id-1'}
              ></LegacyTokenChartHeader>
              <LegacyPriceChartContainer
                inputCurrency={inputCurrency}
                outputCurrency={outputCurrency}
                nativeInputCurrency={nativeInputCurrency}
                nativeOutputCurrency={nativeOutputCurrency}
                currencies={currencies}
                v2Trade={trade}
                isChartDisplayed={showChart}
                showInverted={showInverted}
                setShowInverted={setShowInverted}
                inputTokenHoneypotInfo={inputTokenHoneypotInfo}
                inputTokenHpLoading={inputTokenHpLoading}
                outputTokenHoneypotInfo={outputTokenHoneypotInfo}
                outputTokenHpLoading={outputTokenHpLoading}
              />
            </AutoColumn>
          </AppBody3>
        )}
        {!showChart && !isMobile && (
          <AppBody2>
            <TokenHeader
              isOpen={showConfirm}
              onCurrencySelect={handleListSelect}
              selectedCurrency={currencies[Field.INPUT]}
              otherSelectedCurrency={currencies[Field.OUTPUT]}
              showCommonBases={false}
              showCurrencyAmount={true}
              disableNonToken={false}
            ></TokenHeader>
            <InnerWrapper>
              <TokenResults
                onCurrencySelect={handleListSelect}
                selectedCurrency={currencies[Field.INPUT]}
                otherSelectedCurrency={currencies[Field.OUTPUT]}
                showCommonBases={false}
                hideZeroBalanceTokens={hideZeroBalance}
                showCurrencyAmount={true}
                disableNonToken={false}
                onMax={handleMaxInput}
              />
            </InnerWrapper>
          </AppBody2>
        )}
        <AppBody idString={'legacy-swap-id'}>
          <LegacySwapHeader allowedSlippage={allowedSlippage} />
          <Wrapper id="swap-page">
            <ConfirmLegacySwapModal
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
                  showMaxButton={showMaxButton}
                  showMaxTxButton={false}
                  currency={currencies[Field.INPUT] ?? null}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  fiatValue={fiatValueInput ?? undefined}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  showCommonBases={true}
                  id="swap-currency-input"
                  loading={false}
                />
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <LabelWrapper>Output Token:</LabelWrapper>
                  <ArrowWrapper rotated={rotate}>
                    <img
                      src={SwapIcon}
                      alt="SwapIcon"
                      width="24"
                      height="24"
                      onClick={() => {
                        setApprovalSubmitted(false) // reset 2 step UI for approvals
                        onSwitchTokens()
                        setRotate((prev) => !prev)
                      }}
                    />
                  </ArrowWrapper>
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
                  showMaxTxButton={false}
                  hideBalance={false}
                  fiatValue={fiatValueOutput ?? undefined}
                  priceImpact={priceImpact}
                  currency={currencies[Field.OUTPUT] ?? null}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  showCommonBases={true}
                  id="swap-currency-output"
                  loading={false}
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
              {!showWrap && userHasSpecifiedInputOutput && (
                <LegacySwapDetailsDropdown
                  trade={trade}
                  syncing={false}
                  loading={false}
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
                ) : routeNotFound && userHasSpecifiedInputOutput ? (
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
                          (approvalState !== ApprovalState.APPROVED && signatureState !== UseERC20PermitState.SIGNED) ||
                          priceImpactTooHigh
                        }
                        error={isValid && priceImpactSeverity > 3}
                      >
                        <Text fontSize={16} fontWeight={500}>
                          {priceImpactTooHigh ? (
                            <Trans>High Price Impact</Trans>
                          ) : trade && priceImpactSeverity > 3 ? (
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
                    disabled={!isValid || priceImpactTooHigh || !!swapCallbackError}
                    error={isValid && priceImpactSeverity > 3 && !swapCallbackError}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {swapInputError ? (
                        swapInputError
                      ) : priceImpactSeverity > 3 ? (
                        <Trans>Send Transaction Anyway</Trans>
                      ) : priceImpactTooHigh ? (
                        <Trans>Price Impact Too High</Trans>
                      ) : (
                        <Trans>Send Transaction</Trans>
                      )}
                    </Text>
                  </ButtonError>
                )}
                {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
              </div>
            </AutoColumn>
          </Wrapper>
        </AppBody>
        {showChart && isMobile && showChartOnMobile && (
          <AppBody3 idString={'legacy-chart-id-2'}>
            <AutoColumn>
              <LegacyTokenChartHeader
                inputCurrency={inputCurrency}
                outputCurrency={outputCurrency}
                nativeInputCurrency={nativeInputCurrency}
                nativeOutputCurrency={nativeOutputCurrency}
                currencies={currencies}
                v2Trade={trade}
                isChartDisplayed={showChart}
                showInverted={showInverted}
                setShowInverted={setShowInverted}
                targetContent={'legacy-chart-id-2'}
              ></LegacyTokenChartHeader>
              <LegacyPriceChartContainer
                inputCurrency={inputCurrency}
                outputCurrency={outputCurrency}
                nativeInputCurrency={nativeInputCurrency}
                nativeOutputCurrency={nativeOutputCurrency}
                currencies={currencies}
                v2Trade={trade}
                isChartDisplayed={showChart}
                showInverted={showInverted}
                setShowInverted={setShowInverted}
                inputTokenHoneypotInfo={inputTokenHoneypotInfo}
                inputTokenHpLoading={inputTokenHpLoading}
                outputTokenHoneypotInfo={outputTokenHoneypotInfo}
                outputTokenHpLoading={outputTokenHpLoading}
              />
            </AutoColumn>
          </AppBody3>
        )}
        {((showChart && !isMobile) ||
          (showChart && isMobile && !showChartOnMobile) ||
          (!showChart && isMobile) ||
          (showChart && isMobile && showChartOnMobile)) && (
          <AppBody2>
            <TokenHeader
              isOpen={showConfirm}
              onCurrencySelect={handleListSelect}
              selectedCurrency={currencies[Field.INPUT]}
              otherSelectedCurrency={currencies[Field.OUTPUT]}
              showCommonBases={false}
              showCurrencyAmount={true}
              disableNonToken={false}
            ></TokenHeader>
            <InnerWrapper>
              <TokenResults
                onCurrencySelect={handleListSelect}
                selectedCurrency={currencies[Field.INPUT]}
                otherSelectedCurrency={currencies[Field.OUTPUT]}
                showCommonBases={false}
                hideZeroBalanceTokens={hideZeroBalance}
                showCurrencyAmount={true}
                disableNonToken={false}
                onMax={handleMaxInput}
              />
            </InnerWrapper>
          </AppBody2>
        )}
        {!showChart && (
          <AppBody2>
            <NewTokensHeader></NewTokensHeader>
          </AppBody2>
        )}
      </BodyWrapper>
      {showChart && (
        <AppBody2>
          <NewTokensHeader></NewTokensHeader>
        </AppBody2>
      )}
      <TrendingWrapper>
        <AppBody idString={''}>
          <AutoColumn>
            <TrendingTokensHeader></TrendingTokensHeader>
            <ErrorContainer></ErrorContainer>
          </AutoColumn>
        </AppBody>
      </TrendingWrapper>
      <AlertWrapper>
        <NetworkAlert />
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

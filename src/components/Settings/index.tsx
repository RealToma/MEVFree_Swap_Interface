// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { isSupportedChainId } from 'lib/hooks/routing/clientSideSmartOrderRouter'
import { Percent } from 'mevswap/sdk-core'
import { useContext, useRef, useState } from 'react'
import { Settings, X } from 'react-feather'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'
import { isMobile } from 'utils/userAgent'

import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useModalIsOpen, useToggleSettingsMenu } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import {
  useClientSideRouter,
  useExpertModeManager,
  useUserBoldTheme,
  useUserHideZeroBalance,
  useUserLargeChart,
  useUserLegacyMode,
  useUserShowChart,
  useUserShowChartOnMobile,
  useUserShowTickerTape,
  useUserSingleHopOnly,
  useUserTurboMode,
} from '../../state/user/hooks'
import { ThemedText } from '../../theme'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import Toggle from '../Toggle'
import TransactionSettings from '../TransactionSettings'

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  stroke: ${({ theme }) => theme.text1};

  :hover {
    stroke: ${({ theme }) => theme.mevblue};
    opacity: 0.7;
  }
`

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
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
const EmojiWrapper = styled.div`
  position: absolute;
  bottom: -6px;
  right: 0px;
  font-size: 14px;
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 20.125rem;
  background-color: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  border-style: solid;
  border-width: 2px;
  border-color: ${({ theme }) => theme.mevblue};
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2rem;
  right: 0rem;
  z-index: 99;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    min-width: 18.125rem;
  `};

  user-select: none;
`

const Break = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg3};
`

const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 20px;
`

export default function SettingsTab({
  placeholderSlippage,
  legacyMode,
}: {
  placeholderSlippage: Percent
  legacyMode: boolean
}) {
  const { chainId } = useWeb3React()

  const node = useRef<HTMLDivElement>()
  const open = useModalIsOpen(ApplicationModal.SETTINGS)
  const toggle = useToggleSettingsMenu()

  const theme = useContext(ThemeContext)

  const [expertMode, toggleExpertMode] = useExpertModeManager()

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  const [turboMode, setTurboMode] = useUserTurboMode()

  const [swapLegacyMode, setLegacyMode] = useUserLegacyMode()

  const [showTickerTape, setShowTickerTape] = useUserShowTickerTape()

  const [boldTheme, setBoldTheme] = useUserBoldTheme()

  const [hideZeroBalance, setHideZeroBalance] = useUserHideZeroBalance()

  const [largeChart, setLargeChart] = useUserLargeChart()

  const [showChartOnMobile, setShowChartOnMobile] = useUserShowChartOnMobile()

  const [showChart, setShowChart] = useUserShowChart()

  const [clientSideRouter, setClientSideRouter] = useClientSideRouter()

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false)

  useOnClickOutside(node, open ? toggle : undefined)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <AutoColumn gap="lg">
            <RowBetween style={{ padding: '0 2rem' }}>
              <div />
              <Text fontWeight={500} fontSize={20}>
                <Trans>Are you sure?</Trans>
              </Text>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <Text fontWeight={500} fontSize={20}>
                <Trans>
                  Ape mode turns off the confirm transaction prompt and enables certain other Power User features.
                </Trans>
              </Text>
              <Text fontWeight={600} fontSize={20}>
                <Trans>Only use this mode if you are a true Ape and know what you are doing.</Trans>
              </Text>
              <ButtonError
                error={true}
                padding={'12px'}
                onClick={() => {
                  const confirmWord = t`ape`
                  if (window.prompt(t`Please type the word "${confirmWord}" to enable expert mode.`) === confirmWord) {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                }}
              >
                <Text fontSize={20} fontWeight={500} id="confirm-expert-mode">
                  <Trans>Turn On Ape Mode</Trans>
                </Text>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button" aria-label={t`Transaction Settings`}>
        <StyledMenuIcon />
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: '1rem' }}>
            <Text fontWeight={600} fontSize={16}>
              <Trans>Swap Transaction Settings</Trans>
            </Text>
            <TransactionSettings placeholderSlippage={placeholderSlippage} />
            <Text fontWeight={600} fontSize={14}>
              <Trans>Interface Settings</Trans>
            </Text>
            {isSupportedChainId(chainId) && chainId === SupportedChainId.MAINNET && (
              <RowBetween>
                <RowFixed>
                  <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                    <Trans>Use Legacy Router</Trans>
                  </ThemedText.Black>
                  <QuestionHelper
                    text={
                      <Trans>
                        Use the Legacy Router to get faster quotes - albeit poitentially less profitable quotes.
                      </Trans>
                    }
                  />
                </RowFixed>
                <Toggle
                  id="toggle-legacy-router-button"
                  isActive={swapLegacyMode}
                  toggle={() => {
                    setLegacyMode(!swapLegacyMode)
                  }}
                />
              </RowBetween>
            )}
            {isSupportedChainId(chainId) && !legacyMode && !swapLegacyMode && (
              <RowBetween>
                <RowFixed>
                  <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                    <Trans>Cloud Auto Router</Trans>
                  </ThemedText.Black>
                  <QuestionHelper text={<Trans>Use the Cloud Auto Router API to get faster quotes.</Trans>} />
                </RowFixed>
                <Toggle
                  id="toggle-optimized-router-button"
                  isActive={!clientSideRouter}
                  toggle={() => {
                    setClientSideRouter(!clientSideRouter)
                  }}
                />
              </RowBetween>
            )}
            {isSupportedChainId(chainId) && (
              <RowBetween>
                <RowFixed>
                  <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                    <Trans>Disable Multihops</Trans>
                  </ThemedText.Black>
                  <QuestionHelper text={<Trans>Restricts swaps to direct pairs only.</Trans>} />
                </RowFixed>
                <Toggle
                  id="toggle-disable-multihop-button"
                  isActive={singleHopOnly}
                  toggle={() => {
                    setSingleHopOnly(!singleHopOnly)
                  }}
                />
              </RowBetween>
            )}
            {isSupportedChainId(chainId) && chainId === SupportedChainId.MAINNET && (
              <RowBetween>
                <RowFixed>
                  <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                    <Trans>Use Turbo Mode</Trans>
                  </ThemedText.Black>
                  <QuestionHelper
                    text={
                      <Trans>
                        Use Turbo Mode for updates once every 3 seconds - caution will use more energy and more data.
                      </Trans>
                    }
                  />
                </RowFixed>
                <Toggle
                  id="toggle-show-ticker-tape-button"
                  isActive={turboMode}
                  toggle={() => {
                    setTurboMode(!turboMode)
                  }}
                />
              </RowBetween>
            )}
            <RowBetween>
              <RowFixed>
                <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans>Bold Theme</Trans>
                </ThemedText.Black>
                <QuestionHelper text={<Trans>Use Bold Theme.</Trans>} />
              </RowFixed>
              <Toggle
                id="toggle-bold-theme"
                isActive={boldTheme}
                toggle={() => {
                  setBoldTheme(!boldTheme)
                }}
              />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans>Hide Zero Balances</Trans>
                </ThemedText.Black>
                <QuestionHelper text={<Trans>Hide Zero Balances in Your Portfolio.</Trans>} />
              </RowFixed>
              <Toggle
                id="toggle-zero-balance"
                isActive={hideZeroBalance}
                toggle={() => {
                  setHideZeroBalance(!hideZeroBalance)
                }}
              />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans>Display Ticker Tape</Trans>
                </ThemedText.Black>
                <QuestionHelper text={<Trans>Displays the Ticker Tape on the MEV Swap Homepage.</Trans>} />
              </RowFixed>
              <Toggle
                id="toggle-show-ticker-tape-button"
                isActive={showTickerTape}
                toggle={() => {
                  setShowTickerTape(!showTickerTape)
                }}
              />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans>Show Chart</Trans>
                </ThemedText.Black>
                <QuestionHelper text={<Trans>Displays the currently selected Token Chart.</Trans>} />
              </RowFixed>
              <Toggle
                id="toggle-show-chart-on-mobile-button"
                isActive={showChart}
                toggle={() => {
                  setShowChart(!showChart)
                }}
              />
            </RowBetween>
            {showChart && isMobile && (
              <RowBetween>
                <RowFixed>
                  <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                    <Trans>Show Chart On Mobile</Trans>
                  </ThemedText.Black>
                  <QuestionHelper
                    text={<Trans>Displays the currently selected Token Chart on Mobile devices.</Trans>}
                  />
                </RowFixed>
                <Toggle
                  id="toggle-show-chart-on-mobile-button"
                  isActive={showChartOnMobile}
                  toggle={() => {
                    setShowChartOnMobile(!showChartOnMobile)
                  }}
                />
              </RowBetween>
            )}
            {showChart && !isMobile && (
              <RowBetween>
                <RowFixed>
                  <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                    <Trans>Use Large Chart</Trans>
                  </ThemedText.Black>
                  <QuestionHelper text={<Trans>Displays an expanded large chart on desktop.</Trans>} />
                </RowFixed>
                <Toggle
                  id="toggle-large-chart-button"
                  isActive={largeChart}
                  toggle={() => {
                    setLargeChart(!largeChart)
                  }}
                />
              </RowBetween>
            )}
            <RowBetween>
              <RowFixed>
                <ThemedText.Black fontWeight={400} fontSize={14} color={theme.text2}>
                  <Trans>Ape Mode</Trans>
                </ThemedText.Black>
                <QuestionHelper
                  text={
                    <Trans>Allow high price impact trades and skip the confirm screen. Use at your own risk.</Trans>
                  }
                />
              </RowFixed>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        toggleExpertMode()
                        setShowConfirmation(false)
                      }
                    : () => {
                        toggle()
                        setShowConfirmation(true)
                      }
                }
              />
            </RowBetween>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}

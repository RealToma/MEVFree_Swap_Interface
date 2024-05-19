import { Trans } from '@lingui/macro'
import Column from 'components/Column'
import Loader from 'components/Loader'
import Row, { RowBetween, RowFixed } from 'components/Row'
import { Flex } from 'components/UIKit'
// eslint-disable-next-line no-restricted-imports
import { ethers } from 'ethers'
import { computeRatio, formatAge, formatDeployerCreations, formatRatio } from 'hooks/useTokenInfo'
import { Token } from 'mevswap/sdk-core'
import { memo, useContext } from 'react'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'
import { CloseIcon, ExternalLink } from 'theme'

import Modal from '../../Modal'
import { PaddedColumn } from '../../SearchModal/styleds'

const ContentWrapper = styled(Column)`
  width: 100%;
  height: 100%
  position: relative;
  border-style: solid;
  border-width: 2px;
  border-color: ${({ theme }) => theme.mevorange};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 4px;
`

const TokenContentWrapper = styled(Column)`
  width: 100%;
  display: grid;
  position: relative;
  border-style: none;
  height: 100%;
  padding: 0 0 8px 8px;
  overflow-x: hidden;
  overflow-y: auto;
`
const LoadingContentWrapper = styled(Column)`
  align-items: center;
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
  border-style: none;
  padding: auto;
`

// can't be customized under react-router-dom v6
// so we have to persist to the default one, i.e., .active
const activeClassName = 'active'

const StyledExternalLink = styled(ExternalLink)`
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.blue2};
  font-size: 16px;
  width: fit-content;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &.${activeClassName} {
    border-radius: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.mevorange};
    background-color: ${({ theme }) => theme.bg2};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.mevblue};
  }
`

interface SocialObject {
  key: number
  name: string
  url: string
}

export function formatSocials(socials: string[]): SocialObject[] {
  const links: SocialObject[] = []

  Object.keys(socials).forEach((name, key) => {
    const object = {} as SocialObject
    object.key = key
    object.name = name
    object.url = socials[name]
    links.push(object)
  })

  return links
}

export function formatDeployer(deploys: string[]): SocialObject[] {
  const links: SocialObject[] = []

  let key = 0
  for (const social of deploys) {
    key++
    const [name, url] = Object.entries(social)[0]
    const object = {} as SocialObject
    object.key = key
    object.name = name
    object.url = 'https://etherscan.io/address/' + url
    links.push(object)
  }

  return links
}

interface TokenInfoModalProps {
  isOpen: boolean
  onDismiss: () => void
  currency: Token | null
  data?: any
  loading?: boolean
}

export default memo(function TokenInfoModal(
  this: any,
  { isOpen, onDismiss, currency, data, loading }: TokenInfoModalProps
) {
  const theme = useContext(ThemeContext)
  const minHeight: number | undefined = 40

  if (loading) {
    return (
      <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={160} minHeight={minHeight}>
        <ContentWrapper>
          <PaddedColumn gap="4px">
            <RowBetween>
              <Text fontWeight={500} fontSize={16}>
                {currency ? <Trans>Token Information</Trans> : <Trans>Token Information Not Found</Trans>}
              </Text>
              <CloseIcon onClick={onDismiss} />
            </RowBetween>
          </PaddedColumn>
          <LoadingContentWrapper>
            <Loader size="100px" />
          </LoadingContentWrapper>
        </ContentWrapper>
      </Modal>
    )
  }

  const inputMaxTx = ethers.utils.formatUnits(data.maxTransaction)
  const inputMaxWallet = ethers.utils.formatUnits(data.maxWallet)
  const NOT_AVAIALBLE = '--'
  const inputFetched = data?.fetched

  const age = formatAge(data.age)
  const mcap = data.pairMcap
  const decimalse = data.pairPrice.toString().split('.')[1]
  const zeros = decimalse.match(/0*/)
  const mFD = decimalse.match(/e/g)
    ? parseInt(decimalse.match(/e-.*/g)?.[0].slice(2)) + 3
    : zeros?.[0].length !== 0
    ? zeros?.[0].length + 3
    : 2
  const price = data.pairPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: mFD,
  })

  const hp: boolean = data.isHoneypot === true ? true : false
  const lp = data.pairLiquidity
  const address = currency?.address
  const lpRatio = (lp / mcap) * 100
  const buyTax = data.buyTax
  const sellTax = data.sellTax
  const buyCost = data.buyCost
  const sellCost = data.sellCost
  const creations = data.deployerCreations ? formatDeployerCreations(data.deployerCreations) : ''
  const pairSymbol = data.pairBaseTokenSymbol
  const inputCurrency = data.pairBaseTokenSymbol === 'WETH' ? 'ETH' : data.pairBaseTokenAddress
  const outputCurrency = currency
  const addressLink = 'https://etherscan.io/address/' + address
  const ownerLink = 'https://etherscan.io/address/' + (data.owner ? data.owner : data.deployer)
  const exactAmount = data.maxTransaction ? Number(data.maxTransaction.hex) / 10 ** data.decimals : 1
  const maxTxRatio = data.maxTransaction
    ? computeRatio(data.maxTransaction.hex, data.decimals, data.totalSupply.hex)
    : ''
  const maxTx = data.maxTransaction
    ? Number(data.maxTransaction.hex) / 10 ** data.decimals + ' ' + data.symbol + maxTxRatio
    : 'No limit detected'
  const maxWalletRatio = data.maxWallet ? computeRatio(data.maxWallet.hex, data.decimals, data.totalSupply.hex) : ''
  const maxWallet = data.maxWallet
    ? Number(data.maxWallet.hex) / 10 ** data.decimals + ' ' + data.symbol + maxWalletRatio
    : 'No limit detected'
  const status = data.isVerified ? 'Verified ☑️' : data.isVerified === false ? 'Not verified ✖️' : 'Unable to verify'
  let status_text = ''
  let status_text2 = ''
  let tax_text = ''
  let warnings = ''
  let showWarning = false

  const socials: SocialObject[] = formatSocials(data.socials) || []
  const deployerCreations: SocialObject[] = formatDeployer(data.deployerCreations) || []

  const rowHeight = '18px'

  const dextoolsLink = 'https://www.dextools.io/app/en/ether/pair-explorer/' + data.pairAddress
  const dexscreenerLink = 'https://dexscreener.com/ethereum/' + data.pairAddress

  const combinedTaxes = +buyTax + +sellTax

  const honeypotText = '❌❌❌ SEEMS TO BE A HONEYPOT! ❌❌❌'
  const honeypotText2 = '❌❌❌ TRADE WITH CAUTION! ❌❌❌'

  if (combinedTaxes >= 40) {
    status_text = '⚠️⚠️ ‼️ Effectively a honeypot ‼️  ⚠️⚠️'
    if (lp > 0.5) {
      status_text2 = '⚠️ Can buy and sell but high taxes! ⚠️'
    } else {
      status_text2 = '⚠️ No liquidity ⚠️'
    }
  } else {
    status_text = '✅ Seems to be safe at this time ✅'
    if (lp > 0.5) {
      status_text2 = '✅ Can buy and sell ✅'
    } else {
      status_text2 = '⚠️ No liquidity ⚠️'
    }
  }

  if (hp) {
    status_text = honeypotText
    status_text2 = honeypotText2
  }

  if (sellTax >= 40) {
    tax_text = '❗️ Severe Buy/Sell Tax ❗️'
  } else if (sellTax >= 25 && sellTax < 40) {
    tax_text = '⚠️ Caution - High Buy/Sell Tax ⚠️'
  } else if (sellTax >= 15 && sellTax < 25) {
    tax_text = '❕ Moderate Buy/Sell Tax ❕'
  } else if (combinedTaxes === 0) {
    tax_text = 'Tax Free Token'
  }

  if (data.maxTransaction > 0.0) {
    if (formatRatio(data.maxTransaction.hex, data.decimals, data.totalSupply.hex) <= 0.1) {
      warnings = '⚠️ Caution - Low max tx ⚠️'
      showWarning = true
    } else {
      showWarning = false
    }
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={160} minHeight={minHeight}>
      <ContentWrapper>
        <PaddedColumn gap="2px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              {currency ? (
                <Trans>Token Information & Honeypot Status</Trans>
              ) : (
                <Trans>Token Information Not Found</Trans>
              )}
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        </PaddedColumn>
        <TokenContentWrapper>
          <Row>
            <Flex justifyContent="start" alignItems="baseline" flexWrap="wrap">
              {
                <>
                  {currency &&
                    (!currency.isNative ? (
                      <>
                        <Text style={{ width: '100%', textAlign: 'center' }}>{status_text}</Text>
                        <Text style={{ width: '100%', textAlign: 'center' }}>{status_text2}</Text>
                        {buyTax >= 10 || sellTax >= 10 ? (
                          <Text style={{ width: '100%', textAlign: 'center' }}>{tax_text}</Text>
                        ) : null}
                        {showWarning ? <Text style={{ width: '100%', textAlign: 'center' }}>{warnings}</Text> : null}
                        <br />
                        <br />
                        <RowFixed style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Token Name:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {data.name}
                            {'\xa0'}
                            {data.symbol}
                          </Text>
                        </RowFixed>
                        <br />
                        <br />
                        <RowFixed style={{ height: rowHeight }}>
                          <StyledExternalLink id={`address-link`} href={addressLink}>
                            {address}
                            <sup>↗</sup>
                          </StyledExternalLink>
                        </RowFixed>
                        <br />
                        <br />
                        <RowFixed style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Price:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {price}
                          </Text>
                        </RowFixed>
                        <Row style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Market Cap:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {'$'}
                            {mcap}
                          </Text>
                        </Row>
                        <RowFixed style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Liquidity:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {'$'}
                            {lp}
                          </Text>
                        </RowFixed>
                        <Row style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Age:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {age}
                          </Text>
                        </Row>
                        <br />
                        <br />
                        <RowFixed style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Buy Tax:</Trans>
                          </Text>
                          {'\xa0'}
                          {buyTax >= 40 ? (
                            <Text fontWeight={500} color={theme.red1} fontSize={16}>
                              {buyTax}%
                            </Text>
                          ) : (
                            <Text fontWeight={500} color={theme.text1} fontSize={16}>
                              {buyTax}%
                            </Text>
                          )}
                          {'\xa0'}
                          {'\xa0'}
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            <Trans>|</Trans>
                          </Text>
                          {'\xa0'}
                          {'\xa0'}
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Sell Tax:</Trans>
                          </Text>
                          {'\xa0'}
                          {sellTax >= 40 ? (
                            <Text fontWeight={500} color={theme.red1} fontSize={16}>
                              {sellTax}%
                            </Text>
                          ) : (
                            <Text fontWeight={500} color={theme.text1} fontSize={16}>
                              {sellTax}%
                            </Text>
                          )}
                        </RowFixed>
                        <RowFixed style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Buy Cost:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {buyCost}
                          </Text>
                          {'\xa0'}
                          {'\xa0'}
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            <Trans>|</Trans>
                          </Text>
                          {'\xa0'}
                          {'\xa0'}
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Sell Cost:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {sellCost}
                          </Text>
                        </RowFixed>
                        <br />
                        <br />
                        <RowFixed style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Contract:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {status}
                          </Text>
                          {'\xa0'}
                          {'\xa0'}
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            <Trans>|</Trans>
                          </Text>
                          {'\xa0'}
                          {'\xa0'}
                          {'\xa0'}
                          {data.isRenounced ? (
                            <Text fontWeight={500} color={theme.text1} fontSize={16}>
                              <Trans>Ownership Renounced</Trans>
                            </Text>
                          ) : (
                            <StyledExternalLink id={`owner-link`} href={ownerLink}>
                              <Trans>Owner (not renounced)</Trans>
                              <sup>↗</sup>
                            </StyledExternalLink>
                          )}
                        </RowFixed>
                        <Row style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Max Tx:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {inputMaxTx}
                          </Text>
                        </Row>
                        <br />
                        <Row style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text2} fontSize={16}>
                            <Trans>Max Wallet:</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            {inputMaxWallet}
                          </Text>
                        </Row>
                        {socials && socials?.length > 0 ? (
                          <>
                            <br />
                            <br />
                            <RowBetween style={{ height: rowHeight }}>
                              <Text fontWeight={500} color={theme.text1} fontSize={16}>
                                <Trans>Socials:</Trans>
                              </Text>
                            </RowBetween>
                            <br />
                            <Row style={{ height: rowHeight }}>
                              {socials.map((item) => (
                                <>
                                  <Row key={item.key}>
                                    <StyledExternalLink id={`social-link`} href={item.url}>
                                      <Trans>{item.name}</Trans>
                                      <sup>↗</sup>
                                    </StyledExternalLink>
                                  </Row>
                                </>
                              ))}
                            </Row>
                          </>
                        ) : null}
                        <br />
                        <br />
                        <RowBetween style={{ height: rowHeight }}>
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            <Trans>Links:</Trans>
                          </Text>
                        </RowBetween>
                        <RowBetween style={{ height: rowHeight }}>
                          <Row>
                            <StyledExternalLink id={`owner-link`} href={dextoolsLink}>
                              <Trans>Dextools</Trans>
                              <sup>↗</sup>
                            </StyledExternalLink>
                          </Row>
                          <Row>
                            <StyledExternalLink id={`owner-link`} href={dexscreenerLink}>
                              <Trans>Dexscreener</Trans>
                              <sup>↗</sup>
                            </StyledExternalLink>
                          </Row>
                          <Row>
                            <StyledExternalLink id={`owner-link`} href={ownerLink}>
                              <Trans>Deployer</Trans>
                              <sup>↗</sup>
                            </StyledExternalLink>
                          </Row>
                        </RowBetween>
                        {deployerCreations && deployerCreations?.length > 0 ? (
                          <>
                            <br />
                            <br />
                            <RowBetween style={{ height: rowHeight }}>
                              <Text fontWeight={500} color={theme.text1} fontSize={16}>
                                <Trans>Deployers other tokens:</Trans>
                              </Text>
                            </RowBetween>
                            <br />
                            {deployerCreations.map((item) => (
                              <>
                                <Row key={item.key}>
                                  <StyledExternalLink id={`deployer-link`} href={item.url}>
                                    <Trans>{item.name}</Trans>
                                    <sup>↗</sup>
                                  </StyledExternalLink>
                                </Row>
                              </>
                            ))}
                          </>
                        ) : null}
                      </>
                    ) : null)}
                </>
              }
            </Flex>
          </Row>
        </TokenContentWrapper>
      </ContentWrapper>
    </Modal>
  )
})

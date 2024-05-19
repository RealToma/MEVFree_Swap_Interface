import { Trans } from '@lingui/macro'
import { ParentSize } from '@visx/responsive'
import { useWeb3React } from '@web3-react/core'
import CurrencyLogo from 'components/CurrencyLogo'
import PriceChart from 'components/Tokens/TokenDetails/PriceChart'
import { nativeOnChain, WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { useTokenDetailQuery } from 'graphql/data/TokenDetailQuery'
import { useCurrency, useToken } from 'hooks/Tokens'
import { useTokenChartCurrencyId } from 'state/tokenChart/hooks'
import styled from 'styled-components/macro'
import { formatDollarAmount } from 'utils/formatDollarAmt'

import LoadingTokenDetail from '../TokenDetails/LoadingTokenDetail'
import Resource from '../TokenDetails/Resource'
import {
  AboutContainer,
  AboutHeader,
  ChartContainer,
  ChartHeader,
  ResourcesContainer,
  Stat,
  StatPair,
  StatsSection,
  TokenInfoContainer,
  TokenNameCell,
  TopArea,
} from '../TokenDetails/TokenDetailContainers'

const StatPrice = styled.span`
  font-size: 28px;
  color: ${({ theme }) => theme.text1};
`
const TokenActions = styled.div`
  display: flex;
  gap: 16px;
  color: ${({ theme }) => theme.text2};
`
const TokenSymbol = styled.span`
  text-transform: uppercase;
  color: ${({ theme }) => theme.text2};
`
const NoInfoAvailable = styled.span`
  color: ${({ theme }) => theme.text3};
  font-weight: 400;
  font-size: 16px;
`
const TokenDescriptionContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  max-height: fit-content;
  padding-top: 16px;
  line-height: 24px;
  white-space: pre-wrap;
`

const TRUNCATE_CHARACTER_COUNT = 400

type TokenDetailData = {
  description: string | null | undefined
  homepageUrl: string | null | undefined
  twitterName: string | null | undefined
}

const truncateDescription = (desc: string) => {
  //trim the string to the maximum length
  let tokenDescriptionTruncated = desc.slice(0, TRUNCATE_CHARACTER_COUNT)
  //re-trim if we are in the middle of a word
  tokenDescriptionTruncated = `${tokenDescriptionTruncated.slice(
    0,
    Math.min(tokenDescriptionTruncated.length, tokenDescriptionTruncated.lastIndexOf(' '))
  )}...`
  return tokenDescriptionTruncated
}

export function AboutSection({ address, tokenDetailData }: { address: string; tokenDetailData: TokenDetailData }) {
  const shouldTruncate =
    tokenDetailData && tokenDetailData.description
      ? tokenDetailData.description.length > TRUNCATE_CHARACTER_COUNT
      : false

  const tokenDescription =
    tokenDetailData && tokenDetailData.description && shouldTruncate
      ? truncateDescription(tokenDetailData.description)
      : tokenDetailData.description

  return (
    <AboutContainer>
      <AboutHeader>
        <Trans>About</Trans>
      </AboutHeader>
      <TokenDescriptionContainer>
        {(!tokenDetailData || !tokenDetailData.description) && (
          <NoInfoAvailable>
            <Trans>No token information available</Trans>
          </NoInfoAvailable>
        )}
        {tokenDescription}
      </TokenDescriptionContainer>
      <ResourcesContainer>
        <Resource name={'Etherscan'} link={`https://etherscan.io/address/${address}`} />
        <Resource name={'Protocol info'} link={`https://info.uniswap.org/#/tokens/${address}`} />
        {tokenDetailData?.homepageUrl && <Resource name={'Website'} link={tokenDetailData.homepageUrl} />}
        {tokenDetailData?.twitterName && (
          <Resource name={'Twitter'} link={`https://twitter.com/${tokenDetailData.twitterName}`} />
        )}
      </ResourcesContainer>
    </AboutContainer>
  )
}

export default function LoadedTokenDetail() {
  const address = useTokenChartCurrencyId()
  const { chainId: connectedChainId } = useWeb3React()
  const token = useToken(address)
  let currency = useCurrency(address)

  const tokenDetailData = useTokenDetailQuery(address, 'ETHEREUM')

  //console.log('LoadedTokenDetail - tokenDetailData: ', tokenDetailData)

  const relevantTokenDetailData = (({ description, homepageUrl, twitterName }) => ({
    description,
    homepageUrl,
    twitterName,
  }))(tokenDetailData)

  if (!token || !token.name || !token.symbol || !connectedChainId) {
    return <LoadingTokenDetail />
  }

  const wrappedNativeCurrency = WRAPPED_NATIVE_CURRENCY[connectedChainId]
  const isWrappedNativeToken = wrappedNativeCurrency?.address === token.address

  if (isWrappedNativeToken) {
    currency = nativeOnChain(connectedChainId)
  }

  const tokenName = isWrappedNativeToken && currency ? currency.name : tokenDetailData.name
  const defaultTokenSymbol = tokenDetailData.tokens?.[0]?.symbol ?? token.symbol
  const tokenSymbol = isWrappedNativeToken && currency ? currency.symbol : defaultTokenSymbol

  return (
    <TopArea>
      <ChartHeader>
        <TokenInfoContainer>
          <TokenNameCell>
            <CurrencyLogo currency={currency} size={'32px'} />
            {tokenName ?? <Trans>Name not found</Trans>}
            <TokenSymbol>{tokenSymbol ?? <Trans>Symbol not found</Trans>}</TokenSymbol>
          </TokenNameCell>
          <TokenActions></TokenActions>
        </TokenInfoContainer>
        <ChartContainer>
          <ParentSize>{({ width, height }) => <PriceChart token={token} width={width} height={height} />}</ParentSize>
        </ChartContainer>
      </ChartHeader>
      <StatsSection>
        <StatPair>
          <Stat>
            <Trans>Market cap</Trans>
            <StatPrice>
              {tokenDetailData.marketCap?.value ? formatDollarAmount(tokenDetailData.marketCap?.value) : '-'}
            </StatPrice>
          </Stat>
          <Stat>
            24H volume
            <StatPrice>
              {tokenDetailData.volume24h?.value ? formatDollarAmount(tokenDetailData.volume24h?.value) : '-'}
            </StatPrice>
          </Stat>
        </StatPair>
        <StatPair>
          <Stat>
            52W low
            <StatPrice>
              {tokenDetailData.priceLow52W?.value ? formatDollarAmount(tokenDetailData.priceLow52W?.value) : '-'}
            </StatPrice>
          </Stat>
          <Stat>
            52W high
            <StatPrice>
              {tokenDetailData.priceHigh52W?.value ? formatDollarAmount(tokenDetailData.priceHigh52W?.value) : '-'}
            </StatPrice>
          </Stat>
        </StatPair>
      </StatsSection>
      <AboutSection address={address} tokenDetailData={relevantTokenDetailData} />
    </TopArea>
  )
}

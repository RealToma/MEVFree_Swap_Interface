/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
//import TokenChart from 'components/Tokens/TokenChart/TokenChart'
import { Trans } from '@lingui/macro'
import Loader from 'components/Loader'
import LoadingTokenDetail from 'components/Tokens/TokenDetails/LoadingTokenDetail'
import ProLiveChart from 'components/TradingViewChart'
import { Flex } from 'components/UIKit'
// eslint-disable-next-line no-restricted-imports
import { useContext } from 'react'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'

const NOT_AVAIALBLE = '--'

const TokenDetailsLayout = styled.div`
  display: flex;
  max-width: 2800px;
  justify-content: center;
  margin: 2px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 660px;
    margin: 2px;
`};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 580px;
    margin: 2px;
`};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 460px;
    margin: 2px;
`};
`

const LiveChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

function format4DecimalsWithZeroes(numOrStr: number | string): string {
  const num = typeof numOrStr === 'string' ? parseFloat(numOrStr) : numOrStr;
  const str = num.toFixed(20);
  const truncated = (Math.round(num * 10000) / 10000).toFixed(20);

  // Match the part after the decimal point
  const match = str.match(/(\.\d*)/);
  const decimalPart = match ? match[1] : '';

  // Count the number of preceding zeroes after the decimal point
  let zeroCount = 0;
  for (let i = 1; i < decimalPart.length; i++) {
    if (decimalPart[i] === '0') {
      zeroCount++;
    } else {
      break;
    }
  }

  // Format the number with the same number of preceding zeroes
  const decimalIndex = truncated.indexOf('.');
  const formattedDecimalPart = decimalIndex !== -1 ? truncated.slice(decimalIndex + 1) : '';
  const formatted = truncated.slice(0, decimalIndex + 1) + '0'.repeat(zeroCount) + formattedDecimalPart.slice(zeroCount, zeroCount + 4);

  return formatted;
}

const PriceChart = ({
  inputCurrency,
  outputCurrency,
  nativeInputCurrency,
  nativeOutputCurrency,
  currenciesList,
  stateProChart,
  showInverted,
  setShowInverted,
  inputTokenHoneypotInfo,
  inputTokenHpLoading,
  outputTokenHoneypotInfo,
  outputTokenHpLoading,
}) => {
  const theme = useContext(ThemeContext)
  // const inputToken = nativeInputCurrency?.wrapped
  // const outputToken = nativeOutputCurrency?.wrapped
  // const inputTokenName = inputToken?.name
  // const outputTokenName = outputToken?.name
  // const { data: inputTokenInfo, loading: inputTokenInfoLoading } = useTokenInfo(inputToken)
  // const { data: outputTokenInfo, loading: outputTokenInfoLoading } = useTokenInfo(outputToken)

  const inputFetched = inputTokenHoneypotInfo?.fetched
  const outputFetched = outputTokenHoneypotInfo?.fetched

  //console.log('honeypotInfo', inputTokenHoneypotInfo)

  const inputMaxTx = inputTokenHoneypotInfo.maxTransaction
  const inputMaxWallet = inputTokenHoneypotInfo.maxWallet
  const outputMaxTx = outputTokenHoneypotInfo.maxTransaction
  const outputMaxWallet = outputTokenHoneypotInfo.maxWallet

  const inputHoneypotDataInfo = [
    {
      label: 'Market Cap:',
      value: inputTokenHoneypotInfo.pairMcap ? '$' + new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(inputTokenHoneypotInfo.pairMcap) : NOT_AVAIALBLE,
    },
    {
      label: 'Buy Tax:',
      value: inputTokenHoneypotInfo.buyTax ? inputTokenHoneypotInfo.buyTax.toString() : NOT_AVAIALBLE,
    },
    {
      label: 'Sell Tax:',
      value: inputTokenHoneypotInfo.sellTax ? inputTokenHoneypotInfo.sellTax.toString() : NOT_AVAIALBLE,
    },
    {
      label: 'Max TX:',
      value: inputMaxTx ? inputMaxTx.toString() : NOT_AVAIALBLE,
    },
    {
      label: 'Max Wallet:',
      value: inputMaxWallet ? inputMaxWallet.toString() : NOT_AVAIALBLE,
    },
  ]

  const outputHoneypotDataInfo = [
    {
      label: 'Market Cap:',
      value: outputTokenHoneypotInfo.pairMcap ? '$' + new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(outputTokenHoneypotInfo.pairMcap) : NOT_AVAIALBLE,
    },
    {
      label: 'Buy Tax:',
      value: outputTokenHoneypotInfo.buyTax ? outputTokenHoneypotInfo.buyTax.toString() : NOT_AVAIALBLE,
    },
    {
      label: 'Sell Tax:',
      value: outputTokenHoneypotInfo?.sellTax ? outputTokenHoneypotInfo?.sellTax?.toString() : NOT_AVAIALBLE,
    },
    {
      label: 'Max TX:',
      value: outputMaxTx ? outputMaxTx.toString() : NOT_AVAIALBLE,
    },
    {
      label: 'Max Wallet:',
      value: outputMaxWallet ? outputMaxWallet.toString() : NOT_AVAIALBLE,
    },
  ]

  return (
    <TokenDetailsLayout>
      <Flex flexDirection="column" justifyContent="space-between" width="100%" height="680px" pt="12px">
        {!inputCurrency?.isNative && (
          <>
            <Flex justifyContent="start" alignItems="baseline" flexWrap="wrap">
              {
                <>
                  {'\xa0'}
                  {inputTokenHpLoading || !inputFetched
                    ? inputHoneypotDataInfo.map((item3) => (
                        <>
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            <Trans>{item3.label}</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.mevblue} fontSize={16}>
                            <Trans>{<Loader size="10px" />}</Trans>
                          </Text>
                          {'\xa0'}
                        </>
                      ))
                    : inputHoneypotDataInfo.map((item4) => (
                        <>
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            <Trans>{item4.label}</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.mevblue} fontSize={16}>
                            <Trans>{item4.value}</Trans>
                          </Text>
                          {'\xa0'}
                        </>
                      ))}
                </>
              }
            </Flex>
          </>
        )}
        {!outputCurrency?.isNative && (
          <>
            <Flex justifyContent="start" alignItems="baseline" flexWrap="wrap">
              {
                <>
                  {'\xa0'}
                  {outputTokenHpLoading || !outputFetched
                    ? outputHoneypotDataInfo.map((item7) => (
                        <>
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            <Trans>{item7.label}</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.mevblue} fontSize={16}>
                            <Trans>{<Loader size="10px" />}</Trans>
                          </Text>
                          {'\xa0'}
                        </>
                      ))
                    : outputHoneypotDataInfo.map((item8) => (
                        <>
                          <Text fontWeight={500} color={theme.text1} fontSize={16}>
                            <Trans>{item8.label}</Trans>
                          </Text>
                          {'\xa0'}
                          <Text fontWeight={500} color={theme.mevblue} fontSize={16}>
                            <Trans>{item8.value}</Trans>
                          </Text>
                          {'\xa0'}
                        </>
                      ))}
                </>
              }
            </Flex>
          </>
        )}
        <LiveChartWrapper>
          <ProLiveChart
            currencies={currenciesList}
            stateProChart={stateProChart}
            className="ProLiveChart"
          ></ProLiveChart>
        </LiveChartWrapper>
      </Flex>
    </TokenDetailsLayout>
  )
}

export default PriceChart

export function LoadingTokenDetails() {
  return (
    <TokenDetailsLayout>
      <LoadingTokenDetail />
    </TokenDetailsLayout>
  )
}

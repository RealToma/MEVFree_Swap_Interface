import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { getPriceData } from 'components/TradingViewChart/datafeed'
import { Currency, CurrencyAmount } from 'mevswap/sdk-core'
import { CSSProperties, MutableRefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useManageTokenHiddenList, useUserHiddenTokensList, useUserShowEditTokenList } from 'state/user/hooks'
import styled, { ThemeContext } from 'styled-components/macro'
import { formatUSDPrice } from 'uniswap/conedison/format'

import { useIsUserAddedToken } from '../../../hooks/Tokens'
import { useCurrencyBalance } from '../../../state/connection/hooks'
import { useCombinedActiveList } from '../../../state/lists/hooks'
import { WrappedTokenInfo } from '../../../state/lists/wrappedTokenInfo'
import { ThemedText } from '../../../theme'
import { isTokenOnList } from '../../../utils'
import Column from '../../Column'
import CurrencyLogo from '../../CurrencyLogo'
import Loader from '../../Loader'
import Row, { RowBetween, RowFixed } from '../../Row'
import { MouseoverTooltip } from '../../Tooltip'
import { MenuItem } from '../styleds'
import { formatDelta, getDeltaArrow } from '../TokenDetails/PriceChart'

function currencyKey(currency: Currency): string {
  return currency.isToken ? currency.address : 'ETHER'
}

export const PortfolioMenuItem = styled(RowBetween)`
  padding: 0px 4px 0px 4px;
  height: 42px;
  display: flex;
  justify-content: space-between;
  row-gap: 2px;
  column-gap: 8px;
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.bg2};
    border-radius: ${({ theme, disabled }) => !disabled && '16px'};
    color: ${({ theme, disabled }) => !disabled && theme.mevblue};
  }

  cursor: pointer;
  color: ${({ theme, disabled }) => disabled && theme.mevorange};
  background-color: ${({ theme, disabled }) => disabled && theme.bg2};
  color: ${({ theme, disabled }) => !disabled && theme.white};
  background-color: ${({ theme, disabled }) => !disabled && theme.mevbggrey};
  border-radius: ${({ theme, disabled }) => disabled && '16px'};
`

const RowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.5fr repeat(2, 1fr) minmax(0, 72px);
  width: 100%;
  gap: 10px;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: auto minmax(0, 120px) repeat(1, 1fr) auto minmax(0, 72px);
  `};
`

const RowItem = styled.div`
  display: auto;
  align-items: center;
  justify-content: center;
`

const TokenRowItem = styled.div`
  display: flex;
  margin-left: auto;
  margin-right: 0;
  justify-content: flex-end;
`

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 2px 0.125rem 2px 0.125rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const NameCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  gap: 8px;
`
const PriceCell = styled(Cell)`
  padding-right: 8px;
`
const PercentChangeCell = styled(Cell)`
  padding-right: 8px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

function Balance({ balance }: { balance: CurrencyAmount<Currency> }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const ArrowCell = styled.div`
  padding-right: 3px;
  display: flex;
`

export const DeltaText = styled.span<{ delta: number | undefined }>`
  color: ${({ theme, delta }) =>
    delta !== undefined ? (Math.sign(delta) < 0 ? theme.red300 : theme.green300) : theme.white};
`

const PortfolioRowItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeaderPriceCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function TokenRows({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  showCurrencyAmount,
  onMaxClickRow,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  showCurrencyAmount?: boolean
  onMaxClickRow: () => void
}) {
  const { account } = useWeb3React()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency.isToken ? currency : undefined)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      tabIndex={0}
      style={style}
      className={`token-item-${key}`}
      onKeyPress={(e) => (!isSelected && e.key === 'Enter' ? onSelect() : null)}
      onClick={() => (isSelected ? onMaxClickRow() : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size={'24px'} />
      <Column>
        <Text title={currency.name} fontWeight={500}>
          {currency.symbol}
        </Text>
        <ThemedText.DarkGray ml="0px" fontSize={'12px'} fontWeight={300}>
          {!currency.isNative && !isOnSelectedList && customAdded ? (
            <Trans>{currency.name} • Added by user</Trans>
          ) : (
            currency.name
          )}
        </ThemedText.DarkGray>
      </Column>
      <TokenTags currency={currency} />
      {showCurrencyAmount && (
        <RowFixed style={{ justifySelf: 'flex-end' }}>
          {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
        </RowFixed>
      )}
    </MenuItem>
  )
}

interface TokenRowProps {
  data: Array<Currency>
  index: number
  style: CSSProperties
}

export default function TokenList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showCurrencyAmount,
  onMaxClick,
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showCurrencyAmount?: boolean
  onMaxClick: () => void
}) {
  const itemData: Currency[] = useMemo(() => {
    return currencies
  }, [currencies])

  //console.log('TokenList got entry')

  const Row = useCallback(
    function TokenRow({ data, index, style }: TokenRowProps) {
      const row: Currency = data[index]

      const currency = row

      //console.log('TokenList Row')

      const isSelected = Boolean(currency && selectedCurrency && selectedCurrency.equals(currency))
      const otherSelected = Boolean(currency && otherCurrency && otherCurrency.equals(currency))
      const handleSelect = () => currency && onCurrencySelect(currency)

      if (currency) {
        //console.log('TokenRows got currency')
        return (
          <TokenRows
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            showCurrencyAmount={showCurrencyAmount}
            onMaxClickRow={onMaxClick}
          />
        )
      } else {
        return null
      }
    },
    [onCurrencySelect, onMaxClick, otherCurrency, selectedCurrency, showCurrencyAmount]
  )

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index]
    return currencyKey(currency)
  }, [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={48}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}

const HeaderRow = () => {
  const theme = useContext(ThemeContext)
  return (
    <RowWrapper>
      <HeaderCell>
        <Text fontWeight={800} color={theme.mevblue}>
          Token
        </Text>
      </HeaderCell>
      <HeaderCell>
        <Text fontWeight={800} color={theme.mevblue}>
          Price
        </Text>
      </HeaderCell>
      <HeaderPriceCell>
        <Text fontWeight={800} color={theme.mevblue}>
          Change
        </Text>
      </HeaderPriceCell>
      <HeaderCell>
        <Text fontWeight={800} color={theme.mevblue}>
          Balance
        </Text>
      </HeaderCell>
    </RowWrapper>
  )
}

function TokenPortfolioRows({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  showCurrencyAmount,
  onMaxClickRow,
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  showCurrencyAmount?: boolean
  onMaxClickRow: () => void
}) {
  const { account, chainId } = useWeb3React()
  const key = currencyKey(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)
  const manageTokenHiddenList = useManageTokenHiddenList()
  const hiddenTokensList = useUserHiddenTokensList()
  const [userShowEditTokenList] = useUserShowEditTokenList()

  // Price data state
  const [priceData, setPriceData] = useState<{ currentPrice: number | null; prevDayPrice: number | null }>({
    currentPrice: null,
    prevDayPrice: null,
  })

  // Calculate price difference and percentage change
  const priceDifference =
    priceData.currentPrice && priceData.prevDayPrice ? priceData.currentPrice - priceData.prevDayPrice : null
  const priceChangePercentage =
    priceDifference && priceData.prevDayPrice ? (priceDifference / priceData.prevDayPrice) * 100 : null

  // Format price change data
  const arrow = getDeltaArrow(priceChangePercentage)
  const smallArrow = getDeltaArrow(priceChangePercentage, 14)
  const formattedDelta = formatDelta(priceChangePercentage)

  // Get token address
  // const address = currency.isNative ? undefined : currency.address.toLowerCase()
  // const tokenDetailData = useTokenDetailQuery(address, 'ETHEREUM')

  // Fetch price data
  // Inside your component
  const hasRendered = useRef(false)

  const fetchPriceData = useCallback(async () => {
    try {
      const data = await getPriceData(currency, chainId)
      setPriceData(data)
    } catch (error) {
      console.error('Error fetching price data:', error)
    }
  }, [chainId, currency])

  // Initial fetch when the component is rendered for the first time
  useEffect(() => {
    if (!hasRendered.current) {
      hasRendered.current = true
      fetchPriceData()
    }
  }, [fetchPriceData])

  // Set a timer to fetch data every minute
  useEffect(() => {
    const timer = setInterval(fetchPriceData, 60000) // 60000ms = 1 minute

    // Clean up the interval when the component is unmounted or dependencies change
    return () => {
      clearInterval(timer)
    }
  }, [fetchPriceData])

  // Check if token is hidden by the user
  const isHiddenByUser: boolean = useMemo(() => {
    if (!currency.isToken) {
      return false
    }
    const tokenAddress: string = currency.address.toLowerCase()
    return hiddenTokensList?.has(tokenAddress) ?? false
  }, [currency, hiddenTokensList])

  // Handle show/hide token button click
  const clickShowHideButtonHandler = () => {
    if (currency.isToken) {
      const tokenAddress: string = currency.address.toLowerCase()
      manageTokenHiddenList(tokenAddress, !isHiddenByUser)
    }
  }

  // Render component
  return (
    <PortfolioMenuItem
      tabIndex={0}
      style={style}
      className={`token-item-${key}`}
      onKeyPress={(e) => (!isSelected && e.key === 'Enter' ? onSelect() : null)}
      onClick={() => (isSelected ? onMaxClickRow() : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <RowWrapper>
        <PortfolioRowItem>
          <Row>
            <CurrencyLogo currency={currency} size={'32px'} />
            <NameCell>
              <Column>
                <Text title={currency.name} fontWeight={500}>
                  {currency.symbol?.substring(0, 12)}
                </Text>
                <ThemedText.DarkGray ml="0px" fontSize={'12px'} fontWeight={300}>
                  {currency.name?.substring(0, 12)}
                </ThemedText.DarkGray>
              </Column>
            </NameCell>
          </Row>
        </PortfolioRowItem>
        <TokenRowItem>
          <PriceCell data-testid="price-cell">{formatUSDPrice(priceData?.currentPrice)}</PriceCell>
        </TokenRowItem>
        <PortfolioRowItem>
          <PercentChangeCell data-testid="percent-change-cell">
            <ArrowCell>{smallArrow}</ArrowCell>
            {formattedDelta}
          </PercentChangeCell>
        </PortfolioRowItem>
        <TokenRowItem>
          <TokenTags currency={currency} />
          {showCurrencyAmount && userShowEditTokenList && (
            <RowFixed style={{ justifySelf: 'flex-end' }}>
              <ThemedText.Yellow mr="12px" fontSize={'16px'} fontWeight={500} onClick={clickShowHideButtonHandler}>
                {isHiddenByUser ? 'Unhide' : 'Hide'}
              </ThemedText.Yellow>
              {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
            </RowFixed>
          )}
          {showCurrencyAmount && !userShowEditTokenList && (
            <RowFixed style={{ justifySelf: 'flex-end' }}>
              {balance ? <Balance balance={balance} /> : account ? <Loader /> : null}
            </RowFixed>
          )}
        </TokenRowItem>
      </RowWrapper>
    </PortfolioMenuItem>
  )
}

export function TokenPortfolioList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showCurrencyAmount,
  onMaxClick,
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showCurrencyAmount?: boolean
  onMaxClick: () => void
}) {
  const itemData: Currency[] = useMemo(() => {
    return currencies
  }, [currencies])

  //console.log('TokenList got entry')

  const Row = useCallback(
    function TokenRow({ data, index, style }: TokenRowProps) {
      const row: Currency = data[index]

      const currency = row

      //console.log('TokenList Row')

      const isSelected = Boolean(currency && selectedCurrency && selectedCurrency.equals(currency))
      const otherSelected = Boolean(currency && otherCurrency && otherCurrency.equals(currency))
      const handleSelect = () => currency && onCurrencySelect(currency)

      if (currency) {
        //console.log('TokenRows got currency')
        return (
          <TokenPortfolioRows
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            showCurrencyAmount={showCurrencyAmount}
            onMaxClickRow={onMaxClick}
          />
        )
      } else {
        return null
      }
    },
    [onCurrencySelect, onMaxClick, otherCurrency, selectedCurrency, showCurrencyAmount]
  )

  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index]
    return currencyKey(currency)
  }, [])

  return (
    <div>
      <HeaderRow />
      <FixedSizeList
        height={height}
        ref={fixedListRef as any}
        width="100%"
        itemData={itemData}
        itemCount={itemData.length}
        itemSize={48}
        itemKey={itemKey}
      >
        {Row}
      </FixedSizeList>
    </div>
  )
}

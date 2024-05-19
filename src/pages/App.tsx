import Loader from 'components/Loader'
import TopLevelModals from 'components/TopLevelModals'
import { AnimatePresence } from 'framer-motion'
import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { TickerTape } from 'mevswap/tradingview-widgets'
import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'

import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
//import Polling from '../components/Header/Polling'
//import Popups from '../components/Popups'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds } from './AddLiquidity/redirects'
import { RedirectDuplicateTokenIdsV2 } from './AddLiquidityV2/redirects'
import Home from './Home'
import MigrateV2 from './MigrateV2'
import MigrateV2Pair from './MigrateV2/MigrateV2Pair'
import Pool from './Pool'
import { PositionPage } from './Pool/PositionPage'
import PoolV2 from './Pool/v2'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import RemoveLiquidityV3 from './RemoveLiquidity/V3'
import Swap from './Swap'
import { RedirectPathToHomeOnly, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import SimpleSwap from './Swap/SimpleSwap'
import Whitepaper from './Whitepaper'

// lazy load vote related pages
//const Vote = lazy(() => import('./Vote'))

const AppWrapper = styled.div`
  align-items: center;
  display: grid;
  grid-template-rows: auto auto auto;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;

  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 8px 2px 2px 2px;
`};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  display: flex;
  flex-direction: column;
  padding: 8px 0px 0px 0px;
  width: 100%;
  justify-content: space-between;
  z-index: 2;
`
const TickerTapeOuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 62px;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App() {
  const { pathname } = useLocation()
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <ErrorBoundary>
      <ApeModeQueryParamReader />
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <TickerTapeOuterWrapper>
            <TickerTape isTransparent colorTheme="dark"></TickerTape>
          </TickerTapeOuterWrapper>
          <TopLevelModals />
          <Suspense fallback={<Loader />}>
            <AnimatePresence exitBeforeEnter>
              <Routes key={location.pathname} location={location}>
                <Route path="simpleswap" element={<SimpleSwap />} />
                <Route path="home" element={<Home />} />
                <Route path="whitepaper" element={<Whitepaper />} />
                <Route path="send" element={<RedirectPathToSwapOnly />} />
                <Route path="swap/:outputCurrency" element={<RedirectToSwap />} />
                <Route path="swap" element={<Swap />} />

                <Route path="pool/v2/find" element={<PoolFinder />} />
                <Route path="pool/v2" element={<PoolV2 />} />
                <Route path="pool" element={<Pool />} />
                <Route path="pool/:tokenId" element={<PositionPage />} />

                <Route path="add/v2" element={<RedirectDuplicateTokenIdsV2 />}>
                  <Route path=":currencyIdA" />
                  <Route path=":currencyIdA/:currencyIdB" />
                </Route>
                <Route path="add" element={<RedirectDuplicateTokenIds />}>
                  {/* this is workaround since react-router-dom v6 doesn't support optional parameters any more */}
                  <Route path=":currencyIdA" />
                  <Route path=":currencyIdA/:currencyIdB" />
                  <Route path=":currencyIdA/:currencyIdB/:feeAmount" />
                </Route>

                <Route path="increase" element={<AddLiquidity />}>
                  <Route path=":currencyIdA" />
                  <Route path=":currencyIdA/:currencyIdB" />
                  <Route path=":currencyIdA/:currencyIdB/:feeAmount" />
                  <Route path=":currencyIdA/:currencyIdB/:feeAmount/:tokenId" />
                </Route>

                <Route path="remove/v2/:currencyIdA/:currencyIdB" element={<RemoveLiquidity />} />
                <Route path="remove/:tokenId" element={<RemoveLiquidityV3 />} />

                <Route path="migrate/v2" element={<MigrateV2 />} />
                <Route path="migrate/v2/:address" element={<MigrateV2Pair />} />

                <Route path="*" element={<RedirectPathToHomeOnly />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </ErrorBoundary>
  )
}

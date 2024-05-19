import { Box, FlexProps } from 'components/UIKit'
import Script from 'next/script'
import { useEffect } from 'react'
import { isMobile } from 'utils/userAgent'

/**
 * When the script tag is injected the TradingView object is not immediately
 * available on the window. So we listen for when it gets set
 */
const tradingViewListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'TradingView', {
      configurable: true,
      set(value) {
        this.tv = value
        resolve(value)
      },
    })
  )

const initializeTradingView = (TradingViewObj: any, localeCode: string, opts: any) => {
  let timezone = 'Etc/UTC'
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (e) {
    // noop
  }
  /* eslint-disable new-cap */
  /* eslint-disable no-new */
  // @ts-ignore
  return new TradingViewObj.widget({
    // Advanced Chart Widget uses the legacy embedding scheme,
    // an id property should be specified in the settings object
    id: opts.container_id,
    autosize: true,
    height: '100%',
    symbol: 'BINANCE:BNBBUSD',
    interval: '15',
    timezone,
    theme: 'dark',
    style: '3',
    locale: localeCode,
    toolbar_bg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: true,
    hide_side_toolbar: true,
    hide_top_toolbar: true,
    enabled_features: ['header_fullscreen_button'],
    precision: 6,
    minMove: 1,
    ...opts,
  })
}

interface TradingViewProps {
  id: string
  symbol: string
}

const TradingView = ({ id, symbol }: TradingViewProps) => {
  const userLocale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language

  useEffect(() => {
    const opts: any = {
      container_id: id,
      symbol,
    }

    if (isMobile) {
      opts.hide_side_toolbar = true
    }

    // @ts-ignore
    if (window.tv) {
      // @ts-ignore
      initializeTradingView(window.tv, userLocale, opts)
    } else {
      tradingViewListener().then((tv) => {
        initializeTradingView(tv, userLocale, opts)
      })
    }

    // Ignore isMobile to avoid re-render TV
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, symbol])

  return (
    <Box overflow="hidden" className="tradingview_container">
      <Script src="https://s3.tradingview.com/tv.js" strategy="lazyOnload" id="tv.js" />
      <div id={id} />
    </Box>
  )
}

export function useTradingViewEvent({
  id,
  onNoDataEvent,
  onLoadedEvent,
}: {
  id?: string
  onNoDataEvent?: () => void
  onLoadedEvent?: () => void
}) {
  useEffect(() => {
    const onNoDataAvailable = (event: MessageEvent) => {
      const payload = event.data

      if (payload.name === 'tv-widget-no-data') {
        if (id && payload.frameElementId === id) {
          onNoDataEvent?.()
        }
      }
      if (payload.name === 'tv-widget-load') {
        if (id && payload.frameElementId === id) {
          onLoadedEvent?.()
        }
      }
    }
    window.addEventListener('message', onNoDataAvailable)

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('message', onNoDataAvailable)
    }
  }, [id, onNoDataEvent, onLoadedEvent])
}

// Required to link to TradingView website for the widget
export const TradingViewLabel = ({ symbol, ...props }: { symbol: string } & FlexProps) => {
  return null
}

export default TradingView

import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { useAppSelector } from 'state/hooks'

// import { useCurrency } from '../../hooks/Tokens'
import { AppState } from '../index'

export function useTokenChartState(): AppState['tokenChart'] {
  return useAppSelector((state) => state.tokenChart)
}

export function useNativeWrappedTokenAddress(): string {
  const nativeCurrency = useNativeCurrency()
  const nativeWrappedCurrency = nativeCurrency.wrapped

  return nativeWrappedCurrency.address
}

export function useTokenChartCurrencyId(): string {
  const { currencyId } = useTokenChartState()
  const nativeWrappedCurrencyAddress = useNativeWrappedTokenAddress()

  if (!currencyId) {
    return nativeWrappedCurrencyAddress
  }
  return currencyId
}

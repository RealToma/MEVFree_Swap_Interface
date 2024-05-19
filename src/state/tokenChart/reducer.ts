import { createReducer } from '@reduxjs/toolkit'

import { selectCurrency } from './actions'

export interface TokenChartState {
  readonly currencyId: string | undefined | null
}

// TODO: banana-split00 implement intial token chart based on network selected
const initialState: TokenChartState = {
  currencyId: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
}

export default createReducer<TokenChartState>(initialState, (builder) =>
  builder.addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
    return {
      currencyId,
    }
  })
)

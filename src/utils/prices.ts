import JSBI from 'jsbi'
import { Trade } from 'mevswap/router-sdk'
import { Currency, CurrencyAmount, Fraction, Percent, TradeType } from 'mevswap/sdk-core'
import { Pair } from 'mevswap/v2-sdk'
import { Trade as V2Trade } from 'mevswap/v2-sdk/entities'
import { FeeAmount } from 'mevswap/v3-sdk'
import { Field } from 'state/swap/actions'
import { basisPointsToPercent } from 'utils'

import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ONE_HUNDRED_PERCENT,
  ZERO_PERCENT,
} from '../constants/misc'

const THIRTY_BIPS_FEE = new Percent(JSBI.BigInt(30), JSBI.BigInt(10000))
const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(THIRTY_BIPS_FEE)

export function computeRealizedPriceImpact(trade: Trade<Currency, Currency, TradeType>): Percent {
  const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
  return trade.priceImpact.subtract(realizedLpFeePercent)
}

export function getPriceImpactWarning(priceImpact?: Percent): 'warning' | 'error' | undefined {
  if (priceImpact?.greaterThan(ALLOWED_PRICE_IMPACT_HIGH)) return 'error'
  if (priceImpact?.greaterThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 'warning'
  return
}

// computes realized lp fee as a percent
export function computeRealizedLPFeePercent(trade: Trade<Currency, Currency, TradeType>): Percent {
  let percent: Percent

  // Since routes are either all v2 or all v3 right now, calculate separately
  if (trade.swaps[0].route.pools instanceof Pair) {
    // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
    // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.swaps.reduce<Percent>(
        (currentFee: Percent): Percent => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
        ONE_HUNDRED_PERCENT
      )
    )
  } else {
    percent = ZERO_PERCENT
    for (const swap of trade.swaps) {
      const { numerator, denominator } = swap.inputAmount.divide(trade.inputAmount)
      const overallPercent = new Percent(numerator, denominator)

      const routeRealizedLPFeePercent = overallPercent.multiply(
        ONE_HUNDRED_PERCENT.subtract(
          swap.route.pools.reduce<Percent>((currentFee: Percent, pool): Percent => {
            const fee =
              pool instanceof Pair
                ? // not currently possible given protocol check above, but not fatal
                  FeeAmount.MEDIUM
                : pool.fee
            return currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(fee, 1_000_000)))
          }, ONE_HUNDRED_PERCENT)
        )
      )

      percent = percent.add(routeRealizedLPFeePercent)
    }
  }

  return new Percent(percent.numerator, percent.denominator)
}

// computes realized lp fee as a percent
export function computeLegacyRealizedLPFeePercent(trade: V2Trade<Currency, Currency, TradeType>): Percent {
  let percent: Percent = ZERO_PERCENT
  if (trade instanceof Trade) {
    // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
    // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
    percent = ONE_HUNDRED_PERCENT.subtract(
      trade.route.pairs.reduce<Percent>(
        (currentFee: Percent): Percent => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
        ONE_HUNDRED_PERCENT
      )
    )
  }
  return new Percent(percent.numerator, percent.denominator)
}

// computes price breakdown for the trade
export function computeRealizedLPFeeAmount(
  trade?: Trade<Currency, Currency, TradeType> | null
): CurrencyAmount<Currency> | undefined {
  if (trade) {
    const realizedLPFee = computeRealizedLPFeePercent(trade)

    // the amount of the input that accrues to LPs
    return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, trade.inputAmount.multiply(realizedLPFee).quotient)
  }

  return undefined
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade?: V2Trade<Currency, Currency, TradeType> | null): {
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency> | null | undefined
} {
  // for each hop in our trade, take away the x*y=k price impact from 0.2% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .02) * (1-.02))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT
        )
      )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    CurrencyAmount.fromRawAmount(trade.inputAmount.currency, realizedLPFee.multiply(trade.inputAmount).quotient)

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
]

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips
export function computeSlippageAdjustedAmounts(
  trade: V2Trade<Currency, Currency, TradeType> | undefined,
  allowedSlippage: number
): { [field in Field]?: CurrencyAmount<Currency> } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  }
}

type WarningSeverity = 0 | 1 | 2 | 3 | 4
export function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
  if (!priceImpact) return 4
  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity
  for (const impactLevel of IMPACT_TIERS) {
    if (impactLevel.lessThan(priceImpact)) return impact
    impact--
  }
  return 0
}

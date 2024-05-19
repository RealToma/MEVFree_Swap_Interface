import { ApprovalState } from 'lib/hooks/useApproval'
import { PAIR, SupoprtedRouterType } from 'mevswap/v2-sdk/constants'

export enum SwapRouterVersion {
  V2,
  V3,
  V2V3,
}

/**
 * Returns the swap router that will result in the least amount of txs (less gas) for a given swap.
 * Heuristic:
 * - if trade contains a single v2-only trade & V2 SwapRouter is approved: use V2 SwapRouter
 * - if trade contains only v3 & V3 SwapRouter is approved: use V3 SwapRouter
 * - else: approve and use V2+V3 SwapRouter
 */
export function getTxOptimizedSwapRouter({
  onlyV2Routes,
  onlyV3Routes,
  tradeHasSplits,
  approvalStates,
}: {
  onlyV2Routes: boolean | undefined
  onlyV3Routes: boolean | undefined
  tradeHasSplits: boolean | undefined
  approvalStates: { v2: ApprovalState; v3: ApprovalState; v2V3: ApprovalState }
}): SwapRouterVersion | undefined {
  //console.log('getTxOptimizedSwapRouter PAIR.ROUTERID: ', PAIR.ROUTERID)
  let forceV2 = false
  switch (PAIR.ROUTER_TYPE) {
    case SupoprtedRouterType.V2:
      onlyV2Routes = true
      onlyV3Routes = false
      tradeHasSplits = false
      forceV2 = true
      //console.log('getTxOptimizedSwapRouter: v2')
      break
    case SupoprtedRouterType.V3:
      onlyV2Routes = false
      onlyV3Routes = true
      tradeHasSplits = false
      forceV2 = false
      //console.log('getTxOptimizedSwapRouter: v2')
      break
    case SupoprtedRouterType.V2V3:
      onlyV2Routes = false
      onlyV3Routes = false
      tradeHasSplits = true
      forceV2 = false
      //console.log('getTxOptimizedSwapRouter: v2')
      break
  }

  if ([approvalStates.v2, approvalStates.v3, approvalStates.v2V3].includes(ApprovalState.PENDING)) {
    //console.log('getTxOptimizedSwapRouter ApprovalState: undefined')
    return undefined
  }
  if (approvalStates.v2 === ApprovalState.APPROVED && onlyV2Routes && !tradeHasSplits) return SwapRouterVersion.V2
  if (approvalStates.v2V3 === ApprovalState.APPROVED && onlyV2Routes === false && tradeHasSplits)
    return SwapRouterVersion.V2V3
  if (approvalStates.v3 === ApprovalState.APPROVED && onlyV3Routes) return SwapRouterVersion.V3
  if (forceV2 === true) return SwapRouterVersion.V2
  return SwapRouterVersion.V2V3
}

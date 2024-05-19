import { SupportedRouterId } from 'mevswap/v2-sdk/constants'
//import { UseLocalStorage } from 'hooks/useLocalStorage'

interface SwitchRouterArguments {
  routerId: SupportedRouterId
}

// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export async function switchRouter({ routerId }: SwitchRouterArguments): Promise<null | void> {
  //UseLocalStorage('routerId', routerId)
  return
}

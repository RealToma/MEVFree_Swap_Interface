import baseswapLogoUrl from 'assets/images/baseswap-logo.png'
import bscswapLogoUrl from 'assets/images/bsc-logo.png'
import cronusswapLogoUrl from 'assets/images/cronus-icon.jpg'
import diffusionLogoUrl from 'assets/images/diffusion-logo.png'
import dogechainLogoUrl from 'assets/images/dogechain-logo.png'
import dogeshrekLogoUrl from 'assets/images/dogeshrek-logo.png'
import pancakeswapLogoUrl from 'assets/images/pancakeswap-logo.png'
import thornswapLogoUrl from 'assets/images/rocketswap-logo.png'
import shibaswapLogoUrl from 'assets/images/shibaswap-logo.png'
import uniswapLogoUrl from 'assets/images/token-logo.png'
import mevswapLogoUrl from 'assets/images/v.png'
import yodeswapLogoUrl from 'assets/images/yodeswap-logo.png'
import pulseXLogoUrl from 'assets/svg/pulsex-logo.svg'
import sushiswapLogoUrl from 'assets/svg/sushiswap-logo.svg'
import { SupportedRouterId } from 'mevswap/v2-sdk/constants'

export type RouterInfoMap = { readonly [routerId: number]: any }

export const ROUTER_INFO: RouterInfoMap = {
  [SupportedRouterId.MEVSWAP]: {
    label: 'MEVSwap Router',
    shortlabel: 'MEVSwap',
    logoUrl: mevswapLogoUrl,
  },
  [SupportedRouterId.UNISWAPV2]: {
    label: 'UniSwap V2 Router',
    shortlabel: 'UniSwapV2',
    logoUrl: uniswapLogoUrl,
  },
  [SupportedRouterId.UNISWAPV3]: {
    label: 'UniSwap Router',
    shortlabel: 'UniSwap',
    logoUrl: uniswapLogoUrl,
  },
  [SupportedRouterId.SUSHISWAP]: {
    label: 'SushiSwap Router',
    shortlabel: 'SushiSwap',
    logoUrl: sushiswapLogoUrl,
  },
  [SupportedRouterId.SHIBASWAP]: {
    label: 'ShibaSwap Router',
    shortlabel: 'ShibaSwap',
    logoUrl: shibaswapLogoUrl,
  },
  [SupportedRouterId.PANCAKESWAPETH]: {
    label: 'PancakeSwap Router',
    shortlabel: 'PancakeSwap',
    logoUrl: pancakeswapLogoUrl,
  },
  [SupportedRouterId.ROPSTENMEVSWAP]: {
    label: 'Ropsten MEVSwap Router',
    shortlabel: 'MEVSwap',
    logoUrl: mevswapLogoUrl,
  },
  [SupportedRouterId.ROPSTENUNISWAPV2]: {
    label: 'Ropsten UniSwap V2 Router',
    shortlabel: 'UniSwapV2',
    logoUrl: uniswapLogoUrl,
  },
  [SupportedRouterId.ROPSTENUNISWAPV3]: {
    label: 'Ropsten UniSwap V3 Router',
    shortlabel: 'UniSwapV3',
    logoUrl: uniswapLogoUrl,
  },
  [SupportedRouterId.ROPSTENSUSHISWAP]: {
    label: 'SushiSwap Router',
    shortlabel: 'SushiSwap',
    logoUrl: sushiswapLogoUrl,
  },
  [SupportedRouterId.ROPSTENSHIBASWAP]: {
    label: 'Ropsten ShibaSwap Router',
    shortlabel: 'ShibaSwap',
    logoUrl: shibaswapLogoUrl,
  },
  [SupportedRouterId.PANCAKESWAP]: {
    label: 'PancakeSwap Router',
    shortlabel: 'PancakeSwap',
    logoUrl: pancakeswapLogoUrl,
  },
  [SupportedRouterId.BSCSWAP]: {
    label: 'BSCSwap Router',
    shortlabel: 'BSCSwap',
    logoUrl: bscswapLogoUrl,
  },
  [SupportedRouterId.BSCUNISWAPV3]: {
    label: 'UniSwap V3 Router',
    shortlabel: 'UniSwapV3',
    logoUrl: uniswapLogoUrl,
  },
  [SupportedRouterId.DOGECHAINMEVSWAP]: {
    label: 'Dogechain MEVSwap Router',
    shortlabel: 'DogeMEVSwap',
    logoUrl: mevswapLogoUrl,
  },
  [SupportedRouterId.DOGECHAINDOGESWAP]: {
    label: 'DogeSwap Router',
    shortlabel: 'DogeSwap',
    logoUrl: dogechainLogoUrl,
  },
  [SupportedRouterId.DOGECHAINDOGESHREK]: {
    label: 'DogeShrek Router',
    shortlabel: 'DogeShrek',
    logoUrl: dogeshrekLogoUrl,
  },
  [SupportedRouterId.DOGECHAINYODESWAP]: {
    label: 'YodeSwap Router',
    shortlabel: 'YodeSwap',
    logoUrl: yodeswapLogoUrl,
  },
  [SupportedRouterId.DOGECHAINTESTNETDOGESWAP]: {
    label: 'DogeSwap Testnet Router',
    shortlabel: 'DogeSwap',
    logoUrl: dogechainLogoUrl,
  },
  [SupportedRouterId.CRONUS]: {
    label: 'CronusSwap Router',
    shortlabel: 'CronusSwap',
    logoUrl: cronusswapLogoUrl,
  },
  [SupportedRouterId.DIFFUSION]: {
    label: 'DiffusionSwap Router',
    shortlabel: 'DiffusionSwap',
    logoUrl: diffusionLogoUrl,
  },
  [SupportedRouterId.PULSEX]: {
    label: 'PulseX Router',
    shortlabel: 'PulseX',
    logoUrl: pulseXLogoUrl,
  },
  [SupportedRouterId.BASESUSHISWAP]: {
    label: 'SushiSwap Router',
    shortlabel: 'SushiSwap',
    logoUrl: sushiswapLogoUrl,
  },
  [SupportedRouterId.BASETHORNSWAP]: {
    label: 'ThornSwap Router',
    shortlabel: 'ThornSwap',
    logoUrl: thornswapLogoUrl,
  },
  [SupportedRouterId.BASEUNISWAPV3]: {
    label: 'UniSwap Router',
    shortlabel: 'UniSwap',
    logoUrl: uniswapLogoUrl,
  },
  [SupportedRouterId.BASEBASESWAP]: {
    label: 'BaseSwap Router',
    shortlabel: 'BaseSwap',
    logoUrl: baseswapLogoUrl,
  },
}

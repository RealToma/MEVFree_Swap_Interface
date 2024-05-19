import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import JSBI from 'jsbi'
import { ChainTokenMap } from 'lib/hooks/useTokenList/utils'
import { Percent, Token } from 'mevswap/sdk-core'
import { FeeAmount } from 'mevswap/v3-sdk'
import Numeral from 'numeral'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// shorten the input string to have 4 characters at start and end
export function shortenString(input: string, chars = 4): string {
  return `${input.substring(0, chars)}...${input.substring(input.length - chars - 2)}`
}

// account is not optional
function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(provider: JsonRpcProvider, account?: string): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract(address: string, ABI: any, provider: JsonRpcProvider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(provider, account) as any)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(chainTokenMap: ChainTokenMap, token?: Token): boolean {
  return Boolean(token?.isToken && chainTokenMap[token.chainId]?.[token.address])
}

export function formattedFeeAmount(feeAmount: FeeAmount): number {
  return feeAmount / 10000
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

// using a currency library here in case we want to add more in future
export const formatDollarFractionAmount = (num: number, digits: number) => {
  const formatter = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return formatter.format(num)
}

export const toK = (num: string) => {
  return Numeral(num).format('0.[00]a')
}

export function formattedNum(number: string, usd = false, fractionDigits = 5) {
  if (number === '' || number === undefined) {
    return usd ? '$0' : 0
  }

  const num = parseFloat(number)

  if (num > 500000000) {
    return (usd ? '$' : '') + toK(num.toFixed(0))
  }

  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return 0
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001'
  }

  if (num > 1000) {
    return usd ? formatDollarFractionAmount(num, 0) : Number(num.toFixed(0)).toLocaleString()
  }

  if (usd) {
    if (num < 0.1) {
      return formatDollarFractionAmount(num, 4)
    } else {
      return formatDollarFractionAmount(num, 2)
    }
  }

  return Number(num.toFixed(fractionDigits)).toLocaleString()
}

export const formatLongNumber = (num: string, usd?: boolean): string => {
  return usd ? `$${Numeral(num).format('0,0')}` : Numeral(num).format('0,0')
}

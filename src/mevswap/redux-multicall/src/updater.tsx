import React, { Dispatch, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Multicall2 } from '../../../abis/types'
import { SupportedChainId } from '../../../constants/chains'
import { useInterfaceMulticall2 } from '../../../hooks/useContract'
import type { UniswapInterfaceMulticall } from '../abi/types'
import { CHUNK_GAS_LIMIT, CONSERVATIVE_BLOCK_GAS_LIMIT } from './constants'
import type { MulticallContext } from './context'
import type { MulticallActions } from './slice'
import type { Call, ListenerOptions, MulticallState, WithMulticallState } from './types'
import { parseCallKey, toCallKey } from './utils/callKeys'
import chunkCalls from './utils/chunkCalls'
import { retry, RetryableError } from './utils/retry'
import useDebounce from './utils/useDebounce'

const FETCH_RETRY_CONFIG = {
  n: Infinity,
  minWait: 1000,
  maxWait: 2500,
}

const DEFAULT_MULTICALL_FUNCTION_NAME = 'multicall'

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multicall multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param blockNumber block number passed as the block tag in the eth_call
 */
async function fetchChunk(
  multicall: UniswapInterfaceMulticall,
  chunk: Call[],
  blockNumber: number,
  multicallFunctionName: string,
  isDebug?: boolean
): Promise<{ success: boolean; returnData: string }[]> {
  console.debug('Fetching chunk', chunk, blockNumber)

  try {
    const { returnData } = await multicall.callStatic[multicallFunctionName](
      chunk.map((obj) => ({
        target: obj.address,
        callData: obj.callData,
        gasLimit: obj.gasRequired ?? CONSERVATIVE_BLOCK_GAS_LIMIT,
      })),
      // we aren't passing through the block gas limit we used to create the chunk, because it causes a problem with the integ tests
      { blockTag: blockNumber }
    )

    if (isDebug) {
      returnData.forEach(({ gasUsed, returnData, success }: any, i: number) => {
        if (
          !success &&
          returnData.length === 2 &&
          gasUsed.gte(Math.floor((chunk[i].gasRequired ?? CONSERVATIVE_BLOCK_GAS_LIMIT) * 0.95))
        ) {
          console.warn(
            `A call failed due to requiring ${gasUsed.toString()} vs. allowed $
            chunk[i].gasRequired ?? CONSERVATIVE_BLOCK_GAS_LIMIT
            }`,
            chunk[i]
          )
        }
      })
    }

    return returnData
  } catch (e) {
    const error = e as any
    if (error.code === -32000 || error.message?.indexOf('header not found') !== -1) {
      throw new RetryableError(`header not found for block number ${blockNumber}`)
    } else if (error.code === -32603 || error.message?.indexOf('execution ran out of gas') !== -1) {
      if (chunk.length > 1) {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Splitting a chunk in 2', chunk)
        }
        const half = Math.floor(chunk.length / 2)
        const [c0, c1] = await Promise.all([
          fetchChunk(multicall, chunk.slice(0, half), blockNumber, multicallFunctionName),
          fetchChunk(multicall, chunk.slice(half, chunk.length), blockNumber, multicallFunctionName),
        ])
        return c0.concat(c1)
      }
    }
    console.error('Failed to fetch chunk', error)
    throw error
  }
}

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multicall2Contract multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
async function fetchChunk2(
  multicall2Contract: Multicall2,
  chunk: Call[],
  minBlockNumber: number
): Promise<{
  results: { success: boolean; returnData: string }[]
  blockNumber: number
}> {
  console.debug('Fetching chunk', chunk, minBlockNumber)
  let resultsBlockNumber: number
  let results: { success: boolean; returnData: string }[]
  try {
    const { blockNumber, returnData } = await multicall2Contract.callStatic.tryBlockAndAggregate(
      false,
      chunk.map((obj) => ({
        target: obj.address,
        callData: obj.callData,
        gasLimit: obj.gasRequired ?? CONSERVATIVE_BLOCK_GAS_LIMIT,
      }))
    )
    resultsBlockNumber = blockNumber.toNumber()
    results = returnData
  } catch (error) {
    console.debug('Failed to fetch chunk', error)
    throw error
  }
  if (resultsBlockNumber < minBlockNumber) {
    console.debug(`Fetched results for old block number: ${resultsBlockNumber.toString()} vs. ${minBlockNumber}`)
    throw new RetryableError('Fetched for old block number')
  }
  return { results, blockNumber: resultsBlockNumber }
}

/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export function activeListeningKeys(
  allListeners: MulticallState['callListeners'],
  chainId?: number
): { [callKey: string]: number } {
  if (!allListeners || !chainId) return {}
  const listeners = allListeners[chainId]
  if (!listeners) return {}

  return Object.keys(listeners).reduce<{ [callKey: string]: number }>((memo, callKey) => {
    const keyListeners = listeners[callKey]

    memo[callKey] = Object.keys(keyListeners)
      .filter((key) => {
        const blocksPerFetch = parseInt(key)
        if (blocksPerFetch <= 0) return false
        return keyListeners[blocksPerFetch] > 0
      })
      .reduce((previousMin, current) => {
        return Math.min(previousMin, parseInt(current))
      }, Infinity)
    return memo
  }, {})
}

/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
export function outdatedListeningKeys(
  callResults: MulticallState['callResults'],
  listeningKeys: { [callKey: string]: number },
  chainId: number | undefined,
  latestBlockNumber: number | undefined
): string[] {
  if (!chainId || !latestBlockNumber) return []
  const results = callResults[chainId]
  // no results at all, load everything
  if (!results) return Object.keys(listeningKeys)

  return Object.keys(listeningKeys).filter((callKey) => {
    const blocksPerFetch = listeningKeys[callKey]

    const data = callResults[chainId][callKey]
    // no data, must fetch
    if (!data) return true

    const minDataBlockNumber = latestBlockNumber - (blocksPerFetch - 1)

    // already fetching it for a recent enough block, don't refetch it
    if (data.fetchingBlockNumber && data.fetchingBlockNumber >= minDataBlockNumber) return false

    // if data is older than minDataBlockNumber, fetch it
    return !data.blockNumber || data.blockNumber < minDataBlockNumber
  })
}

interface FetchChunkContext {
  actions: MulticallActions
  dispatch: Dispatch<any>
  chainId: number
  latestBlockNumber: number
  isDebug?: boolean
}

function onFetchChunkSuccess(
  context: FetchChunkContext,
  chunk: Call[],
  result: Array<{ success: boolean; returnData: string }>
) {
  const { actions, dispatch, chainId, latestBlockNumber, isDebug } = context

  // split the returned slice into errors and results
  const { erroredCalls, results } = chunk.reduce<{
    erroredCalls: Call[]
    results: { [callKey: string]: string | null }
  }>(
    (memo, call, i) => {
      if (result[i].success) {
        memo.results[toCallKey(call)] = result[i].returnData ?? null
      } else {
        memo.erroredCalls.push(call)
      }
      return memo
    },
    { erroredCalls: [], results: {} }
  )

  // dispatch any new results
  if (Object.keys(results).length > 0)
    dispatch(
      actions.updateMulticallResults({
        chainId,
        results,
        blockNumber: latestBlockNumber,
      })
    )

  // dispatch any errored calls
  if (erroredCalls.length > 0) {
    if (isDebug) {
      result.forEach((returnData, ix) => {
        if (!returnData.success) {
          console.debug('Call failed', chunk[ix], returnData)
        }
      })
    } else {
      console.debug('Calls errored in fetch', erroredCalls)
    }
    dispatch(
      actions.errorFetchingMulticallResults({
        calls: erroredCalls,
        chainId,
        fetchingBlockNumber: latestBlockNumber,
      })
    )
  }
}

function onFetchChunkFailure(context: FetchChunkContext, chunk: Call[], error: any) {
  const { actions, dispatch, chainId, latestBlockNumber } = context

  if (error.isCancelledError) {
    console.debug('Cancelled fetch for blockNumber', latestBlockNumber, chunk, chainId)
    return
  }
  console.error('Failed to fetch multicall chunk', chunk, chainId, error)
  dispatch(
    actions.errorFetchingMulticallResults({
      calls: chunk,
      chainId,
      fetchingBlockNumber: latestBlockNumber,
    })
  )
}

export interface UpdaterProps {
  context: MulticallContext
  chainId: number | undefined // For now, one updater is required for each chainId to be watched
  latestBlockNumber: number | undefined
  contract: UniswapInterfaceMulticall
  isDebug?: boolean
  listenerOptions?: ListenerOptions
}

function Updater(props: UpdaterProps): null {
  const { context, chainId, latestBlockNumber, contract, isDebug, listenerOptions } = props
  const { actions, reducerPath } = context
  const dispatch = useDispatch()
  const multicall2Contract = useInterfaceMulticall2()

  // set user configured listenerOptions in state for given chain ID.
  if (chainId && listenerOptions) dispatch(actions.updateListenerOptions({ chainId, listenerOptions }))
  const state = useSelector((state: WithMulticallState) => state[reducerPath])

  // wait for listeners to settle before triggering updates
  const debouncedListeners = useDebounce(state.callListeners, 100)
  const cancellations = useRef<{ blockNumber: number; cancellations: (() => void)[] }>()

  const listeningKeys: { [callKey: string]: number } = useMemo(() => {
    return activeListeningKeys(debouncedListeners, chainId)
  }, [debouncedListeners, chainId])

  const serializedOutdatedCallKeys = useMemo(() => {
    const outdatedCallKeys = outdatedListeningKeys(state.callResults, listeningKeys, chainId, latestBlockNumber)
    return JSON.stringify(outdatedCallKeys.sort())
  }, [chainId, state.callResults, listeningKeys, latestBlockNumber])

  useEffect(() => {
    if (!latestBlockNumber || !chainId || !contract || !multicall2Contract) return

    const outdatedCallKeys: string[] = JSON.parse(serializedOutdatedCallKeys)
    if (outdatedCallKeys.length === 0) return
    const calls = outdatedCallKeys.map((key) => parseCallKey(key))

    const chunkedCalls = chunkCalls(calls, CHUNK_GAS_LIMIT)

    if (cancellations.current && cancellations.current.blockNumber !== latestBlockNumber) {
      cancellations.current.cancellations.forEach((c) => c())
    }

    dispatch(
      actions.fetchingMulticallResults({
        calls,
        chainId,
        fetchingBlockNumber: latestBlockNumber,
      })
    )

    const fetchChunkContext = {
      actions,
      dispatch,
      chainId,
      latestBlockNumber,
      isDebug,
    }

    let multicallFunctionName = ''
    switch (chainId) {
      case SupportedChainId.PULSECHAIN:
      case SupportedChainId.PULSECHAIN_TESTNET:
        multicallFunctionName = 'blockAndAggregate'
        break
      default:
        multicallFunctionName = DEFAULT_MULTICALL_FUNCTION_NAME
    }

    switch (chainId) {
      case SupportedChainId.EVMOS:
        // Execute fetches and gather cancellation callbacks
        const newCancellations2 = chunkedCalls.map((chunk, index) => {
          const { cancel, promise } = retry(
            () => fetchChunk2(multicall2Contract, chunk, latestBlockNumber),
            FETCH_RETRY_CONFIG
          )
          promise
            .then(({ results: returnData, blockNumber: fetchBlockNumber }) => {
              cancellations.current = { cancellations: [], blockNumber: latestBlockNumber }

              // accumulates the length of all previous indices
              const firstCallKeyIndex = chunkedCalls
                .slice(0, index)
                .reduce<number>((memo, curr) => memo + curr.length, 0)
              const lastCallKeyIndex = firstCallKeyIndex + returnData.length

              const slice = outdatedCallKeys.slice(firstCallKeyIndex, lastCallKeyIndex)

              // split the returned slice into errors and success
              const { erroredCalls, results } = slice.reduce<{
                erroredCalls: Call[]
                results: { [callKey: string]: string | null }
              }>(
                (memo, callKey, i) => {
                  if (returnData[i].success) {
                    memo.results[callKey] = returnData[i].returnData ?? null
                  } else {
                    memo.erroredCalls.push(parseCallKey(callKey))
                  }
                  return memo
                },
                { erroredCalls: [], results: {} }
              )

              // dispatch any new results
              if (Object.keys(results).length > 0)
                dispatch(
                  actions.updateMulticallResults({
                    chainId,
                    results,
                    blockNumber: fetchBlockNumber,
                  })
                )

              // dispatch any errored calls
              if (erroredCalls.length > 0) {
                console.debug('Calls errored in fetch', erroredCalls)
                dispatch(
                  actions.errorFetchingMulticallResults({
                    calls: erroredCalls,
                    chainId,
                    fetchingBlockNumber: fetchBlockNumber,
                  })
                )
              }
            })
            .catch((error) => onFetchChunkFailure(fetchChunkContext, chunk, error))
          return cancel
        })

        cancellations.current = {
          blockNumber: latestBlockNumber,
          cancellations: newCancellations2,
        }
        break
      default:
        // Execute fetches and gather cancellation callbacks
        const newCancellations = chunkedCalls.map((chunk) => {
          const { cancel, promise } = retry(
            () => fetchChunk(contract, chunk, latestBlockNumber, multicallFunctionName, isDebug),
            FETCH_RETRY_CONFIG
          )
          promise
            .then((result) => onFetchChunkSuccess(fetchChunkContext, chunk, result))
            .catch((error) => onFetchChunkFailure(fetchChunkContext, chunk, error))
          return cancel
        })

        cancellations.current = {
          blockNumber: latestBlockNumber,
          cancellations: newCancellations,
        }
    }
  }, [actions, chainId, multicall2Contract, dispatch, serializedOutdatedCallKeys, latestBlockNumber, isDebug, contract])

  return null
}

export function createUpdater(context: MulticallContext) {
  const UpdaterContextBound = (props: Omit<UpdaterProps, 'context'>) => {
    return <Updater context={context} {...props} />
  }
  return UpdaterContextBound
}

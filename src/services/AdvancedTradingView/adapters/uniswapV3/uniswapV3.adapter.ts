import { ChainId, Pair, Token } from '@swapr/sdk'

import { request, RequestOptions } from 'graphql-request'

import { subgraphUniswapV3ClientsUris } from '../../../../apollo/client'
import { actions } from '../../advancedTradingView.reducer'
import { AdapterFetchDetails, AdapterInitialArguments, AdapterPayloadType } from '../../advancedTradingView.types'
import { AbstractAdvancedTradingViewAdapter } from '../advancedTradingView.adapter'
import { UNISWAP_PAIR_BURNS_AND_MINTS, UNISWAP_PAIR_SWAPS } from './uniswapV3.queries'
import { UniswapV3PairBurnsAndMints, UniswapV3PairSwaps } from './uniswapV3.types'

export class UniswapV3Adapter extends AbstractAdvancedTradingViewAdapter {
  public updateActiveChainId(chainId: ChainId) {
    this._chainId = chainId
  }

  public setInitialArguments({ chainId, store }: AdapterInitialArguments) {
    this._chainId = chainId
    this._store = store
  }

  public async getPairTrades({
    inputToken,
    outputToken,
    amountToFetch,
    isFirstFetch,
    abortController,
  }: AdapterFetchDetails) {
    if (!this._isSupportedChainId(this._chainId)) return

    const subgraphPairId = this._getSubgraphPairId(inputToken, outputToken)
    console.log('subgraphPairId', subgraphPairId)

    const pair = this.store.getState().advancedTradingView.adapters.uniswapV3[subgraphPairId]

    if ((pair && !isFirstFetch && !pair.swaps?.hasMore) || (pair && isFirstFetch)) return
    console.log('pair', pair)
    try {
      const { swaps } = await request<UniswapV3PairSwaps>({
        url: subgraphUniswapV3ClientsUris[this._chainId],
        document: UNISWAP_PAIR_SWAPS,
        variables: {
          token0_in: [inputToken.address.toLowerCase(), outputToken.address.toLowerCase()],
          token1_in: [inputToken.address.toLowerCase(), outputToken.address.toLowerCase()],
          first: amountToFetch,
          skip: pair?.swaps?.data.length ?? 0,
        },
        signal: abortController('uniswapV3-pair-trades') as RequestOptions['signal'],
      })

      const hasMore = swaps.length === amountToFetch

      this.store.dispatch(
        this.actions.setUniswapV3PairData({
          data: swaps,
          pairId: subgraphPairId,
          hasMore,
          payloadType: AdapterPayloadType.swaps,
        })
      )
    } catch {}
  }

  public async getPairActivity({
    inputToken,
    outputToken,
    amountToFetch,
    isFirstFetch,
    abortController,
  }: AdapterFetchDetails) {
    if (!this._isSupportedChainId(this._chainId)) return

    const subgraphPairId = this._getSubgraphPairId(inputToken, outputToken)

    const pair = this.store.getState().advancedTradingView.adapters.uniswapV3[subgraphPairId]
    console.log('pair', pair)
    if ((pair && !isFirstFetch && !pair.burnsAndMints?.hasMore) || (pair && isFirstFetch)) return

    try {
      const { burns, mints } = await request<UniswapV3PairBurnsAndMints>({
        url: subgraphUniswapV3ClientsUris[this._chainId],
        document: UNISWAP_PAIR_BURNS_AND_MINTS,
        variables: {
          token0_in: [inputToken.address.toLowerCase(), outputToken.address.toLowerCase()],
          token1_in: [inputToken.address.toLowerCase(), outputToken.address.toLowerCase()],
          first: amountToFetch,
          skip: pair?.burnsAndMints?.data.length ?? 0,
        },
        signal: abortController('uniswapV3-pair-activity') as RequestOptions['signal'],
      })

      const hasMore = Boolean(burns.length === amountToFetch || mints.length === amountToFetch)

      this.store.dispatch(
        this.actions.setUniswapV3PairData({
          data: [...burns, ...mints],
          pairId: subgraphPairId,
          hasMore,
          payloadType: AdapterPayloadType.burnsAndMints,
        })
      )
    } catch {}
  }

  private get actions() {
    return actions
  }

  private get store() {
    if (!this._store) throw new Error('No store set')

    return this._store
  }

  private _getSubgraphPairId(inputToken: Token, outputToken: Token) {
    return Pair.getAddress(inputToken, outputToken).toLowerCase()
  }

  private _isSupportedChainId(chainId?: ChainId): chainId is ChainId.MAINNET | ChainId.ARBITRUM_ONE {
    if (!chainId) return false

    return [ChainId.MAINNET, ChainId.ARBITRUM_ONE].includes(chainId)
  }
}

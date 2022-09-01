import { Pair, RoutablePlatform, Token, UniswapV2RoutablePlatform } from '@swapr/sdk'

import { createSelector } from '@reduxjs/toolkit'

import { AppState } from '../../state'
import { AdvancedViewTransaction } from './advancedTradingView.types'

export const selectCurrentSwaprPair = createSelector(
  [(state: AppState) => state.advancedTradingView.pair, (state: AppState) => state.advancedTradingView.adapters.swapr],
  ({ inputToken, outputToken }, swaprPairs) => {
    if (inputToken && outputToken) {
      const pairId = Pair.getAddress(inputToken, outputToken).toLowerCase()

      return swaprPairs[pairId]
    }
  }
)

export const selectCurrentUniswapV3Pair = createSelector(
  [
    (state: AppState) => state.advancedTradingView.pair,
    (state: AppState) => state.advancedTradingView.adapters.uniswapV3,
  ],
  ({ inputToken, outputToken }, swaprPairs) => {
    if (inputToken && outputToken) {
      const pairId = Pair.getAddress(inputToken, outputToken).toLowerCase()

      return swaprPairs[pairId]
    }
  }
)

export const selectHasSwaprPairMoreData = createSelector([selectCurrentSwaprPair], pair => ({
  hasMoreTrades: pair?.swaps?.hasMore ?? true,
  hasMoreActivity: pair?.burnsAndMints?.hasMore ?? true,
}))

export const selectHasUniswapV3PairMoreData = createSelector([selectCurrentUniswapV3Pair], pair => ({
  hasMoreTrades: pair?.swaps?.hasMore ?? true,
  hasMoreActivity: pair?.burnsAndMints?.hasMore ?? true,
}))

//check if any adapter can fetch more data
export const selectHasMoreData = createSelector(
  [selectHasSwaprPairMoreData, selectHasUniswapV3PairMoreData],
  (...adapters) =>
    adapters.reduce<{
      hasMoreTrades: boolean
      hasMoreActivity: boolean
    }>(
      (adaptersHasMore, adapter) => ({
        hasMoreTrades: adaptersHasMore.hasMoreTrades || adapter.hasMoreTrades,
        hasMoreActivity: adaptersHasMore.hasMoreActivity || adapter.hasMoreActivity,
      }),
      { hasMoreTrades: false, hasMoreActivity: false }
    )
)

export const sortsBeforeTokens = (inputToken: Token, outputToken: Token) => {
  return inputToken.sortsBefore(outputToken) ? [inputToken, outputToken] : [outputToken, inputToken]
}

export const selectAllSwaprTrades = createSelector(
  [selectCurrentSwaprPair, (state: AppState) => state.advancedTradingView.pair],
  (pair, { inputToken, outputToken }) => {
    if (!inputToken || !outputToken || !pair)
      return {
        swaprTradeHistory: [],
        swaprLiquidityHistory: [],
      }

    const [token0, token1] = sortsBeforeTokens(inputToken, outputToken)

    const { burnsAndMints, swaps } = pair

    const logoKey = UniswapV2RoutablePlatform.SWAPR.name

    const swaprLiquidityHistory: AdvancedViewTransaction[] = (burnsAndMints?.data ?? []).map(trade => {
      const {
        transaction: { id },
        amount0,
        amount1,
        timestamp,
      } = trade
      return {
        transactionId: id,
        amountIn: `${amount0} ${token0.symbol}`,
        amountOut: `${amount1} ${token1.symbol}`,
        timestamp,
        logoKey,
      }
    })
    const swaprTradeHistory: Required<AdvancedViewTransaction>[] = (swaps?.data ?? []).map(trade => {
      const {
        amount0In,
        amount0Out,
        amount1In,
        amount1Out,
        transaction: { id },
        timestamp,
        amountUSD,
      } = trade
      const normalizedValues = {
        amount0In: Number(amount0In),
        amount0Out: Number(amount0Out),
        amount1In: Number(amount1In),
        amount1Out: Number(amount1Out),
        token0Address: token0.address.toLowerCase(),
        token1Address: token1.address.toLowerCase(),
        inputTokenAddress: inputToken.address.toLowerCase(),
        outputTokenAddress: outputToken.address.toLowerCase(),
      }

      const amount0 = Math.max(normalizedValues.amount0In, normalizedValues.amount0Out)
      const amount1 = Math.max(normalizedValues.amount1In, normalizedValues.amount1Out)

      return {
        transactionId: id,
        amountIn: (normalizedValues.inputTokenAddress === normalizedValues.token0Address
          ? amount0
          : amount1
        ).toString(),
        amountOut: (normalizedValues.outputTokenAddress === normalizedValues.token0Address
          ? amount0
          : amount1
        ).toString(),
        priceToken0: (amount1 / amount0).toString(),
        priceToken1: (amount0 / amount1).toString(),
        timestamp,
        amountUSD,
        isSell:
          (normalizedValues.token0Address === normalizedValues.inputTokenAddress &&
            normalizedValues.amount0In > normalizedValues.amount1In) ||
          (normalizedValues.token1Address === normalizedValues.inputTokenAddress &&
            normalizedValues.amount1In > normalizedValues.amount0In),
        logoKey,
      }
    })
    return {
      swaprTradeHistory,
      swaprLiquidityHistory,
    }
  }
)

export const selectAllUniswapV3Trades = createSelector(
  [selectCurrentUniswapV3Pair, (state: AppState) => state.advancedTradingView.pair],
  (pair, { inputToken, outputToken }) => {
    if (!inputToken || !outputToken || !pair)
      return {
        uniswapV3TradeHistory: [],
        uniswapV3LiquidityHistory: [],
      }

    const [token0, token1] = sortsBeforeTokens(inputToken, outputToken)

    const { burnsAndMints, swaps } = pair

    const logoKey = RoutablePlatform.UNISWAP.name

    const uniswapV3LiquidityHistory: AdvancedViewTransaction[] = (burnsAndMints?.data ?? []).map(trade => {
      const {
        transaction: { id },
        amount0,
        amount1,
        timestamp,
      } = trade
      return {
        transactionId: id,
        amountIn: `${amount0} ${token0.symbol}`,
        amountOut: `${amount1} ${token1.symbol}`,
        timestamp,
        logoKey,
      }
    })
    const uniswapV3TradeHistory: Required<AdvancedViewTransaction>[] = (swaps?.data ?? []).map(trade => {
      const {
        amount0,
        amount1,
        transaction: { id },
        timestamp,
        amountUSD,
      } = trade
      const normalizedValues = {
        amount0: Number(amount0),
        amount1: Number(amount1),
        token0Address: token0.address.toLowerCase(),
        token1Address: token1.address.toLowerCase(),
        inputTokenAddress: inputToken.address.toLowerCase(),
        outputTokenAddress: outputToken.address.toLowerCase(),
      }

      // UniswapV3 returns one amount negative
      const absoluteAmount0 = Math.abs(normalizedValues.amount0)
      const absoluteAmount1 = Math.abs(normalizedValues.amount1)
      const isSell = normalizedValues.amount0 < 0

      return {
        transactionId: id,
        amountIn: (isSell ? absoluteAmount0 : absoluteAmount1).toString(),
        amountOut: (isSell ? absoluteAmount1 : absoluteAmount0).toString(),
        priceToken0: (absoluteAmount1 / absoluteAmount0).toString(),
        priceToken1: (absoluteAmount0 / absoluteAmount1).toString(),
        timestamp,
        amountUSD,
        isSell,
        logoKey,
      }
    })

    console.log('uniswapv3', uniswapV3TradeHistory, uniswapV3LiquidityHistory)
    return {
      uniswapV3TradeHistory,
      uniswapV3LiquidityHistory,
    }
  }
)

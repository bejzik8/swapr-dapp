import { AdapterPayloadType } from '../../advancedTradingView.types'

// subgraph types
type UniswapV3PairBurnsAndMintsTransaction = {
  id: string
  transaction: {
    id: string
  }
  amount0: string
  amount1: string
  amountUSD: string
  timestamp: string
}

type UniswapV3PairSwapTransaction = {
  amount0: string
  amount1: string
  amountUSD: string
  id: string
  timestamp: string
  transaction: { id: string }
}

export type UniswapV3PairSwaps = {
  swaps: UniswapV3PairSwapTransaction[]
}

export type UniswapV3PairBurnsAndMints = {
  burns: UniswapV3PairBurnsAndMintsTransaction[]
  mints: UniswapV3PairBurnsAndMintsTransaction[]
}

// uniswap V3 reducer types
type BasePayload = {
  hasMore: boolean
  pairId: string
}

type UniswapV3PairSwapsPayload = {
  data: UniswapV3PairSwapTransaction[]
  payloadType: AdapterPayloadType.swaps
} & BasePayload

type UniswapV3PairBurnsAndMintsPayload = {
  data: UniswapV3PairBurnsAndMintsTransaction[]
  payloadType: AdapterPayloadType.burnsAndMints
} & BasePayload

export type UniswapV3Pair = {
  swaps?: { data: UniswapV3PairSwapTransaction[]; hasMore: boolean }
  burnsAndMints?: { data: UniswapV3PairBurnsAndMintsTransaction[]; hasMore: boolean }
}

export type UniswapV3ActionPayload = UniswapV3PairSwapsPayload | UniswapV3PairBurnsAndMintsPayload

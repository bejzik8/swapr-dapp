import { Token } from '@swapr/sdk'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SwaprActionPayload } from './adapters/swapr/swapr.types'
import { UniswapV3ActionPayload } from './adapters/uniswapV3/uniswapV3.types'
import { InitialState } from './advancedTradingView.types'

const initialState: InitialState = {
  pair: {
    inputToken: undefined,
    outputToken: undefined,
  },
  adapters: {
    swapr: {},
    uniswapV3: {},
  },
}

const advancedTradingViewSlice = createSlice({
  name: 'advancedTradingView',
  initialState,
  reducers: {
    setPairTokens: (
      state,
      { payload: { inputToken, outputToken } }: PayloadAction<{ inputToken: Token; outputToken: Token }>
    ) => {
      state.pair = {
        inputToken,
        outputToken,
      }
    },
    resetAdapterStore: state => {
      state.pair = {}
      state.adapters.swapr = {}
      state.adapters.uniswapV3 = {}
    },
    setSwaprPairData: (state, action: PayloadAction<SwaprActionPayload>) => {
      const { data, pairId, payloadType, hasMore } = action.payload

      const previousPairData = state.adapters.swapr[pairId]?.[payloadType]?.data ?? []

      state.adapters.swapr[pairId] = {
        ...state.adapters.swapr[pairId],
        [payloadType]: {
          data: [...previousPairData, ...data],
          hasMore,
        },
      }
    },
    setUniswapV3PairData: (state, action: PayloadAction<UniswapV3ActionPayload>) => {
      const { data, pairId, payloadType, hasMore } = action.payload

      const previousPairData = state.adapters.uniswapV3[pairId]?.[payloadType]?.data ?? []

      state.adapters.uniswapV3[pairId] = {
        ...state.adapters.uniswapV3[pairId],
        [payloadType]: {
          data: [...previousPairData, ...data],
          hasMore,
        },
      }
    },
  },
})

export default advancedTradingViewSlice.reducer

export const { actions } = advancedTradingViewSlice

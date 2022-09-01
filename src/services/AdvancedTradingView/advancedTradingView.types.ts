import { ChainId, Token } from '@swapr/sdk'

import { Store } from '@reduxjs/toolkit'

import { AppState } from '../../state'
import { AbstractAdvancedTradingViewAdapter } from './adapters/advancedTradingView.adapter'
import { SwaprPair } from './adapters/swapr/swapr.types'
import { UniswapV3Pair } from './adapters/uniswapV3/uniswapV3.types'

export type InitialState = {
  pair: {
    inputToken?: Token
    outputToken?: Token
  }
  adapters: {
    swapr: {
      [pairId: string]: SwaprPair | undefined
    }
    uniswapV3: {
      [pairId: string]: UniswapV3Pair | undefined
    }
  }
}

export type AdvancedViewTransaction = {
  transactionId: string
  amountIn: string
  amountOut: string
  timestamp: string
  logoKey: string
  isSell?: boolean
  amountUSD?: string
  priceToken0?: string
  priceToken1?: string
}

export enum AdapterKeys {
  SWAPR = 'swapr',
  UNISWAP_V3 = 'uniswapV3',
}

export enum AdapterPayloadType {
  swaps = 'swaps',
  burnsAndMints = 'burnsAndMints',
}

export type AdvancedTradingViewAdapterConstructorParams = {
  adapters: Adapters
  chainId: ChainId
  store: Store<AppState>
}
export type AdapterInitialArguments = Omit<
  AdvancedTradingViewAdapterConstructorParams,
  'adapters' | 'amountOfPairTrades' | 'amountOfPairActivity'
>

export type Adapters = { [key in AdapterKeys]: AbstractAdvancedTradingViewAdapter }

export type AdapterFetchDetails = {
  inputToken: Token
  outputToken: Token
  amountToFetch: number
  isFirstFetch: boolean
  abortController: (id: string) => AbortSignal
}

export enum AdapterAmountToFetch {
  pairTrades = 50,
  pairActivity = 25,
}

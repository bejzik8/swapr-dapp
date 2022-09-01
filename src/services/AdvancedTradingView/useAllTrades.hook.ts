import { useSelector } from 'react-redux'

import { selectAllSwaprTrades, selectAllUniswapV3Trades, selectHasMoreData } from './advancedTradingView.selectors'
import { AdvancedViewTransaction } from './advancedTradingView.types'

export const useAllTrades = (): {
  tradeHistory: Required<AdvancedViewTransaction>[]
  liquidityHistory: AdvancedViewTransaction[]
  hasMore: { hasMoreActivity: boolean; hasMoreTrades: boolean }
} => {
  const { swaprTradeHistory, swaprLiquidityHistory } = useSelector(selectAllSwaprTrades)
  const { uniswapV3TradeHistory, uniswapV3LiquidityHistory } = useSelector(selectAllUniswapV3Trades)

  const hasMore = useSelector(selectHasMoreData)

  const tradeHistory = [...swaprTradeHistory, ...uniswapV3TradeHistory]
  const liquidityHistory = [...swaprLiquidityHistory, ...uniswapV3LiquidityHistory]

  return {
    tradeHistory,
    liquidityHistory,
    hasMore,
  }
}

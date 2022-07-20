import { ChainId } from '@swapr/sdk'

import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { TransactionDetails } from 'state/transactions/reducer'

import { selectBridgeTransactions } from '../../../services/EcoBridge/store/EcoBridge.selectors'

type SwapTransaction = TransactionDetails & { chainId: ChainId }

export const useUserTransactions = (account?: string | null) => {
  const allSwapTransactions = useSelector((state: AppState) => state.transactions)

  const bridgeTransactions = useSelector((state: AppState) => selectBridgeTransactions(state, account ?? undefined))

  if (!account) return { swapTransactions: [], bridgeTransactions: [] }

  const normalizedAccount = account.toLowerCase()

  const swapTransactions = Object.entries(allSwapTransactions).reduce<SwapTransaction[]>(
    (transactions, transactionsPerChain: [string, TransactionDetails]) => {
      const [chainId, allTransactionOnChain] = transactionsPerChain

      Object.values(allTransactionOnChain).map(transaction => {
        if (transaction.from.toLowerCase() === normalizedAccount) {
          transactions.push({
            ...transaction,
            chainId: Number(chainId),
          })
        }
      })

      return transactions
    },
    []
  )

  return {
    swapTransactions,
    bridgeTransactions,
  }
}

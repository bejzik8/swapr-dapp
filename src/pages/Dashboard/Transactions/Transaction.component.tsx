import { ChainId } from '@swapr/sdk'

import React from 'react'
import { CheckCircle, Triangle } from 'react-feather'
import { SerializableTransactionReceipt } from 'state/transactions/actions'

import Loader from '../../../components/Loader'
import { RowFixed } from '../../../components/Row'
import { SwapProtocol } from '../../../state/transactions/reducer'
import { getExplorerLink, getGnosisProtocolExplorerOrderLink } from '../../../utils'
import { IconWrapper, TransactionState, TransactionStatusText, TransactionWrapper } from './Transaction.styles'

export const Transaction = ({
  hash,
  chainId,
  receipt,
  swapProtocol,
  summary,
  pending,
}: {
  hash: string
  chainId: ChainId
  pending: boolean
  receipt?: SerializableTransactionReceipt
  swapProtocol?: string
  summary?: string
}) => {
  const success = !pending && (receipt?.status === 1 || typeof receipt?.status === 'undefined')

  const link =
    swapProtocol === SwapProtocol.COW
      ? getGnosisProtocolExplorerOrderLink(chainId, hash)
      : getExplorerLink(chainId, hash, 'transaction')

  return (
    <TransactionWrapper>
      <TransactionState href={link} pending={pending} success={success}>
        <RowFixed>
          <TransactionStatusText>{summary ?? hash} ↗</TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={pending} success={success}>
          {pending ? <Loader /> : success ? <CheckCircle size="16" /> : <Triangle size="16" />}
        </IconWrapper>
      </TransactionState>
    </TransactionWrapper>
  )
}

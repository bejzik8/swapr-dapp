import { useActiveWeb3React } from 'hooks'
import useENSName from 'hooks/useENSName'
import { BridgeTransactionsSummary } from 'pages/Bridge/BridgeTransactionsSummary'
import React from 'react'

import { AccountDetails } from './AccountDetails'
import { useUserCampaigns } from './Campaigns'
import { Transaction, TransactionListWrapper, useUserTransactions } from './Transactions'

const Dashboard = () => {
  const { account } = useActiveWeb3React()
  const { ENSName, loading } = useENSName(account ?? undefined)
  const { bridgeTransactions, swapTransactions } = useUserTransactions(account)
  useUserCampaigns(account)

  if (!account) return <div>No account connected</div>

  return (
    <div>
      <AccountDetails account={account} ENSName={ENSName} loading={loading} />
      <TransactionListWrapper>
        {!!swapTransactions.length &&
          swapTransactions.map(({ hash, chainId, receipt, swapProtocol, summary }) => (
            <Transaction
              key={hash}
              hash={hash}
              chainId={chainId}
              receipt={receipt}
              swapProtocol={swapProtocol}
              summary={summary}
              pending={!receipt}
            />
          ))}
      </TransactionListWrapper>
      <BridgeTransactionsSummary
        extraMargin
        transactions={bridgeTransactions}
        handleTriggerCollect={() => {
          return
        }}
      />
    </div>
  )
}

export default Dashboard

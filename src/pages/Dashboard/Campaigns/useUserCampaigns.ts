import { subgraphClientsUris } from 'apollo/client'
import request, { gql } from 'graphql-request'
import { useState } from 'react'
import { useAsync } from 'react-use'

import { Deposit, LiquidityMiningCampaign, QueryUserCampaignDepositsResult } from './Campaigns.types'

const QUERY_USER_CAMPAIGN_DEPOSITS = gql`
  query deposits($user: Bytes!) {
    deposits(where: { user: $user }) {
      liquidityMiningCampaign {
        id
        owner
        locked
        initialized
        rewards {
          id
          amount
          token {
            id
            name
          }
        }
        stakedAmount
      }
    }
  }
`

export const useUserCampaigns = (account?: string | null) => {
  const [campaignDeposits, setCampaignDeposits] = useState<LiquidityMiningCampaign[] | undefined>()

  useAsync(async () => {
    if (account) {
      const promises = Object.values(subgraphClientsUris).map(url =>
        request<QueryUserCampaignDepositsResult>(url, QUERY_USER_CAMPAIGN_DEPOSITS, { user: account })
      )

      const data = await Promise.allSettled(promises)

      const results = data.reduce<LiquidityMiningCampaign[]>((total, next) => {
        if (next.status === 'fulfilled') {
          next.value.deposits.forEach((el: Deposit) => {
            total.push(el.liquidityMiningCampaign)
          })
        }
        return total
      }, [])

      setCampaignDeposits(results)
    }

    return
  }, [account])

  return campaignDeposits
}

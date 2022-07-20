type Reward = {
  id: string
  amount: number
  token: Token
}

type Token = {
  id: string
  name: string
}
export type LiquidityMiningCampaign = {
  id: string
  owner: string
  locked: boolean
  initialized: string
  rewards: Reward[]
  stakedAmount: string
}

export type Deposit = {
  liquidityMiningCampaign: LiquidityMiningCampaign
}

export type QueryUserCampaignDepositsResult = {
  deposits: Deposit[] | []
}

export type QueryUserCampaignDepositsRequestResult = {
  status: string
  value: QueryUserCampaignDepositsResult
}

import React from 'react'

import { shortenAddress } from '../../../utils'

export const AccountDetails = ({
  ENSName,
  account,
  loading,
}: {
  ENSName: string | null
  account?: string | null
  loading: boolean
}) => {
  return (
    <div>
      <h1>Account</h1>
      <div>
        {loading ? 'Loading...' : ENSName ? ENSName : null}
        <p>{!ENSName && account && shortenAddress(account)}</p>
      </div>
    </div>
  )
}

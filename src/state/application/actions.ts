import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { ChainId } from 'dxswap-sdk'

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
      }
    }
  | {
      newNetworkChainId: ChainId
    }
  | {
      listUpdate: {
        listUrl: string
        oldList: TokenList
        newList: TokenList
        auto: boolean
      }
    }

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  MOBILE,
  WALLET_SWITCHER,
  NETWORK_SWITCHER,
  ADD_ARBITRUM,
  ETHEREUM_OPTION,
}

export enum MainnetGasPrice {
  INSTANT = 'INSTANT',
  FAST = 'FAST',
  NORMAL = 'NORMAL'
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const updateMainnetGasPrices = createAction<{ [variant in MainnetGasPrice]: string } | null>(
  'application/updateMainnetGasPrices'
)
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')

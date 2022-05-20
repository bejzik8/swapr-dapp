import { ChainId } from '@swapr/sdk'
import { ConnextToken } from './Connext.types'

export const connextSdkChainConfig = {
  [ChainId.MAINNET]: {
    providers: ['https://rpc.ankr.com/eth'],
    transactionManagerAddress: '0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09',
  },
  [ChainId.XDAI]: {
    providers: ['https://rpc.gnosischain.com'],
    transactionMangerAddress: '0x115909BDcbaB21954bEb4ab65FC2aBEE9866fa93',
  },
  [ChainId.ARBITRUM_ONE]: {
    providers: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum'],
    transactionManagerAddress: '0xcF4d2994088a8CDE52FB584fE29608b63Ec063B2',
  },
}

//connext's list of tokens
export const CONNEXT_TOKENS: ConnextToken[] = [
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether USD',
    logoURI: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdt.svg',
    contracts: {
      '1': {
        contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        contract_decimals: 6,
      },
      '42161': {
        contract_address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        contract_decimals: 6,
      },
      '100': {
        contract_address: '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
        contract_decimals: 6,
      },
    },
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    logoURI: 'https://maticnetwork.github.io/polygon-token-assets/assets/usdc.svg',
    contracts: {
      '1': {
        contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        contract_decimals: 6,
      },
      '42161': {
        contract_address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        contract_decimals: 6,
      },
      '100': {
        contract_address: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
        contract_decimals: 6,
      },
    },
  },
  {
    id: 'dai',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    logoURI: 'https://maticnetwork.github.io/polygon-token-assets/assets/dai.svg',
    contracts: {
      '1': {
        contract_address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        contract_decimals: 18,
      },
      '42161': {
        contract_address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        contract_decimals: 18,
      },
      '100': {
        contract_address: '0x0000000000000000000000000000000000000000',
        contract_decimals: 18,
      },
    },
  },
  {
    id: 'weth',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    logoURI: 'https://maticnetwork.github.io/polygon-token-assets/assets/weth.svg',
    contracts: {
      '100': {
        contract_address: '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
        contract_decimals: 18,
      },
      '1': {
        contract_decimals: 18,
        contract_address: '0x0000000000000000000000000000000000000000',
      },
      '42161': {
        contract_decimals: 18,
        contract_address: '0x0000000000000000000000000000000000000000',
      },
    },
  },
  {
    id: 'wbtc',
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    logoURI: 'https://maticnetwork.github.io/polygon-token-assets/assets/wbtc.svg',
    contracts: {
      '1': {
        contract_address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        contract_decimals: 8,
      },
      '42161': {
        contract_address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
        contract_decimals: 8,
      },
      '100': {
        contract_address: '0x8e5bbbb09ed1ebde8674cda39a0c169401db4252',
        contract_decimals: 8,
      },
    },
  },
  {
    id: 'grt',
    symbol: 'GRT',
    name: 'Graph Token',
    logoURI: 'https://maticnetwork.github.io/polygon-token-assets/assets/grt.svg',
    contracts: {
      '1': {
        contract_address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
        contract_decimals: 18,
      },
      '42161': {
        contract_address: '0x23a941036ae778ac51ab04cea08ed6e2fe103614',
        contract_decimals: 18,
      },
      '100': {
        contract_address: '0xfadc59d012ba3c110b08a15b7755a5cb7cbe77d7',
        contract_decimals: 18,
      },
    },
  },
  {
    id: 'gno',
    symbol: 'GNO',
    is_staging: true,
    logoURI: 'https://maticnetwork.github.io/polygon-token-assets/assets/gno.svg',
    name: 'Gnosis Token',
    contracts: {
      '1': {
        contract_address: '0x6810e776880c02933d47db1b9fc05908e5386b96',
        contract_decimals: 18,
      },
      '42161': {
        contract_address: '0xa0b862f60edef4452f25b4160f177db44deb6cf1',
        contract_decimals: 18,
      },
      '100': {
        contract_address: '0x9c58bacc331c9aa871afd802db6379a98e80cedb',
        contract_decimals: 18,
      },
    },
  },
  {
    id: 'fei',
    symbol: 'FEI',
    name: 'Fei USD',
    contracts: {
      '1': {
        contract_address: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
        contract_decimals: 18,
      },
      '42161': {
        contract_address: '0x4a717522566c7a09fd2774ccedc5a8c43c5f9fd2',
        contract_decimals: 18,
      },
    },
  },
  {
    id: 'magic',
    symbol: 'MAGIC',
    is_staging: true,
    name: 'Magic',
    contracts: {
      '1': {
        contract_address: '0xb0c7a3ba49c7a6eaba6cd4a96c55a1391070ac9a',
        contract_decimals: 18,
      },
      '42161': {
        contract_address: '0x539bde0d7dbd336b79148aa742883198bbf60342',
        contract_decimals: 18,
      },
    },
  },
]

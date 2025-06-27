import { appConfig } from '@/constants/app';

export enum ChainId {
  Ethereum = (appConfig.isProd ? 1 : 11155111),
  Avalanche = (appConfig.isProd ? 43114 : 43113),
  BSC = (appConfig.isProd ? 56 : 97),
  Solana = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
}

export enum BlockchainNameEnum {
  ethereum = 'ethereum',
  solana = 'solana',
  avalanche = 'avalanche',
  bsc = 'bsc',
}

export enum CryptoCurrencyEnum {
  ETH = "ETH",
  SOL = "SOL",
  CCIP = "CCIP-BnM",
  LINK = "LINK",
  USDT = "USDT",
  AVALANCHE = "AVALANCHE",
  BSC = "BSC",
  USDC = 'USDC',
  JFOX = 'JFOX',
}


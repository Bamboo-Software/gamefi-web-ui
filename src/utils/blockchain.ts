import { appConfig } from '@/constants/app';
import { blockChainConfig } from '@/constants/blockchain';
import { BlockchainNameEnum, ChainId, CryptoCurrencyEnum } from '@/enums/blockchain';
import { ethers } from 'ethers-ts';
import { avalanche, avalancheFuji, bsc, bscTestnet, Chain, mainnet, sepolia } from 'viem/chains';

export function getBlockchainConfigByChainId(chainId: ChainId) {
  switch (chainId) {
    case ChainId.Avalanche:
      return {
        nftContractAddress: blockChainConfig.nftContractAddressAvalanche,
        nftContractABI: blockChainConfig.nftContractABIAvalanche,
        buyerContractAddress: blockChainConfig.nftBuyerContractAddressAvalanche,
        buyerContractABI: blockChainConfig.nftBuyerContractABIAvalanche,
        stakingContractAddress: blockChainConfig.stakingContractAddressAvalanche,
        stakingContractABI: blockChainConfig.stakingContractABIAvalanche,
      };
    case ChainId.Ethereum:
      return {
        wethContractAddress: blockChainConfig.wethContractAddressEthereum,
        buyerContractAddress: blockChainConfig.nftBuyerContractAddressETH,
        buyerContractABI: blockChainConfig.nftBuyerContractABIETH,
        stakingContractAddress: blockChainConfig.stakingContractAddressEthereum,
        stakingContractABI: blockChainConfig.stakingContractABIEthereum,
      };

    case ChainId.BSC:
      return {
        wbnbContractAddress: blockChainConfig.wbnbContractAddressBSC,
        buyerContractAddress: blockChainConfig.nftBuyerContractAddressBSC,
        buyerContractABI: blockChainConfig.nftBuyerContractABIBSC,
        stakingContractAddress: blockChainConfig.stakingContractAddressBSC,
        stakingContractABI: blockChainConfig.stakingContractABIBSC,
      };
    default:
      throw new Error('Unsupported chain');
  }
}

export function getTokenAddressByChainIdAndTokenName(
  chainId: ChainId,
  tokenName: CryptoCurrencyEnum
): string {
  switch (chainId) {
    case ChainId.Avalanche:
      switch (tokenName) {
        case CryptoCurrencyEnum.LINK:
          return blockChainConfig.linkContractAddressAvalanche;
        case CryptoCurrencyEnum.AVALANCHE:
          return ethers.constants.AddressZero;
        default:
          throw new Error(`Unsupported token ${tokenName} on Avalanche`);
      }
    case ChainId.Ethereum:
      switch (tokenName) {
        case CryptoCurrencyEnum.ETH:
          return blockChainConfig.wethContractAddressEthereum;
        case CryptoCurrencyEnum.CCIP:
          return blockChainConfig.ccipBnMContractAddressEthereum;
        default:
          throw new Error(`Unsupported token ${tokenName} on Ethereum`);
    }
    case ChainId.BSC:
      switch (tokenName) {
        case CryptoCurrencyEnum.BSC:
          return blockChainConfig.wbnbContractAddressBSC;
        case CryptoCurrencyEnum.CCIP:
          return blockChainConfig.ccipBnMContractAddressBSC;
        default:
          throw new Error(`Unsupported token ${tokenName} on Ethereum`);
    }
    default:
      throw new Error(`Unsupported chain ID ${chainId}`);
  }
}

export function isTokenNativeOnChain(
  token: CryptoCurrencyEnum,
  chainId: ChainId
): boolean {
  const nativeTokensMap: Record<ChainId, CryptoCurrencyEnum> = {
    [ChainId.Ethereum]: CryptoCurrencyEnum.ETH,
    [ChainId.Avalanche]: CryptoCurrencyEnum.AVALANCHE,
    [ChainId.Solana]: CryptoCurrencyEnum.SOL,
    [ChainId.BSC]: CryptoCurrencyEnum.BSC,
  };

  return nativeTokensMap[chainId] === token;
}
export const EVM_CHAIN_IDS = new Set<number| string>([
  ChainId.Ethereum,
  ChainId.Avalanche,
  ChainId.BSC,
]);

export const SOLANA_CHAIN_IDS = new Set<number| string>([
  ChainId.Solana,
]);

export function isEvmChain(chainId: number| string): boolean {
  return EVM_CHAIN_IDS.has(chainId);
}

export function isSolanaChain(chainId: number| string): boolean {
  return SOLANA_CHAIN_IDS.has(chainId);
}

export function mapChainIdToBlockchainName(chainId: ChainId): BlockchainNameEnum {
  switch (chainId) {
    case ChainId.Ethereum:
      return BlockchainNameEnum.ethereum;
    case ChainId.Avalanche:
      return BlockchainNameEnum.avalanche;
    case ChainId.Solana:
      return BlockchainNameEnum.solana;
    case ChainId.BSC:
      return BlockchainNameEnum.bsc;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}

export const SUPPORTED_TOKENS_BY_CHAIN: Record<ChainId, {
  buy: CryptoCurrencyEnum[],
  stake: CryptoCurrencyEnum[]
}> = {
  [ChainId.Avalanche]: {
    buy: [CryptoCurrencyEnum.LINK, CryptoCurrencyEnum.AVALANCHE],
    stake: [CryptoCurrencyEnum.LINK, CryptoCurrencyEnum.AVALANCHE],
  },
  [ChainId.Ethereum]: {
    buy: [ CryptoCurrencyEnum.ETH, CryptoCurrencyEnum.CCIP],
    stake: [CryptoCurrencyEnum.ETH, CryptoCurrencyEnum.CCIP],
  },
  [ChainId.Solana]: {
    buy: [CryptoCurrencyEnum.SOL],
    stake: [CryptoCurrencyEnum.SOL],
  },
  [ChainId.BSC]: {
    buy: [CryptoCurrencyEnum.BSC, CryptoCurrencyEnum.CCIP],
    stake: [CryptoCurrencyEnum.BSC, CryptoCurrencyEnum.CCIP],
  },
};


export function generateRandomStakeId(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const blockchainExplorerMap: Record<BlockchainNameEnum, { chain: Chain| null; explorerUrl: string }> = {
  [BlockchainNameEnum.ethereum]: {
    chain: appConfig.isProd? mainnet: sepolia,
    explorerUrl: (appConfig.isProd? mainnet: sepolia).blockExplorers?.default.url,
  },
  [BlockchainNameEnum.avalanche]: {
    chain: (appConfig.isProd? avalanche: avalancheFuji),
    explorerUrl: (appConfig.isProd? avalanche: avalancheFuji).blockExplorers?.default.url,
  },
  [BlockchainNameEnum.bsc]: {
    chain: (appConfig.isProd? bsc: bscTestnet),
    explorerUrl: (appConfig.isProd? bsc: bscTestnet).blockExplorers?.default.url,
  },
  [BlockchainNameEnum.solana]: {
    chain: null, 
    explorerUrl: 'https://explorer.solana.com',
  },
};

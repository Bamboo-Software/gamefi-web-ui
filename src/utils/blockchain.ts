import { blockChainConfig } from '@/constants/blockchain';
import { BlockchainNameEnum, ChainId, CryptoCurrencyEnum } from '@/enums/blockchain';
import { ethers } from 'ethers-ts';

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
        case CryptoCurrencyEnum.USDT:
          return blockChainConfig.usdtContractAddressAvalanche;
        case CryptoCurrencyEnum.AVALANCHE:
          return ethers.constants.AddressZero;
        default:
          throw new Error(`Unsupported token ${tokenName} on Avalanche`);
      }
    case ChainId.Ethereum:
      switch (tokenName) {
        case CryptoCurrencyEnum.ETH:
          return blockChainConfig.wethContractAddressEthereum;
        case CryptoCurrencyEnum.USDT:
          return blockChainConfig.usdtContractAddressEthereum;
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
  };

  return nativeTokensMap[chainId] === token;
}
export const EVM_CHAIN_IDS = new Set<number| string>([
  ChainId.Ethereum,
  ChainId.Avalanche,
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
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}

export const SUPPORTED_TOKENS_BY_CHAIN: Record<ChainId, {
  buy: CryptoCurrencyEnum[],
  stake: CryptoCurrencyEnum[]
}> = {
  [ChainId.Avalanche]: {
    buy: [CryptoCurrencyEnum.USDT, CryptoCurrencyEnum.AVALANCHE],
    stake: [CryptoCurrencyEnum.USDT, CryptoCurrencyEnum.AVALANCHE],
  },
  [ChainId.Ethereum]: {
    buy: [ CryptoCurrencyEnum.ETH, CryptoCurrencyEnum.USDT],
    stake: [CryptoCurrencyEnum.ETH, CryptoCurrencyEnum.USDT],
  },
  [ChainId.Solana]: {
    buy: [CryptoCurrencyEnum.SOL],
    stake: [CryptoCurrencyEnum.SOL],
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

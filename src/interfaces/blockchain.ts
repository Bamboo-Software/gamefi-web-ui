/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AvalancheBlockchainConfig {
  nftContractAddress: string;
  nftContractABI: any;
  buyerContractAddress: string;
  buyerContractABI: any;
  stakingContractAddress: string;
  stakingContractABI: any;
}

export interface EthereumBlockchainConfig {
  wethContractAddress: string;
  buyerContractAddress: string;
  buyerContractABI: any;
}

export type BlockchainConfig = AvalancheBlockchainConfig | EthereumBlockchainConfig;

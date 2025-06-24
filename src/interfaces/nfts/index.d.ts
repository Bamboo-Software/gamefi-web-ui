import { BlockchainNameEnum } from '@/enums/blockchain';
import { Season } from '../seasons';

export interface NFT {
  _id: string;
  id: string;
  name: string;
  description?: string;
  image?: string;
  seasonId: string;
  priceUsd: number;
  createdAt?: Date;
  updatedAt?: Date;
  season?: Season;
  isActive: boolean
  isBought: boolean
}

export interface SubmitTxHashRequest {
  network: BlockchainNameEnum,
  txHash: string
}
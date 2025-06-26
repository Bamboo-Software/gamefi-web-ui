import { StakeEntryStatus } from '@/enums/stake';

export interface SubmitTxHashRequest {
  network: BlockchainNameEnum,
  txHash: string
}

export interface IStakeEntry {
  _id?: string;
  userId: string;
  walletAddress: string;
  stakeId: string;
  amount: number;
  timestamp: Date;
  withdrawn: boolean;
  isNative: boolean;
  txHash: string;
  createdAt?: Date;
  updatedAt?: Date;
  sourceChainId: number,
  tokenAddress?: string,
  symbol?: string,
  status: StakeEntryStatus
}

export interface ILast7DaysStake{
  date: string;
  averageStake: number
}

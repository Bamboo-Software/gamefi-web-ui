import { BlockchainNameEnum } from '@/enums/blockchain';
import { NFT } from '../nfts';
import { UserNFTStatus } from '@/enums/user-nft';

export interface UserNFT {
  _id?: string;
  userId?: string;
  nftId?: string;
  txHash: string;
  acquiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  nft: NFT;
  status: UserNFTStatus;
  network: BlockchainNameEnum;
}

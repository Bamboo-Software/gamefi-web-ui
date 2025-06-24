import { PaymentProviderEnum } from "@/constants/wallet";
import { PrizeTypeEnum } from "@/enums/games";
import { TransactionStatusEnum, TransactionTypeEnum } from "@/enums/transactions";
import { IUser } from "./IUser";
import { IGame } from "@/services/game";
import { BlockchainNameEnum, CryptoCurrencyEnum } from '@/enums/blockchain';
export interface ITransaction {
  _id: string;
  userId: string;
  userTaskId?: string;
  referralId?: string;
  lotteryPrizeId?: string;
  gameId?: string;
  gameLeaderboardPrizeId?: string;
  provider?: PaymentProviderEnum;
  type: TransactionTypeEnum;
  status: TransactionStatusEnum;
  earnPoints?: number;
  spendPoints?: number;
  tokenAmount?: number;
  fromWalletAddress?: string;
  toWalletAddress?: string;
  fromChain?: BlockchainNameEnum;
  toChain?: BlockchainNameEnum;
  fromCryptoCurrency?: CryptoCurrencyEnum;
  toCryptoCurrency?: CryptoCurrencyEnum;
  refId?: string;
  memoTag?: string;
  metadata?: Record<string, unknown>;
  socialPostRequired?: boolean;
  socialPostVerified?: boolean;
  expiresAt?: Date;
  multiplier?: number;
  user?: IUser;
  lotteryPrize?: ILotteryPrize;
  game?: IGame;
  gameLeaderboardPrize?: GameLeaderboardPrize;
}

export interface ILotteryPrize {
  prizeName: string;
  prizeType: PrizeTypeEnum;
  amountAwarded: number;
  cryptoCurrency: CryptoCurrencyEnum;
  blockchainName: BlockchainNameEnum;
  probability: number;
  active: boolean;
  metadata?: Record<string, unknown>;
}

export interface GameLeaderboardPrize {
  gameId: string;
  minRank: number;
  maxRank: number;
  prizeName: string;
  prizeType: PrizeTypeEnum;
  amountAwarded: number;
  cryptoCurrency: CryptoCurrencyEnum;
  blockchainName: BlockchainNameEnum;
  active: boolean;
  metadata?: Record<string, unknown>;
}

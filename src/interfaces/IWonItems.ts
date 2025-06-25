import { CryptoCurrencyEnum } from '@/enums/blockchain';
import { ApiResponse } from "./IApiResponse";

export interface IWonItemsData {
  items: IWonItem[];
  total: number;
}

export interface IWonItem {
  expiresAt: string;
  lotteryPrize: {
    prizeName: string;
    prizeType: string;
    cryptoCurrency: CryptoCurrencyEnum;
  };
  gameLeaderboardPrize: {
    prizeName: string;
    prizeType: string;
    cryptoCurrency: CryptoCurrencyEnum;
  };
  metadata?: Record<string, unknown>;
  socialPostRequired?: boolean;
  socialPostVerified?: boolean;
}

export type IWonItemsResponse = ApiResponse<IWonItemsData>;

import { CryptoCurrencyEnum, PrizeTypeEnum } from "@/enums/games";
import { ApiResponse } from "../IApiResponse";

export interface IItemsData {
    items: IItem[];
    total: number;
  }

export interface IItem {
    _id: string;
    prizeName: string;
    prizeType: PrizeTypeEnum;
    amountAwarded?: number;
    cryptoCurrency: CryptoCurrencyEnum;
    blockchainName?: string;
}

export type IItemsResponse = ApiResponse<IItemsData>;

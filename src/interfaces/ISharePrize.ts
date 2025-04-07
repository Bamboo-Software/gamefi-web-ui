import { SocialTypeEnum } from "@/enums/user";
import { ApiResponse } from "./IApiResponse";

export interface SharePrizeRequest {
  transactionId: string;
  socialType: SocialTypeEnum;
  imageUrl: string;
}

export type SharePrizeResponse = ApiResponse<true>;

import { PaymentProviderEnum } from "@/constants/wallet";
import { ApiResponse } from "../IApiResponse";

export interface IWallet {
  id: string;
  userId: string;
  walletAddress: string;
  provider: PaymentProviderEnum;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddWalletRequest {
  walletAddress: string;
  provider: PaymentProviderEnum;
}

export type IAddWalletResponse = ApiResponse<IWallet>;

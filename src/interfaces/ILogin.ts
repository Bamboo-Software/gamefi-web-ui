import { LoginSocialActionTypeEnum, SocialTypeEnum } from "@/enums/social-type.enum";
import { ApiResponse } from "./IApiResponse";
import { IUser, IUserSocial } from "./IUser";

export interface CreateLoginSocialUrlRequest {
  state?: string;
  ref?: string;
  action?: LoginSocialActionTypeEnum;
  token?: string;
  timezone?: string;
}
export interface LoginSocialRequest {
  socialType: SocialTypeEnum;
  accessToken?: string;
  refreshToken?: string;
  telegramInitData?: string;
  walletAddress?: string;
  signature?: string;
  message?: string;
  ref?: string;
  timezone?: string;
}

export interface LoginResponseData {
  user: IUser;
  token: string;
}

export type LoginSocialResponse = ApiResponse<LoginResponseData>;
export type SyncSocialResponse = ApiResponse<IUserSocial>;
export type UnsyncSocialResponse = ApiResponse<boolean>;

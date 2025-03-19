import { SocialTypeEnum } from "@/enums/social-type.enum";
import { RoleTypeEnum } from "@/enums/user";

export interface IUser {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  username?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatar?: string;
  active?: boolean;
  telegramLanguageCode?: string;
  role?: RoleTypeEnum;
  referralCode?: string;
  isTelegramPremium?: boolean;
  pointsBalance: number;
  timezone?: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  transactionCount?: number;
  referralCount?: number;
  achievementCount?: number;
  socials?: IUserSocial[];
}

export interface IUserSocial {
  id: string;
  socialType?: SocialTypeEnum;
  socialId?: string;
}

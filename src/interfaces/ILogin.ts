import { LoginSocialActionTypeEnum } from "@/enums/social-type.enum";

export interface CreateLoginSocialUrlRequest {
    state?: string;
    ref?: string;
    action?: LoginSocialActionTypeEnum;
    token?: string;
    timezone?: string;
  }
  
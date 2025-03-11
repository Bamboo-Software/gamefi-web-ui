import { SIWXSession } from "@reown/appkit/react";
import { SIWXVerifier } from "./SIWXVerifier";
import { SocialTypeEnum } from "@/enums/social-type.enum";
import { LoginSocialRequest } from "@/interfaces/ILogin";
import { LoginResponse } from "../auth";

export class SolanaVerifier extends SIWXVerifier {
  public readonly chainNamespace = "solana";

  private loginSocialAPI: (data: LoginSocialRequest) => Promise<LoginResponse>;

  constructor(
    loginSocialAPI: (data: LoginSocialRequest) => Promise<LoginResponse>
  ) {
    super();
    this.loginSocialAPI = loginSocialAPI;
  }

  public async verify(session: SIWXSession): Promise<boolean> {
    try {
      const result = await this.loginSocialAPI({
        socialType: SocialTypeEnum.Phantom,
        walletAddress: session.data.accountAddress,
        signature: session.signature,
        message: session.message.toString(),
      });

      return result.success;
    } catch {
      return false;
    }
  }
}

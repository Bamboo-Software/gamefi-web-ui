import { SIWXVerifier } from "./SIWXVerifier";
import { SIWXSession } from "@reown/appkit/react";
import { SocialTypeEnum } from "@/enums/social-type.enum";
import { LoginResponse } from "../auth";
import { LoginSocialRequest } from "@/interfaces/ILogin";

export class EIP155Verifier extends SIWXVerifier {
  public readonly chainNamespace = "eip155";

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
        socialType: SocialTypeEnum.Metamask,
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

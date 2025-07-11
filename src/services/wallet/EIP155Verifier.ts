import { SIWXVerifier } from "./SIWXVerifier";
import { SIWXSession } from "@reown/appkit/react";
import { SocialTypeEnum } from "@/enums/social-type.enum";
import { LoginSocialRequest, LoginSocialResponse, SyncSocialResponse } from "@/interfaces/ILogin";

export class EIP155Verifier extends SIWXVerifier {
  public readonly chainNamespace = "eip155";

  private loginOrSyncSocialAPI: (data: LoginSocialRequest) => Promise<LoginSocialResponse | SyncSocialResponse>;

  constructor(
    loginOrSyncSocialAPI: (data: LoginSocialRequest) => Promise<LoginSocialResponse | SyncSocialResponse>
  ) {
    super();
    this.loginOrSyncSocialAPI = loginOrSyncSocialAPI;
  }

  public async verify(session: SIWXSession): Promise<boolean> {
    try {
      const result = await this.loginOrSyncSocialAPI({
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

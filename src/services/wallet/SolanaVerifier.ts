import { SIWXSession } from "@reown/appkit/react";
import { SIWXVerifier } from "./SIWXVerifier";
import { SocialTypeEnum } from "@/enums/social-type.enum";
import { LoginSocialRequest, LoginSocialResponse, SyncSocialResponse } from "@/interfaces/ILogin";

export class SolanaVerifier extends SIWXVerifier {
  public readonly chainNamespace = "solana";

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

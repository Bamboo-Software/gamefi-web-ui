import { ActionButtonList } from "./ActionButtonList";
import { createAppKit } from "@reown/appkit/react";
import {
  metadata,
  networks,
  projectId,
  solanaWeb3JsAdapter,
  wagmiAdapter,
} from "@/configs/reown";
import { DefaultSIWX } from "@reown/appkit-siwx";
import { EIP155Verifier } from "@/services/wallet/EIP155Verifier";
import { useLoginSocialMutation, useSyncSocialMutation } from "@/services/auth";
import { LoginSocialRequest } from "@/interfaces/ILogin";
import { SolanaVerifier } from "@/services/wallet/SolanaVerifier";
import routes from "@/constants/routes";
import { useAuthToken } from "@/hooks/useAuthToken";

const ConnectWallet = () => {
  const [loginSocial] = useLoginSocialMutation();
  const [syncSocial] = useSyncSocialMutation();
  const { setToken, token } = useAuthToken();
  const { ROOT } = routes;

  const loginOrSyncSocialWrapper = async (data: LoginSocialRequest) => {
    let result;
    if (!token) {
      result = await loginSocial({
        ...data,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).unwrap();
      if (result?.data.token) {
        setToken(result.data.token);
        window.location.href = ROOT;
      }
    } else {
      result = await syncSocial({
        ...data,
      }).unwrap();
    }

    return result;
  };
  // Create modal
  createAppKit({
    adapters: [wagmiAdapter, solanaWeb3JsAdapter],
    projectId,
    networks,
    metadata,
    themeMode: "dark",
    features: {
      analytics: true, // Optional - defaults to your Cloud configuration
      socials: [],
      email: false,
    },
    allWallets: "SHOW",
    enableWalletConnect: true,
    themeVariables: {
      "--w3m-accent": "#000000",
    },
    debug: true,
    siwx: new DefaultSIWX({
      verifiers: [
        new EIP155Verifier(loginOrSyncSocialWrapper),
        new SolanaVerifier(loginOrSyncSocialWrapper),
      ],
    }),
  });

  return (
    <div className="flex flex-col  justify-center items-center">
      {/* @ts-expect-error Add this line while our team fix the upgrade to react 19 for global components */}
      <appkit-button />
      <ActionButtonList />
    </div>
  );
};

export default ConnectWallet;

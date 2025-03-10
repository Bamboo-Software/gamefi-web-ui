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
import { useLoginSocialMutation } from "@/services/auth";
import { LoginSocialRequest } from "@/interfaces/ILogin";
import { SolanaVerifier } from "@/services/wallet/SolanaVerifier";
import routes from "@/constants/routes";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useNavigate } from "react-router-dom";

const ConnectWallet = () => {
  const [loginSocial] = useLoginSocialMutation();
  const { setToken } = useAuthToken();
  const navigate = useNavigate();
  const { ROOT } = routes;

  // Tạo một hàm wrapper để gọi `loginSocial`
  const loginSocialWrapper = async (data: LoginSocialRequest) => {
    const result = await loginSocial({
      ...data,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).unwrap();
    if (result.success) {
      setToken(result.data.token);
      navigate(ROOT);
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
    themeVariables: {
      "--w3m-accent": "#000000",
    },
    siwx: new DefaultSIWX({
      verifiers: [
        new EIP155Verifier(loginSocialWrapper),
        new SolanaVerifier(loginSocialWrapper),
      ],
    }),
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <appkit-button />
      <ActionButtonList />
    </div>
  );
};

export default ConnectWallet;

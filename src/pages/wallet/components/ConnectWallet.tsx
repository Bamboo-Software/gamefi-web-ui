import { ActionButtonList } from "./ActionButtonList";
import { InfoList } from "./InfoList";
import { createAppKit } from "@reown/appkit/react";
import {
  generalConfig,
  solanaWeb3JsAdapter,
  wagmiAdapter,
} from "@/configs/reown";

const ConnectWallet = () => {
  // Create modal
  createAppKit({
    adapters: [wagmiAdapter, solanaWeb3JsAdapter],
    ...generalConfig,
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <appkit-button />
      <ActionButtonList />
    </div>
  );
};

export default ConnectWallet;

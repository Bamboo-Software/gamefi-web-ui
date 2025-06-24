
import { ActionButtonList } from "./ActionButtonList";
const ConnectWallet = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* @ts-expect-error Add this line while our team fix the upgrade to react 19 for global components */}
      <appkit-button />
      <ActionButtonList />
    </div>
  );
};

export default ConnectWallet;
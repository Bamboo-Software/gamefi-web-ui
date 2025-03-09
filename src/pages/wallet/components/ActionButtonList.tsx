// import { networks } from "@/configs/reown";
import {
  useDisconnect,
  useAppKit,
  // useAppKitNetwork,
} from "@reown/appkit/react";

export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  // const { switchNetwork } = useAppKitNetwork();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };
  return (
    <div>
      <button
        className="px-[15px] py-[10px] bg-white text-black border-2 border-black rounded-[6px] text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out m-[15px] hover:bg-black hover:text-white active:bg-gray-800 active:text-white"
        onClick={() => open()}
      >
        Open
      </button>
      <button
        className="px-[15px] py-[10px] bg-white text-black border-2 border-black rounded-[6px] text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out m-[15px] hover:bg-black hover:text-white active:bg-gray-800 active:text-white"
        onClick={handleDisconnect}
      >
        Disconnect
      </button>
    </div>
  );
};

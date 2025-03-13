import {
  useDisconnect,
  useAppKit,
} from "@reown/appkit/react";
import { toast } from "sonner";
import { PiPlugsConnected } from "react-icons/pi";
import { TbPlugConnectedX } from "react-icons/tb";



export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      toast.error(`Failed to disconnect: ${error}`);
    }
  };
  return (
    <div className="flex flex-row mt-2 space-x-2">
      <button
        className="bg-green-500 py-1.5 space-x-2 px-4 text-white flex flex-row justify-center items-center  border-1 border-green-300 rounded-sm text-base font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-green-400 hover:text-white active:bg-gray-800 active:text-white"
        onClick={() => open()}
      >
        <PiPlugsConnected className="text-lg"/><span>Open</span>
      </button>
      <button
        className="bg-red-500 py-1.5 space-x-2 px-4 text-white flex flex-row justify-center items-center border-1 border-red-300 rounded-sm text-base font-medium cursor-pointer transition-all duration-300 ease-in-out hover:bg-red-400 hover:text-white active:bg-gray-800 active:text-white"
        onClick={handleDisconnect}
      >
       <TbPlugConnectedX className="text-lg"/><span>Disconnect</span>
      </button>
    </div>
  );
};

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Dropdown from "@/components/dropdown";
import { useNavigate } from "react-router-dom";
import routes from "@/constants/routes";
import coin from "@/assets/icons/coin.svg";
import { useLocalStorage } from "react-use";
import { useDisconnect } from "@reown/appkit/react";

interface UserAvatarDropdownProps {
  imageUrl?: string;
  userName: string;
  fallback: string;
  pointsBalance?: number;
  onLogout?: () => void;
}

const { PROFILE, AUTH } = routes;

const UserAvatarDropdown = ({
  imageUrl,
  userName,
  fallback,
  pointsBalance = 0,
}: UserAvatarDropdownProps) => {
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const [, , remove] = useLocalStorage("auth-token", "foo");

  const trigger = (
    <div className="relative inline-block">
      <Avatar>
        <AvatarImage src={imageUrl} alt={userName} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
    </div>
  );

  const gotoProfile = () => {
    navigate(PROFILE);
  };

  const handleLogout = async () => {
    try {
      remove();
      await disconnect();
      window.location.href= AUTH;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const content = (
    <div className="w-auto p-2 rounded-md shadow-lg">
      <div className="flex items-center gap-3 p-2">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={imageUrl} alt={userName} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium truncate" title={userName}>
            {userName}
          </span>
          {pointsBalance ? (
          <div className="flex items-center gap-1 text-[#FFC800] font-semibold">
          <img src={coin} alt="points" className="w-4 h-4" />
          <span className="truncate">{pointsBalance.toLocaleString()}</span>
        </div>
          ) : <></>}

        </div>
      </div>
      <div className="mt-2 ">
        <button
          onClick={gotoProfile}
          className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-700/50 rounded-md font-semibold transition-colors"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-700/50 rounded-md font-semibold transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
  return (
    <div className="text-gray-200">
      <Dropdown
        contentClassName="bg-gradient-to-b from-[#47C3E6]/95 via-[#47C3E6]/95 via-[#32BAE0]/95  via-[#13A0C8]/95 to-[#24E6F3]/95"
        position="right"
        triggers={trigger}
        contents={content}
        className=""
        offset={4}
      />
    </div>
  );
};

export default UserAvatarDropdown;

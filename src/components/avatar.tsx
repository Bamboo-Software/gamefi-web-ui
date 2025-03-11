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
    <Avatar>
      <AvatarImage src={imageUrl} alt={userName} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );

  const gotoProfile = () => {
    navigate(PROFILE);
  };

  const handleLogout = async () => {
    try {
      remove();
      await disconnect();
      navigate(AUTH);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const content = (
    <div className="w-[240px] p-2">
      <div className="flex items-center gap-3 p-2">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={imageUrl} alt={userName} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate" title={userName}>
            {userName}
          </span>
          <div className="flex items-center gap-1 text-[#FFC800] font-semibold">
            <img src={coin} alt="points" className="w-4 h-4" />
            <span className="truncate">{pointsBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 border-t border-gray-700/50">
        <button
          onClick={gotoProfile}
          className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-700/50 rounded-md transition-colors"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-700/50 rounded-md text-red-400 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="text-gray-200">
      <Dropdown position="right" triggers={trigger} contents={content} />
    </div>
  );
};

export default UserAvatarDropdown;

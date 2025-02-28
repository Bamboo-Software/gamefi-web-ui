import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import  Dropdown  from "@/components/dropdown"

interface UserAvatarDropdownProps {
  imageUrl?: string;
  userName: string;
  fallback: string;
}

const UserAvatarDropdown = ({ 
  imageUrl = "https://github.com/shadcn.png",
  userName = "Hoang Nguyen",
  fallback = "HN"
}: UserAvatarDropdownProps) => {
  const trigger = (
    <Avatar>
      <AvatarImage src={imageUrl} alt={userName} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );

  const content = (
    <div className="min-w-[200px] p-2">
      <div className="flex items-center gap-3 p-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={imageUrl} alt={userName} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </div>
      <div className="mt-2 border-t border-gray-700/50">
        <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-700/50 rounded-md transition-colors">
          Profile
        </button>
        <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-700/50 rounded-md transition-colors">
          Settings
        </button>
        <button className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-700/50 rounded-md text-red-400 transition-colors">
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="text-gray-200">
      <Dropdown
        position="right"
        triggers={trigger}
        contents={content}
      />
    </div>
  );
};

export default UserAvatarDropdown;
import coin from "@/assets/icons/coin.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMappedFriend } from "@/interfaces/friend/IFriend";
import { formatCompactUser } from "@/utils/formatCompactNumber";

const FriendInfo = ({ friendInfo }: { friendInfo: IMappedFriend }) => {
  return (
    <div className="flex flex-row">
      <div className="relative size-10 rounded-full flex items-center justify-center bg-gradient-to-b from-[#24E6F3] to-[#0F8D98] border-gradient">
        <div className="relative size-8 rounded-full flex items-center justify-center bg-white border-gradient">
          <Avatar>
            <AvatarImage src={friendInfo.avatar} alt={friendInfo.name} loading="lazy" />
            <AvatarFallback>{friendInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="flex ml-2 flex-col justify-between">
        <p className="text-sm truncate font-semibold">
          {`${friendInfo.name}`.length > 15 ? `${friendInfo.name}`.slice(0, 10) + "..." : `${friendInfo.name}`}
        </p>
        <div className="w-full flex gap-2">
          <div className="flex gap-1">
            <img className="size-4" src={coin} alt="" />
            <p className="text-xs text-gray-100 truncate">{formatCompactUser(friendInfo.pointsBalance)}</p>
          </div>
          <div className="flex gap-1">
            <p className="text-xs text-gray-400 truncate">LVL</p>
            <div className="bg-[#24E6F3] size-4 rounded-sm flex justify-center items-center">
              <p className="text-gray-600 text-xs font-semibold truncate">{friendInfo.rewardTree?.treeLevel ?? 0}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <p className="text-xs text-gray-400">Bonus</p>
            <p className="text-amber-600 text-xs font-semibold">{formatCompactUser(friendInfo.bonusPoints) ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendInfo;

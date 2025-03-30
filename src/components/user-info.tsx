import { useAppSelector } from "@/stores/store";
import coin from "@/assets/icons/coin.svg"
import { useGetMeQuery } from "@/services/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
type UserInfoType = 'default' | 'other'; 
const UserInfo = ({type="default"}: {type: UserInfoType}) => {
    const { data: userInfo  } = useGetMeQuery(undefined, { refetchOnFocus: true});
    // const userInfo = useAppSelector(state => state.authApi?.queries['getMe({})'] as { data?: { firstName?: string, lastName?: string, avatar?: string } })
    
    const rewardInfo = useAppSelector(state => state.rewardTreeApi?.queries['getRewardTree({})']?.data as { data?: { treeLevel?: number } });
    
    const { firstName, lastName, avatar, pointsBalance } = userInfo?.data || {};
  return (
    <div className='flex flex-row'>
    <div className="relative size-10 rounded-full flex items-center justify-center bg-gradient-to-b from-[#24E6F3] to-[#0F8D98] border-gradient">
      <div className="relative size-8 rounded-full flex items-center justify-center bg-white border-gradient">
      <Avatar>
          <AvatarImage src={avatar} alt={""} />
          <AvatarFallback>
            {firstName && lastName 
              ? `${firstName.charAt(0)}${lastName.charAt(0)}`
              : "JF"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
    <div className='flex ml-2 flex-col justify-between'>
      <p className='text-sm truncate font-semibold'>
        {`${firstName} ${lastName}`.length > 15 ? `${firstName} ${lastName}`.slice(0, 10) + '...' : `${firstName} ${lastName}`}
      </p>

      <div className='flex flex-row justify-start items-start'>
        {type == 'other' && <>
            <img className="size-4" src={coin} alt="" />
            <p className='text-xs text-gray-100 truncate'>{typeof pointsBalance === 'number' ? pointsBalance.toFixed(0) : pointsBalance}</p>
        </>}
        <p className='text-xs text-gray-400 ml-0.5 truncate'>LVL</p>
        <div className='bg-[#24E6F3] size-4 rounded-sm ml-1 flex justify-center items-center'>
          <p className='text-gray-600 text-xs font-semibold truncate'>{rewardInfo?.data?.treeLevel ?? 0}</p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default UserInfo
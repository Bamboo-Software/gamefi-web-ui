import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IWalletContentDialog, SocialContentDialog, WalletContentDialog } from "@/constants/profile";
import { TbPlugConnectedX } from "react-icons/tb";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { useGetMeQuery, useUnsyncSocialMutation } from "@/services/auth";
import LoadingComponent from "@/components/loading-component";
import {
  ProfileContentDialog,
  // WalletContentDialog 
} from "@/constants/profile";
import AirdropDialog from "../airdrop/components/AirdropDialog";
import BadgeModal from "@/components/badge";
import { useAppSelector } from "@/stores/store";
import { IUser } from "@/interfaces/IUser";
import { LoginSocialActionTypeEnum, SocialTypeEnum } from "@/enums/social-type.enum";
import routes from "@/constants/routes";
import { useAuthToken } from "@/hooks/useAuthToken";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/dialog";
import ConnectWallet from "../wallet/components/ConnectWallet";
import ConnectWalletDialog from "../auth/components/ConnectWalletDialog";
import { siteURL } from "@/configs/config";
import { handleError } from "@/utils/apiError";
import Image from "@/components/image";
import wallets_img from "@/assets/images/profile/wallet.svg";
import social_icon from "@/assets/icons/social_icon.png";


interface IConnectedButtonProps {
  walletContent: IWalletContentDialog,
  isConnected: boolean
}

const profileBgColors = [
  "border-2 border-[#24E6F3] bg-gradient-to-t from-[#24E6F3] via-[#05A2C6CC] to-[#54a2c9] bg-white/20 text-gray-50",
  "border-2 border-[#C19EFF] bg-gradient-to-t from-[#AE77F4] via-[#A25BFDCC] to-[#C19EFF] bg-white/20 text-gray-50",
  "border-2 border-[#91E647] bg-gradient-to-t from-[#91E647] via-[#53B815CC] to-[#83E032] bg-white/20 text-gray-50",
  "border-2 border-[#FFEB8C] bg-gradient-to-t from-[#FFEB8C] via-[#DFC33CCC] to-[#FFEA83] bg-white/20 text-gray-50",
];

const ConnectedButton = ({ isConnected }: IConnectedButtonProps) => {
  // const handleClick = () => {
  // const message = isConnected ? walletContent.alert.success : walletContent.alert.failure;
  // toast.info(message);
  // };
  const buttonStyles = isConnected
    ? 'border-green-300 bg-green-600'
    : 'border-red-300 bg-red-600';

  return (
    <button
      className={`${buttonStyles} rounded-full border-1 text-white p-1.5`}
    >
      {isConnected ? <PiPlugsConnectedFill /> : <TbPlugConnectedX />}
    </button>
  );
};
const ProfilePage = () => {
  const { totalCoins, transactions, friends, achivements } = ProfileContentDialog();
  const { google, x, facebook, instagram } = SocialContentDialog();
  const { wallets } = WalletContentDialog()

  const { data, error, isLoading, refetch } = useGetMeQuery({})
  const userInfo = useAppSelector(
    (state) => (state.authApi.queries["getMe({})"] as { data?: { data: IUser } })?.data?.data
  );
  const { token } = useAuthToken();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SocialTypeEnum | null>(null);
  const [unsyncSocial] = useUnsyncSocialMutation();

  const isSocialConnected = (socialType: SocialTypeEnum): boolean => {
    return !!userInfo?.socials?.some((s) => s.socialType === socialType);
  };

  if (isLoading) return <LoadingComponent />;
  if (error) return <p>Error loading user info</p>;
  const { avatar, firstName, lastName, pointsBalance, transactionCount, referralCount, achievementCount } = data.data;
  const profileContents = [
    {
      imgContent: totalCoins.imgContent,
      title: totalCoins.title,
      content: <div className='flex flex-row justify-center items-center text-white font-semibold'>
        {typeof pointsBalance == 'number' ? pointsBalance.toFixed(0) : pointsBalance}
      </div>,
      dialog: <AirdropDialog
        title={totalCoins.dialog.title}
        description={totalCoins.dialog.description} />
    },
    {
      imgContent: transactions.imgContent,
      title: transactions.title,
      content: <div className='flex flex-row justify-center items-center text-white font-semibold'>
        {transactionCount}
      </div>,
      dialog: <AirdropDialog
        title={transactions.dialog.title}
        description={transactions.dialog.description}
      />
    },
    {
      imgContent: friends.imgContent,
      title: friends.title,
      content: <div className='flex flex-row justify-center items-center text-white font-semibold'>
        {referralCount}</div>,
      dialog: <AirdropDialog
        title={friends.dialog.title}
        description={friends.dialog.description}
      />
    },
    {
      imgContent: achivements.imgContent,
      title: achivements.title,
      content: <div className='flex flex-row justify-center items-center text-white font-semibold'>
        {achievementCount}
      </div>,
      dialog: <AirdropDialog
        title={achivements.dialog.title}
        description={achivements.dialog.description}
      />
    },

  ];

  const socialsContents = [
    {
      type: SocialTypeEnum.Google,
      imgContent: google.imgContent,
      title: google.title,
      dialog: (
        <ConnectedButton walletContent={google} isConnected={isSocialConnected(SocialTypeEnum.Google)} />
      ),
      className: "bg-white hover:bg-gray-100 border-gray-300 text-gray-800",
      titleClassName:"text-gray-800 font-semibold text-md"
    },
    {
      type: SocialTypeEnum.X,
      imgContent: x.imgContent,
      title: x.title,
      dialog: (
        <ConnectedButton walletContent={x} isConnected={isSocialConnected(SocialTypeEnum.X)} />
      ),
      className: "bg-black hover:bg-gray-800 border-gray-700",
      titleClassName:"text-gray-50 font-semibold text-md"
    },
    {
      type: SocialTypeEnum.Facebook,
      imgContent: facebook.imgContent,
      title: facebook.title,
      dialog: (
        <ConnectedButton walletContent={facebook} isConnected={isSocialConnected(SocialTypeEnum.Facebook)} />
      ),
      className: "bg-[#0e6edf] hover:bg-[#0e6edf] border-[#0e6edf]",
      titleClassName:"text-gray-50 font-semibold text-md"
    },
    {
      type: SocialTypeEnum.Instagram,
      imgContent: instagram.imgContent,
      title: instagram.title,
      dialog: (
        <ConnectedButton walletContent={instagram} isConnected={isSocialConnected(SocialTypeEnum.Instagram)} />
      ),
      className: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 border-pink-400",
      titleClassName:"text-gray-50 font-semibold text-md"
    },
  ]

  const redirectToSyncSocial = (provider: SocialTypeEnum) => {
    const appUrl = window.location.origin;

    const params = new URLSearchParams({
      state: `${appUrl}${routes.AUTH_CALLBACK}`,
      action: LoginSocialActionTypeEnum.Sync,
      token: token || '',
    });
    window.location.href = `${siteURL}/api/auth/login/${provider}?${params.toString()}`;
  };

  const handleSyncSocial = (provider: SocialTypeEnum) => {
    redirectToSyncSocial(provider)
  }

  const handleUnsyncSocial = async (provider: SocialTypeEnum) => {
    const social = userInfo?.socials?.find((social) => social.socialType === provider);

    if (!social || !social.socialId) {
      toast.error(`No linked ${provider} account found.`);
      return;
    }
    try {

      const response = await unsyncSocial({
        socialType: provider,
        socialId: social.socialId,
      }).unwrap();
      if (response.success) {
        toast.success(`Unsync ${provider} succeeded`);
        refetch();
      }
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const handleConfirmUnsync = () => {
    if (selectedProvider) {
      handleUnsyncSocial(selectedProvider);
    }
    setIsConfirmDialogOpen(false);
  };

  return (
    <motion.div
      className="w-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="px-8">
        <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5">
          Profile
        </p>

        <div className="w-full flex flex-row relative mt-6">
          <div className="w-1/2">
            <div
              className="rounded-t-2xl w-full h-48 bg-cover bg-center bg-no-repeat">
              <div className="flex pt-10 flex-col justify-center items-center text-center px-4">
                <Avatar className="size-24">
                  <AvatarImage src={avatar} alt="Username" />
                  <AvatarFallback className="">
                    {String(firstName).charAt(0) + String(lastName).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 text-xl font-semibold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [-webkit-text-stroke:0.5px_#000]">
                  {firstName + " " + lastName}
                </div>
              </div>
            </div>

            <div className="flex flex-col p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {profileContents.map((profile, index) => (
                  <div
                    key={index}
                    className={`relative min-h-28 p-4 flex flex-col  items-start rounded-xl ${profileBgColors[index]}`}
                  >
                    <div className="flex w-full flex-row h-1/2 justify-between items-center">
                      <p className="font-semibold text-xl">{profile.title}</p>
                      <Image className="size-12 " src={profile.imgContent} alt="" />
                    </div>
                    <p className="text-2xl font-bold">{profile.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <div className="flex flex-col md:flex-col w-full gap-4 p-6">
              <div className="w-full p-4">
                <div className="flex flex-row items-center justify-start">
                  <Image src={social_icon} alt="icon" width={25} height={25 }/>
                  <p className="text-gray-50 font-semibold text-md pl-3">
                  Link to social
                </p>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {socialsContents.map((social, index) => (
                    <BadgeModal
                    
                      key={index}
                      imgContent={social.imgContent}
                      title={social.title}
                      dialog={social.dialog}
                      onClick={() => {
                        if (isSocialConnected(social.type)) {
                          setSelectedProvider(social.type);
                          setIsConfirmDialogOpen(true);
                        } else {
                          handleSyncSocial(social.type);
                        }
                      }}
                      className={`cursor-pointer ${social.className}`}
                      titleClassName={social.titleClassName}
                    />
                  ))}
                </div>
                <ConfirmDialog
                  isOpen={isConfirmDialogOpen}
                  onClose={() => setIsConfirmDialogOpen(false)}
                  onConfirm={handleConfirmUnsync}
                  title="Confirm Unsync"
                  description={`Are you sure you want to unsync your ${selectedProvider} account?`}
                />
              </div>

              {/* Phần Connect to wallets */}
              <div className="w-full p-4">
                <div className="flex flex-row items-center justify-start">
                  <Image src={wallets_img} alt="icon" width={25} height={25 }/>
                  <p className="text-gray-50 font-semibold text-md pl-3">
                  Connect to wallets
                </p>
                </div>
                
                <div className="flex justify-center mt-4">
                  <ConnectWalletDialog
                    trigger={
                      <BadgeModal className={`cursor-pointer bg-[#FFA24B]`} titleClassName={'text-gray-50 font-semibold text-md'} imgContent={wallets.imgContent} title={wallets.title} />
                    }
                  >
                    <ConnectWallet />
                  </ConnectWalletDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfilePage
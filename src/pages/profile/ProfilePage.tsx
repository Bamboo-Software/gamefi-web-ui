import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IWalletContentDialog, SocialContentDialog, WalletContentDialog } from "@/constants/profile";
import { TbPlugConnectedX } from "react-icons/tb";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { useGetMeQuery, useUnsyncSocialMutation } from "@/services/auth";
import LoadingPage from "@/pages/LoadingPage";
import {
  ProfileContentDialog,
  // WalletContentDialog
} from "@/constants/profile";
import AirdropDialog from "../airdrop/components/AirdropDialog";
import BadgeModal from "@/components/badge";
import { IUser } from "@/interfaces/IUser";
import { LoginSocialActionTypeEnum, SocialTypeEnum } from "@/enums/social-type.enum";
import routes from "@/constants/routes";
import { useAuthToken } from "@/hooks/useAuthToken";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ui/dialog";
import ConnectWallet from "../wallet/components/ConnectWallet";
import ConnectWalletDialog from "../auth/components/ConnectWalletDialog";
import { siteURL } from "@/configs/config";
import { handleError } from "@/utils/apiError";
import Image from "@/components/image";
import wallets_img from "@/assets/images/profile/wallet.svg";
import social_icon from "@/assets/icons/social_icon.png";
import { getDisplayName } from "@/utils/user";
import WalletButtons from "./components/WalletDialog";
import { useAuthSocial } from '@/contexts/AuthSocialContext';

interface IConnectedButtonProps {
  walletContent: IWalletContentDialog;
  isConnected: boolean;
}

const profileBgColors = [
  "border-2 border-[#24E6F3] bg-gradient-to-t from-[#24E6F3] via-[#05A2C6CC] to-[#54a2c9] bg-white/20 text-gray-50",
  "border-2 border-[#C19EFF] bg-gradient-to-t from-[#AE77F4] via-[#A25BFDCC] to-[#C19EFF] bg-white/20 text-gray-50",
  "border-2 border-[#91E647] bg-gradient-to-t from-[#91E647] via-[#53B815CC] to-[#83E032] bg-white/20 text-gray-50",
  "border-2 border-[#FFEB8C] bg-gradient-to-t from-[#FFEB8C] via-[#DFC33CCC] to-[#FFEA83] bg-white/20 text-gray-50",
];

const ConnectedButton = ({ isConnected }: IConnectedButtonProps) => {
  const buttonStyles = isConnected 
    ? "border-green-300 bg-green-600 shadow-lg shadow-green-500/50" 
    : "border-red-300 bg-red-600 shadow-lg shadow-red-500/50";

  return (
    <button className={`${buttonStyles} rounded-full border-1 text-white p-1.5 transition-all duration-300 hover:scale-110`}>
      {isConnected ? <PiPlugsConnectedFill className="animate-pulse" /> : <TbPlugConnectedX />}
    </button>
  );
};

const ProfilePage = () => {
  const { totalCoins, transactions, friends, achievements } = ProfileContentDialog();
  const { google, x, facebook, instagram } = SocialContentDialog();
  const { wallets, metamask, phantom } = WalletContentDialog();
  const { data, error, isLoading, refetch } = useGetMeQuery({}, { refetchOnMountOrArgChange: true });
  const userInfo = data?.data as IUser;
  const { token } = useAuthToken();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SocialTypeEnum | null>(null);
  const [unsyncSocial] = useUnsyncSocialMutation();
  const { justAuthenticated, clearJustAuthenticated } = useAuthSocial();

  useEffect(() => {
    if (justAuthenticated) {
      refetch?.();
      clearJustAuthenticated();
    }
  }, [justAuthenticated, refetch, clearJustAuthenticated]);

  const isSocialConnected = (socialType: SocialTypeEnum): boolean => {
    return !!userInfo?.socials?.some((s) => s.socialType === socialType);
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <p>Error loading user info</p>;
  const { avatar, firstName, lastName, pointsBalance, transactionCount, referralCount, achievementCount, socials } =
    data.data;
  const profileContents = [
    {
      imgContent: totalCoins.imgContent,
      title: totalCoins.title,
      content: (
        <div className="flex flex-row justify-center items-center text-white font-semibold">
          {pointsBalance.toLocaleString()}
        </div>
      ),
      dialog: <AirdropDialog title={totalCoins.dialog.title} description={totalCoins.dialog.description} />,
    },
    {
      imgContent: transactions.imgContent,
      title: transactions.title,
      content: (
        <div className="flex flex-row justify-center items-center text-white font-semibold">{transactionCount}</div>
      ),
      dialog: <AirdropDialog title={transactions.dialog.title} description={transactions.dialog.description} />,
    },
    {
      imgContent: achievements.imgContent,
      title: achievements.title,
      content: (
        <div className="flex flex-row justify-center items-center text-white font-semibold">{achievementCount}</div>
      ),
      dialog: <AirdropDialog title={achievements.dialog.title} description={achievements.dialog.description} />,
    },
    {
      imgContent: friends.imgContent,
      title: friends.title,
      content: (
        <div className="flex flex-row justify-center items-center text-white font-semibold">{referralCount}</div>
      ),
      dialog: <AirdropDialog title={friends.dialog.title} description={friends.dialog.description} />,
    },
  ];

  const walletsContents = {
    metamask: {
      type: SocialTypeEnum.Metamask,
      imgContent: metamask.imgContent,
      title: metamask.title,
      isConnected: false,
    },
    phantom: {
      type: SocialTypeEnum.Phantom,
      imgContent: phantom.imgContent,
      title: phantom.title,
      isConnected: false,
    },
  };

  const socialsContents = [
    {
      type: SocialTypeEnum.Google,
      imgContent: google.imgContent,
      title: google.title,
      dialog: <ConnectedButton walletContent={google} isConnected={isSocialConnected(SocialTypeEnum.Google)} />,
      className: "bg-white hover:bg-gray-100 border-gray-300 text-gray-800 transform transition-transform hover:scale-105",
      titleClassName: "text-gray-800 font-semibold text-md",
    },
    {
      type: SocialTypeEnum.X,
      imgContent: x.imgContent,
      title: x.title,
      dialog: <ConnectedButton walletContent={x} isConnected={isSocialConnected(SocialTypeEnum.X)} />,
      className: "bg-black hover:bg-gray-800 border-gray-700 transform transition-transform hover:scale-105",
      titleClassName: "text-gray-50 font-semibold text-md",
    },
    {
      type: SocialTypeEnum.Facebook,
      imgContent: facebook.imgContent,
      title: facebook.title,
      dialog: <ConnectedButton walletContent={facebook} isConnected={isSocialConnected(SocialTypeEnum.Facebook)} />,
      className: "bg-[#0e6edf] hover:bg-[#0e6edf] border-[#0e6edf] transform transition-transform hover:scale-105",
      titleClassName: "text-gray-50 font-semibold text-md",
    },
    {
      type: SocialTypeEnum.Instagram,
      imgContent: instagram.imgContent,
      title: instagram.title,
      dialog: <ConnectedButton walletContent={instagram} isConnected={isSocialConnected(SocialTypeEnum.Instagram)} />,
      className:
        "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 border-pink-400 transform transition-transform hover:scale-105",
      titleClassName: "text-gray-50 font-semibold text-md",
    },
  ];

  const redirectToSyncSocial = (provider: SocialTypeEnum) => {
    const appUrl = window.location.origin;

    const params = new URLSearchParams({
      state: `${appUrl}${routes.AUTH_CALLBACK}`,
      action: LoginSocialActionTypeEnum.Sync,
      token: token || "",
    });
    window.location.href = `${siteURL}/api/auth/login/${provider}?${params.toString()}`;
  };

  const handleSyncSocial = (provider: SocialTypeEnum) => {
    redirectToSyncSocial(provider);
  };

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

  const handleConfirmUnsync = async () => {
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
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-6 relative mt-6">
          {/* Left Column - Profile Info */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl shadow-xl overflow-hidden border border-indigo-500/30">
            <div className="rounded-t-2xl w-full h-48 bg-cover bg-center bg-no-repeat bg-gradient-to-r from-indigo-600/80 to-purple-600/80">
              <div className="flex pt-10 flex-col justify-center items-center text-center px-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Avatar className="size-24 border-4 border-white/30 shadow-lg">
                    <AvatarImage src={avatar} alt="Username" />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                      {String(firstName).charAt(0) + String(lastName).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-3 text-xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  {getDisplayName(data.data)}
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {profileContents.map((profile, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className={`relative min-h-28 p-4 flex flex-col items-start rounded-xl shadow-lg ${profileBgColors[index]} backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex w-full flex-row h-1/2 justify-between items-center">
                      <p className="font-semibold text-xl">{profile.title}</p>
                      <Image className="size-12" src={profile.imgContent} alt="" animationVariant="bounce" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{profile.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Social & Wallets */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-2xl shadow-xl border border-indigo-500/30">
            <div className="flex flex-col w-full gap-6 p-6">
              {/* Social Links Section */}
              <motion.div 
                style={{display: 'none'}}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full p-4 bg-gradient-to-br from-indigo-800/30 to-purple-800/30 rounded-xl border border-indigo-500/20 shadow-md"
              >
                <div className="flex flex-row items-center justify-start mb-4">
                  <div className="bg-indigo-600 p-2 rounded-full">
                    <Image src={social_icon} alt="icon" width={25} height={25} />
                  </div>
                  <p className="text-white font-bold text-lg pl-3">Link to Social</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {socialsContents.map((social, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index + 0.4, duration: 0.3 }}
                    >
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
                        className={`cursor-pointer shadow-md hover:shadow-lg ${social.className}`}
                        titleClassName={social.titleClassName}
                      />
                    </motion.div>
                  ))}
                </div>
                <ConfirmDialog
                  isOpen={isConfirmDialogOpen}
                  onClose={() => setIsConfirmDialogOpen(false)}
                  onConfirm={handleConfirmUnsync}
                  title="Confirm Unsync"
                  description={`Are you sure you want to unsync your ${selectedProvider} account?`}
                />
              </motion.div>

              {/* Wallets Section */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full p-4 grid grid-cols-1 gap-4 bg-gradient-to-br from-indigo-800/30 to-purple-800/30 rounded-xl border border-indigo-500/20 shadow-md"
              >
                <div className="flex flex-row items-center justify-start mb-2">
                  <div className="bg-purple-600 p-2 rounded-full">
                    <Image src={wallets_img} alt="icon" width={25} height={25} />
                  </div>
                  <p className="text-white font-bold text-lg pl-3">Link to Wallets</p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="flex justify-center"
                >
                  <ConnectWalletDialog
                    trigger={
                      <BadgeModal
                        className={`cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transform transition-transform hover:scale-105 shadow-md hover:shadow-lg`}
                        titleClassName={"text-white font-bold text-md"}
                        imgContent={wallets.imgContent}
                        title={`Connect with Wallet Extension`}
                      />
                    }
                  >
                    <ConnectWallet/>
                  </ConnectWalletDialog>
                </motion.div>
                
                <WalletButtons
                  wallets={walletsContents}
                  socials={socials}
                  refetch={refetch}
                  setSelectedProvider={setSelectedProvider}
                  setIsConfirmDialogOpen={setIsConfirmDialogOpen}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
import { motion } from "framer-motion"
import bg_profile from "@/assets/images/profile/bg_profile.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IWalletContentDialog, SocialContentDialog } from "@/constants/profile";
import { TbPlugConnectedX } from "react-icons/tb";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { useGetMeQuery } from "@/services/auth";
import LoadingComponent from "@/components/loading-component";
import { Input } from "@/components/ui/input"
import { ProfileContentDialog, WalletContentDialog } from "@/constants/profile";
import AirdropDialog from "../airdrop/components/AirdropDialog";
import { Button } from "@/components/ui/button";
import BadgeModal from "@/components/badge";

interface IConnectedButtonProps {
  walletContent: IWalletContentDialog,
  isConnected: boolean
}

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
  const { metamask, phantom } = WalletContentDialog();
  const { google, x } = SocialContentDialog();
  const { data, error, isLoading } = useGetMeQuery({})
  const metamaskBool: boolean = true;
  const phantomBool: boolean = false;


  if (isLoading) return <LoadingComponent />;
  if (error) return <p>Error loading user info</p>;
  const { avatar, firstName, lastName, pointsBalance, transactionCount, referralCount, achievementCount } = data.data;
  const profileContents = [
    {
      imgContent: totalCoins.imgContent,
      title: totalCoins.title,
      content: <div className='flex flex-row justify-center items-center text-[#FFC800] font-semibold'>
        <img className='size-6' src={totalCoins.imgContent} />{typeof pointsBalance == 'number' ? pointsBalance.toFixed(3) : pointsBalance}
      </div>,
      dialog: <AirdropDialog
        title={totalCoins.dialog.title}
        description={totalCoins.dialog.description} />
    },
    {
      imgContent: transactions.imgContent,
      title: transactions.title,
      content: <div className='flex flex-row justify-center items-center text-[#FFC800] font-semibold'>
        <img className='size-6' src={transactions.imgContent} />{transactionCount}
      </div>,
      dialog: <AirdropDialog
        title={transactions.dialog.title}
        description={transactions.dialog.description}
      />
    },
    {
      imgContent: friends.imgContent,
      title: friends.title,
      content: <div className='flex flex-row justify-center items-center text-[#FFC800] font-semibold'>
        <img className='size-6' src={friends.imgContent} />{referralCount}</div>,
      dialog: <AirdropDialog
        title={friends.dialog.title}
        description={friends.dialog.description}
      />
    },
    {
      imgContent: achivements.imgContent,
      title: achivements.title,
      content: <div className='flex flex-row justify-center items-center text-[#FFC800] font-semibold'>
        <img className='size-6' src={achivements.imgContent} />{achievementCount}
      </div>,
      dialog: <AirdropDialog
        title={achivements.dialog.title}
        description={achivements.dialog.description}
      />
    },

  ];

  const walletsContents = [
    {
      imgContent: metamask.imgContent,
      title: metamask.title,
      dialog: <AirdropDialog
        icon={<ConnectedButton walletContent={metamask} isConnected={metamaskBool} />}
        title={metamask.title}
        description={
          <div className="flex flex-row justify-between w-full max-w-sm items-center space-x-2 mt-4">
            <Input type="text" placeholder="Wallet Address" />
            <Button type="submit">Save</Button>
          </div>
        }
      />
    },
    {
      imgContent: phantom.imgContent,
      title: phantom.title,
      dialog: <AirdropDialog
        icon={<ConnectedButton walletContent={phantom} isConnected={phantomBool} />}
        title={phantom.title}
        description={
          <div className="flex flex-row justify-between w-full max-w-sm items-center space-x-2 mt-4">
            <Input type="text" placeholder="Wallet Address" />
            <Button type="submit">Save</Button>
          </div>
        }
      />
    }
  ];

  const socialsContents = [
    {
      imgContent: google.imgContent,
      title: google.title,
      dialog: <AirdropDialog
        icon={<ConnectedButton walletContent={google} isConnected={metamaskBool} />}
        title={google.title}
        description={
          <div className="flex flex-row justify-between w-full max-w-sm items-center space-x-2 mt-4">
            <Input type="text" placeholder="Wallet Address" />
            <Button type="submit">Save</Button>
          </div>
        }
      />
    },
    {
      imgContent: x.imgContent,
      title: x.title,
      dialog: <AirdropDialog
        icon={<ConnectedButton walletContent={x} isConnected={metamaskBool} />}
        title={x.title}
        description={
          <div className="flex flex-row justify-between w-full max-w-sm items-center space-x-2 mt-4">
            <Input type="text" placeholder="Wallet Address" />
            <Button type="submit">Save</Button>
          </div>
        }
      />
    },
  ]
  return (
    <motion.div
      className="w-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="px-8">
        <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5">Profile</p>

        <div className="w-full relative mt-6 bg-[#2F3543] rounded-2xl">
          <div
            className="rounded-t-2xl w-full h-48 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bg_profile})` }}
          >
            <div className="flex pt-10 flex-col justify-center items-center text-center px-4">
              <Avatar className="size-24">
                <AvatarImage src={avatar} alt="Username" />
                <AvatarFallback className="">{String(firstName).charAt(0)+String(lastName).charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mt-2 text-xl font-semibold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [-webkit-text-stroke:0.5px_#000]">
                {firstName + " " + lastName }
              </div>
            </div>
          </div>

          <div className="flex flex-col p-6">
            <p className="border-l-4 border-[#E77C1B]  text-gray-50 font-semibold text-md pl-5">Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {profileContents.map((profile, index) => (
                <BadgeModal
                  key={index}
                  imgContent={profile.imgContent}
                  title={profile.title}
                  content={profile.content}
                  dialog={profile.dialog}
                />
              ))}
            </div>

          </div>
          <div className="flex flex-col space-y-4 md:flex-row w-full space-x-4 p-6">
            <div className="flex w-full md:w-1/2 flex-col">
              <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-md pl-5">Connect to wallets</p>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                {walletsContents.map((wallet, index) => (
                  <BadgeModal
                    key={index}
                    imgContent={wallet.imgContent}
                    title={wallet.title}
                    dialog={wallet.dialog}
                  />
                ))}
              </div>
            </div>
            <div className="flex w-full md:w-1/2 flex-col">
              <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-md pl-5">Link to social</p>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                {socialsContents.map((wallet, index) => (
                  <BadgeModal
                    key={index}
                    imgContent={wallet.imgContent}
                    title={wallet.title}
                    dialog={wallet.dialog}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  )
}

export default ProfilePage
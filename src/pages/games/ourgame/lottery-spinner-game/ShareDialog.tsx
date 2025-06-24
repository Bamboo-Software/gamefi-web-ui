import CustomDialog from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";
import solana from "@/assets/images/lottery_game/sol.svg";
// import plus1 from "@/assets/images/lottery_game/plus1.svg";
// import x2 from "@/assets/images/lottery_game/x2.svg";
import usdc from "@/assets/images/lottery_game/usdc.svg";
import usdt from "@/assets/images/lottery_game/usdt.svg";
import bg from "@/assets/images/lottery_game/bg.svg";
import x from "@/assets/images/lottery_game/x.svg";
// import fb from "@/assets/images/lottery_game/fb.svg"
import ins from "@/assets/images/lottery_game/ins.svg";
// import tele from "@/assets/images/lottery_game/tele.svg"
import group_coins from "@/assets/images/lottery_game/group_coins.svg";
import jfox from "@/assets/images/lottery_game/jfox.svg";
import logo from "@/assets/images/lottery_game/logo.svg";
import { Separator } from "@/components/ui/separator";
// import { FaDownload } from "react-icons/fa";
import { useRef, useState } from "react";
import { useUploadFileMutation } from "@/services/upload";
import { IUser } from "@/interfaces/IUser";
import { handleError } from "@/utils/apiError";
import { useSharePrizeOnSocialMutation } from "@/services/lottery";
import { toast } from "sonner";
import { SocialTypeEnum } from "@/enums/user";
import { useNavigate } from "react-router-dom";
import routes from "@/constants/routes";
import { ITransaction } from "@/interfaces/ITransaction";
import { FaDownload } from "react-icons/fa";
import { CryptoCurrencyEnum } from '@/enums/blockchain';

const { PROFILE } = routes;

const ShareDialog = ({
  openShare,
  setOpenShare,
  selectedItem,
  referralCode,
  userInfo,
}: {
  referralCode: string;
  openShare: boolean;
  setOpenShare: (open: boolean) => void;
  selectedItem: ITransaction;
  userInfo?: IUser;
}) => {
  const navigate = useNavigate();
  const shareRef = useRef<HTMLDivElement>(null);
  const [uploadFile] = useUploadFileMutation();
  const [sharePrizeOnSocial] = useSharePrizeOnSocialMutation();
  const [isSharePrizeLoading, setIsSharePrizeLoading] = useState<boolean>(false);
  const [loadingPlatform, setLoadingPlatform] = useState<SocialTypeEnum | null>(null);
  const prizeName =
    (selectedItem.metadata?.prize as { prizeName: string })?.prizeName ||
    selectedItem.lotteryPrize?.prizeName ||
    selectedItem.gameLeaderboardPrize?.prizeName;
  // console.log(prizeName);

  const socialSharePlatforms = [
    { type: SocialTypeEnum.X, icon: x },
    { type: SocialTypeEnum.Instagram, icon: ins },
  ];

  const hasSocialConnection = (socialType: SocialTypeEnum): boolean => {
    if (!userInfo?.socials) return false;
    return userInfo?.socials.some((social) => social.socialType === socialType);
  };

  const hasAnySocialConnection = socialSharePlatforms.some((platform) => hasSocialConnection(platform.type));

  const hasPhantomWallet = (): boolean => {
    if (!userInfo?.socials) return false;
    return userInfo.socials.some((social) => social.socialType === "phantom");
  };

  const createImageFromShareRef = async (): Promise<Blob | null> => {
    if (!shareRef.current) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const rect = shareRef.current.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
    gradient.addColorStop(0, "#1594B8");
    gradient.addColorStop(0.3, "#47C3E6");
    gradient.addColorStop(0.5, "#32BAE0");
    gradient.addColorStop(0.7, "#13A0C8");
    gradient.addColorStop(1, "#24E6F3");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = logo;

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = bg;

    const jfoxImg = new Image();
    jfoxImg.crossOrigin = "anonymous";
    jfoxImg.src = jfox;

    const coinsImg = new Image();
    coinsImg.crossOrigin = "anonymous";
    switch (selectedItem.toCryptoCurrency) {
      case CryptoCurrencyEnum.JFOX:
        coinsImg.src = group_coins;
        break;
      case CryptoCurrencyEnum.SOL:
        coinsImg.src = solana;
        break;
      case CryptoCurrencyEnum.USDT:
        coinsImg.src = usdt;
        break;
      case CryptoCurrencyEnum.USDC:
        coinsImg.src = usdc;
        break;
      default:
        coinsImg.src = group_coins;
        break;
    }

    await Promise.all([
      new Promise((resolve) => {
        logoImg.onload = resolve;
      }),
      new Promise((resolve) => {
        jfoxImg.onload = resolve;
      }),
      new Promise((resolve) => {
        coinsImg.onload = resolve;
      }),
    ]);

    ctx.drawImage(logoImg, rect.width * 0.25 - logoImg.width / 2, rect.height * 0.25 - logoImg.height / 2);
    ctx.font = "8px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Available on Web & Telegram Mini App", rect.width * 0.25, rect.height * 0.4);
    ctx.drawImage(jfoxImg, rect.width * 0.25 - jfoxImg.width / 2, rect.height * 0.7 - jfoxImg.height / 2);
    ctx.drawImage(coinsImg, rect.width * 0.75 - coinsImg.width / 2, rect.height * 0.3 - coinsImg.height / 2);
    ctx.font = "bold 18px Arial";

    switch (selectedItem.toCryptoCurrency) {
      case CryptoCurrencyEnum.JFOX:
        ctx.fillStyle = "#ECCA24";
        break;
      case CryptoCurrencyEnum.SOL:
        ctx.fillStyle = "#7689c9";
        break;
      case CryptoCurrencyEnum.USDT:
        ctx.fillStyle = "#3f8e8d";
        break;
      case CryptoCurrencyEnum.USDC:
        ctx.fillStyle = "#4272c4";
        break;
      default:
        ctx.fillStyle = "#ECCA24";
        break;
    }
    ctx.textAlign = "center";
    ctx.fillText(`${prizeName}`, rect.width * 0.75, rect.height * 0.6);
    ctx.font = "8px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Referral Code", rect.width * 0.75, rect.height * 0.7);
    ctx.font = "bold 16px Arial";
    ctx.fillText(referralCode, rect.width * 0.75, rect.height * 0.8);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 1);
    });
  };

  const onUploadImagePrize = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await uploadFile(formData).unwrap();
      return response.data.url;
    } catch (error: unknown) {
      handleError(error);
      return null;
    }
  };

  const handleSharePrize = async (provider: SocialTypeEnum) => {
    setIsSharePrizeLoading(true);
    setLoadingPlatform(provider);
    try {
      if (isSharePrizeLoading) return;

      const blob = await createImageFromShareRef();
      if (!blob) throw new Error("Failed to create image");

      const file = new File([blob], "lottery_prize.png", { type: "image/png" });

      const imageUrl = await onUploadImagePrize(file);
      if (!imageUrl) throw new Error("Failed to upload image");

      const response = await sharePrizeOnSocial({
        transactionId: selectedItem._id,
        socialType: provider,
        imageUrl,
      }).unwrap();

      if (response.success && response.data) {
        setOpenShare(false);
        setIsSharePrizeLoading(false);
        toast.info(`Sharing prize on ${provider}...`);

        if (!hasPhantomWallet()) {
          setTimeout(() => {
            toast.info("Please connect your Phantom wallet to claim your prize.");
          }, 3000);
        }
      }
    } catch (error: unknown) {
      setIsSharePrizeLoading(false);
      handleError(error);
    } finally {
      setIsSharePrizeLoading(false);
      setLoadingPlatform(null);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await createImageFromShareRef();
      if (!blob) throw new Error("Failed to create image");

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "lottery_prize.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleRewards = (cryptoCurrency: CryptoCurrencyEnum) => {
    switch (cryptoCurrency) {
      case CryptoCurrencyEnum.JFOX:
        return (
          <>
            <img className="size-20" src={group_coins} alt="group_coins" />
            <p className="text-xl text-[#ECCA24] font-bold [text-shadow:_1px_1px_2px_black]">{prizeName}</p>
          </>
        );
      case CryptoCurrencyEnum.SOL:
        return (
          <>
            <img className="size-20" src={solana} alt="solana" />
            <p className="text-xl text-[#7689c9] font-bold [text-shadow:_1px_1px_2px_black]">{prizeName}</p>
          </>
        );
      case CryptoCurrencyEnum.USDT:
        return (
          <>
            <img className="size-20" src={usdt} alt="usdt" />
            <p className="text-xl text-[#3f8e8d] font-bold [text-shadow:_1px_1px_2px_black]">{prizeName}</p>
          </>
        );
      case CryptoCurrencyEnum.USDC:
        return (
          <>
            <img className="size-20" src={usdc} alt="usdc" />
            <p className="text-xl text-[#4272c4] font-bold [text-shadow:_1px_1px_2px_black]">{prizeName}</p>
          </>
        );

      default:
        return (
          <>
            <img className="size-20" src={group_coins} alt="" />
            <p className="text-xl text-[#ECCA24] font-bold [text-shadow:_1px_1px_2px_black]">{prizeName}</p>
          </>
        );
    }
  };

  return (
    <CustomDialog
      className={`border-4 w-full bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 border-[#24E6F3] rounded-xl`}
      open={openShare}
      onClose={() => setOpenShare(false)}
      title="Share to Claim Your Prize!"
      description={
        <div className="text-center text-gray-50 my-3">
          <Separator orientation="horizontal" className="bg-gray-50 opacity-40 my-6" />

          {selectedItem && (
            <div
              id="img_share"
              ref={shareRef}
              className="bg-cover relative flex flex-row w-5/6 mx-auto h-52 border-2 bg-gradient-to-bl from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 border-[#24E6F3] rounded-xl"
            >
              <div className="w-1/2 flex z-10 flex-col justify-center items-center h-full">
                <img src={logo} alt="" />
                <p className="text-[0.4rem]">Available on Web & Telegram Mini App</p>
                <img src={jfox} alt="" />
              </div>
              <div className="w-1/2 flex z-10 flex-col justify-center items-center h-full">
                {handleRewards(selectedItem.toCryptoCurrency as CryptoCurrencyEnum)}
                <div className="flex flex-col justify-center items-center space-x-1">
                  <p className="text-[0.6rem] [text-shadow:_1px_1px_2px_black]">Referral Code</p>
                  <p className="text-[1rem] font-bold [text-shadow:_1px_1px_2px_black]">{referralCode}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      }
      onHandle={
        <div className="flex flex-col w-full items-center justify-between space-y-4">
          <Separator orientation="horizontal" className="bg-gray-50 opacity-40" />
          <p className="font-bold text-lg ">Share on Social</p>
          <p className="text-yellow-400 text-sm text-center flex justify-center items-center leading-relaxed">
            Warning: You need to connect at least one social platform to share.
          </p>
          <div className="flex flex-row w-full justify-evenly items-center">
            {socialSharePlatforms.map((platform) => (
              <div key={platform.type} className="relative">
                <img
                  onClick={() => hasSocialConnection(platform.type) && handleSharePrize(platform.type)}
                  src={platform.icon}
                  alt={platform.type}
                  className={`w-14 h-14 object-contain cursor-pointer ${
                    !hasSocialConnection(platform.type) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                {loadingPlatform === platform.type && isSharePrizeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 rounded-full">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            ))}
            {/* <img src={fb} alt="" />
                        <img src={tele} alt="" /> */}
          </div>
          {!hasAnySocialConnection && (
            <Button
              onClick={() => navigate(PROFILE)}
              className="rounded-full flex flex-row space-x-2 justify-center items-center border-2 my-2 border-[#50D7EE] text-black font-sans w-fit px-6 py-5 bg-gradient-to-tr from-[#9CFF8F] via-[#92FDB9] to-[#83FEE4]"
              variant={"outline"}
            >
              Back to Profile
            </Button>
          )}

          <Button
            onClick={handleDownload}
            className="rounded-full flex flex-row space-x-2 justify-center items-center border-2 my-2 border-[#50D7EE] text-black font-sans w-fit px-6 py-5 bg-gradient-to-tr from-[#9CFF8F] via-[#92FDB9] to-[#83FEE4] cursor-pointer"
            variant={"outline"}
            disabled={/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)}
          >
            <FaDownload /> Download
          </Button>
        </div>
      }
    />
  );
};

export default ShareDialog;

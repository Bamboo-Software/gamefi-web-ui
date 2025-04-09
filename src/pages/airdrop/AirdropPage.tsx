import AirdropBadge from "./components/AirdropBadge";
import { AirdropBadgeProps } from "./components/AirdropBadge";
import income from "@/assets/images/airdrop/income.svg";
import achievementImage from "@/assets/images/airdrop/achivements.svg";
import friends from "@/assets/images/airdrop/friends.svg";
import spinner from "@/assets/images/airdrop/spinner.svg";
import tasks from "@/assets/images/airdrop/tasks.svg";
import CoinFox from "./components/CoinFox";
import { IoHelpCircleSharp } from "react-icons/io5";
import AirdropDialog from "./components/AirdropDialog";
// import { Progress } from "@/components/ui/progress";
import WateringCan from "./components/WateringCan";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGetRewardTreeQuery, useHandleWaterRewardTreeMutation } from "@/services/reward-tree";
import { useHandleTapCoinMutation } from "@/services/airdrop";
import { formatCompactNumber } from "@/utils/formatCompactNumber";
import thunder from "@/assets/images/airdrop/thunder.svg";
import bg_airdrop_header from "@/assets/images/airdrop/bg_airdrop_header.svg";
import bg_airdrop_header1 from "@/assets/images/airdrop/bg_airdrop_header1.svg";
import bg_airdrop_header_l from "@/assets/images/airdrop/bg_airdrop_header_l.svg";
import bg_airdrop_header_r from "@/assets/images/airdrop/bg_airdrop_header_r.svg";
// import bell from "@/assets/images/airdrop/bell.svg";
import UserInfo from "@/components/user-info";
import group_coins from "@/assets/images/airdrop/group_coins.svg";
import { useGetUserAirdropQuery, useGetUserSettingQuery } from "@/services/user";
import LoadingComponent from "@/components/loading-component";
import Image from "@/components/image";
import Trunk from "../games/ourgame/lottery-spinner-game/Trunk";
import { SettingKeyEnum } from "@/enums/setting";
import { SettingValueType } from "@/interfaces/ISetting";
import { useGetMeQuery } from "@/services/auth";

const MAX_WATERING_PER_DAY = 3;
const MAX_TAB_COUNT = 1;
const RESET_AFTER = 3000;

const AirdropPage = () => {
  const [isWatering, setIsWatering] = useState(false);
  const [tapCount, setTapCount] = useState<number>(1);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tapCoins, setTapCoins] = useState(0);
  const { t } = useTranslation();
  const [trunkOpen, setTrunkOpen] = useState(false);
  const { data: userSettings } = useGetUserSettingQuery();
  const getSettingValue = useCallback(
    (key: SettingKeyEnum): SettingValueType => {
      const setting = userSettings?.data.find((item) => item.key === key);
      return setting?.value ?? "";
    },
    [userSettings]
  );

  const [waterTree, { data: levelData }] = useHandleWaterRewardTreeMutation({});
  const [handleTabCoin] = useHandleTapCoinMutation();
  const { data: treeData, refetch: refetchTree } = useGetRewardTreeQuery({});
  const { data: userAirdrop, isLoading: isUserAirdropLoading } = useGetUserAirdropQuery();
  const { achievements, earnTasks, inviteFriends, lotterySpinner, passiveIncome } = userAirdrop?.data || {};
  const { data: userInfo, error: userInfoError } = useGetMeQuery({}, { refetchOnMountOrArgChange: true });

  const { pointsBalance = 0 } = userInfo.data || {};
  const coinsPerTap = getSettingValue(SettingKeyEnum.TAP_POINTS_PER_TAP) as number[];
  const baseCoins = coinsPerTap[treeData?.data?.treeLevel ?? 0];
  const coinTabLevel = userInfo.data.doublePointsActive ? baseCoins * 2 : baseCoins;

  const airdropContents: AirdropBadgeProps[] = [
    {
      title: "Passive Income",
      description: "Complete tasks to earn rewards and tokens",
      imageUrl: income,
      color: "#E77C1B",
      bgColor: "#E77C1B95",
      amount: formatCompactNumber(passiveIncome ?? 0),
    },
    {
      title: "Lottery Spinner",
      description: "Complete tasks to earn rewards and tokens",
      imageUrl: spinner,
      color: "#65DEB8",
      bgColor: "#65DEB895",
      amount: formatCompactNumber(lotterySpinner ?? 0),
    },
    {
      title: "Invite friends",
      description: "Complete tasks to earn rewards and tokens",
      imageUrl: friends,
      color: "#6D89FF",
      bgColor: "#6D89FF95",
      amount: formatCompactNumber(inviteFriends ?? 0),
    },
    {
      title: "Earn tasks",
      description: "Complete tasks to earn rewards and tokens",
      imageUrl: tasks,
      color: "#EB886D",
      bgColor: "#EB886D95",
      amount: formatCompactNumber(earnTasks ?? 0),
    },
    {
      title: "Achievements",
      description: "Complete tasks to earn rewards and tokens",
      imageUrl: achievementImage,
      color: "#5A2DFD",
      bgColor: "#5A2DFD95",
      amount: formatCompactNumber(achievements ?? 0),
    },
  ];

  const foxState = useMemo(() => {
    if (!treeData?.data) {
      return {
        treeLevel: 0,
        experience: 0,
        waterCountToday: 0,
        shakeCountToday: 0,
      };
    }

    return {
      ...treeData.data,
      treeLevel: treeData.data.treeLevel,
      experience: treeData.data.experience,
      waterCountToday: treeData.data.waterCountToday,
      shakeCountToday: treeData.data.shakeCountToday,
    };
  }, [treeData]);

  useEffect(() => {
    setTapCoins(pointsBalance);
    if (levelData?.data) {
      refetchTree();
    }
  }, [levelData, pointsBalance, refetchTree]);

  const progressPercent = useMemo(() => {
    const maxTreeLevel = getSettingValue(SettingKeyEnum.TREE_LEVEL);
    if (typeof maxTreeLevel === "number" && foxState.treeLevel >= maxTreeLevel) {
      return 100;
    }

    const experienceRequirements = getSettingValue(SettingKeyEnum.LEVEL_EXPERIENCE_REQUIREMENTS);
    if (Array.isArray(experienceRequirements)) {
      const requirement = experienceRequirements[foxState.treeLevel];
      return Math.min((foxState.experience / requirement) * 100, 100);
    }

    return 0;
  }, [foxState, getSettingValue]);

  const handleWateringCanClick = useCallback(async () => {
    if (foxState.waterCountToday >= MAX_WATERING_PER_DAY) {
      toast.error("Hekko");
      return;
    }

    try {
      setIsWatering(true);
      // dispatch(playSound(SoundType.EATING_SOUND));

      await waterTree({}).unwrap();
      await refetchTree();

      toast.success(t("airdrop.success.water"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t("airdrop.errors.water_failed", { hours: 4 }));
    } finally {
      setIsWatering(false);
    }
  }, [foxState.waterCountToday, refetchTree, t, waterTree]);

  const handleCoinTreeClick = useCallback(async () => {
    try {
      if (tapCount < MAX_TAB_COUNT) {
        setTapCount((prev) => prev + 1);
      } else {
        setTapCount(MAX_TAB_COUNT);
      }
      handleTabCoin({ tapCount }).unwrap();
      // getUserInfo({}).unwrap();
      setTapCoins(tapCoins + coinTabLevel);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }

      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(1);
      }, RESET_AFTER);
      // toast.success(t('airdrop.success.shake'));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t("airdrop.errors.shake_failed", { hours: 6 }));
    }
  }, [coinTabLevel, handleTabCoin, t, tapCoins, tapCount]);

  if (isUserAirdropLoading) {
    return <LoadingComponent />;
  }

  if (userInfoError) return <p>Error loading user info</p>;
  if (!userInfo || !userInfo.data) return <p></p>;

  return (
    <motion.div
      className="w-full flex flex-col px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full h-full overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-16 h-full">
          {/* Left Section - Fox Game */}
          <div className="w-full lg:w-1/2 mb-6 rounded-2xl overflow-auto">
            <div className="flex flex-col w-full bg-opacity-70 rounded-xl px-4">
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="w-full h-14 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${bg_airdrop_header1})`,
                }}
              >
                <div
                  className="w-full h-15 bg-cover z-10 bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${bg_airdrop_header})`,
                  }}
                >
                  <div className="flex w-full flex-row justify-between items-center px-2">
                    <button
                      className="h-12 flex flex-row rounded-md bg-cover bg-center z-20 bg-no-repeat w-1/4 mt-2"
                      style={{
                        backgroundImage: `url(${bg_airdrop_header_l})`,
                      }}
                    >
                      <div className="flex flex-row items-center justify-center w-full h-full">
                        <Trunk trunkOpen={trunkOpen} setTrunkOpen={setTrunkOpen} />
                      </div>
                    </button>
                    <button>
                      <UserInfo type="default" />
                    </button>
                    <button
                      className="h-12 rounded-md bg-cover bg-center z-20 flex flex-row justify-center items-center bg-no-repeat w-1/4 mt-2"
                      style={{
                        backgroundImage: `url(${bg_airdrop_header_r})`,
                      }}
                    >
                      <div>
                        <div
                          className=" flex w-12 h-10 relative flex-row rounded-md bg-cover bg-center z-20 bg-no-repeat "
                          style={{}}
                        >
                          <div className="translate-x-1/2">
                            <WateringCan onClick={handleWateringCanClick} />
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full ">
                {/* Progress Section */}
                <div className="flex flex-col space-y-2 w-full ">
                  <div className="relative w-full h-2.5 mt-2 bg-[#1D2C42] rounded-full overflow-hidden">
                    {/* Animated gradient progress */}
                    <motion.div
                      className="absolute w-full top-0 left-0 h-full rounded-r-full"
                      style={{
                        background: "repeating-linear-gradient(45deg, #24E5F3 5px, #24E5F390 10px, #24E5F3 20px)",
                      }}
                      animate={{
                        width: `${progressPercent}%`,
                        backgroundPosition: ["0px", "20rem"],
                      }}
                      initial={{ width: "0%" }}
                      transition={{
                        width: { duration: 8, ease: "easeInOut" },
                        backgroundPosition: {
                          duration: 5,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                    />

                    {/* Animated circle indicator */}
                    <motion.div
                      className="absolute top-0 h-full bg-[#1E2C42] rounded-full w-3"
                      animate={{
                        left: `${progressPercent}%`,
                        scale: [1, 1.2, 1],
                      }}
                      initial={{ left: "0%" }}
                      transition={{
                        left: { duration: 0.8, ease: "easeInOut" },
                        scale: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                    />
                  </div>
                  <div className="flex flex-row space-x-2 justify-center items-center">
                    <img src={thunder} alt="" />
                    <p className="text-md font-medium">+{coinTabLevel} / per tap</p>
                    <AirdropDialog
                      title={"How to earn coins?"}
                      icon={<IoHelpCircleSharp className="size-6" />}
                      description={
                        <div className="space-y-6 h-[80vh] overflow-y-auto p-4">
                          <h1 className="text-3xl font-bold text-orange-400 mb-4 text-center">Lottery JFox</h1>
                          <p className="text-gray-300 text-lg mb-6 text-center">
                            Welcome to <span className="font-semibold text-orange-400">Lottery JFox</span>, a fun and
                            rewarding game where your friendly fox companion brings you wealth and joy!
                          </p>
                          <h2 className="text-2xl font-semibold mb-4">How to Play:</h2>
                          <ul className="space-y-4">
                            <li className="flex items-start">
                              <span className="text-orange-400 font-bold mr-2">•</span>
                              <span>
                                <strong>Tap the Fox:</strong> Every time you tap on the fox, you will receive a certain
                                amount of coins as a reward. But there’s a catch! The fox can only give you coins once
                                every <strong>4 hours</strong>, so make sure to come back and collect your fortune.
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-orange-400 font-bold mr-2">•</span>
                              <span>
                                <strong>Feed the Fox:</strong> To help your fox grow stronger and more generous, feed it
                                with fish! Each feeding increases the fox’s level, unlocking greater rewards.
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-orange-400 font-bold mr-2">•</span>
                              <span>
                                <strong>Level Up:</strong> The fox has <strong>6 levels</strong>, and with every new
                                level, the amount of coins you earn will significantly increase.
                              </span>
                            </li>
                          </ul>
                          <h2 className="text-2xl font-semibold mt-6 mb-4">Features:</h2>
                          <ul className="space-y-4">
                            <li className="flex items-start">
                              <span className="text-orange-400 font-bold mr-2">•</span>
                              <span>
                                <strong>Adorable Companion:</strong> Watch your fox become cuter and livelier as it
                                levels up.
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-orange-400 font-bold mr-2">•</span>
                              <span>
                                <strong>Progressive Rewards:</strong> Higher levels mean bigger rewards! Work hard to
                                level up your fox and maximize your earnings.
                              </span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-orange-400 font-bold mr-2">•</span>
                              <span>
                                <strong>Simple Gameplay:</strong> Easy to play and fun for all ages. Just tap, feed, and
                                collect!
                              </span>
                            </li>
                          </ul>
                          <div className="mt-6 text-center">
                            <p className="text-lg font-semibold">
                              Are you ready to take care of your fox and grow your fortune?
                            </p>
                            <p className="text-lg font-semibold text-orange-400">
                              Start playing Lottery JFox now and enjoy the thrill of earning coins while bonding with
                              your virtual pet! 🦊💰
                            </p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                  <div className="flex flex-row space-x-2 justify-center items-center">
                    <Image src={group_coins} className="" alt="" width={40} height={30} />
                    <p className="text-xl font-bold">{tapCoins.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {/* Fox Section */}
              <div className="flex justify-center items-center flex-1 p-4">
                <CoinFox
                  isWatering={isWatering}
                  foxLevel={foxState.treeLevel}
                  onClick={handleCoinTreeClick}
                  coinTabLevel={coinTabLevel}
                  targetId="wallet-icon"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Badges Grid */}
          <div className="w-full lg:w-1/2 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {airdropContents.map((airdrop, index) => (
                <motion.div key={index} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <AirdropBadge
                    title={airdrop.title}
                    description={airdrop.description}
                    imageUrl={airdrop.imageUrl}
                    color={airdrop.color}
                    bgColor={airdrop.bgColor}
                    amount={airdrop.amount}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AirdropPage;

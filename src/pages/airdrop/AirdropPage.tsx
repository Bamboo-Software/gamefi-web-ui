import AirdropBadge from "./components/AirdropBadge"
import { AirdropBadgeProps } from "./components/AirdropBadge";
import income from "@/assets/images/airdrop/income.svg";
import achivements from "@/assets/images/airdrop/achivements.svg";
import friends from "@/assets/images/airdrop/friends.svg";
import spinner from "@/assets/images/airdrop/spinner.svg";
import tasks from "@/assets/images/airdrop/tasks.svg";
import CoinFox from "./components/CoinFox";
import { IoHelpCircleSharp } from 'react-icons/io5';
import AirdropDialog from "./components/AirdropDialog";
import { Progress } from "@/components/ui/progress";
import WateringCan from "./components/WateringCan";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGetRewardTreeQuery, useHandleWaterRewardTreeMutation } from "@/services/reward-tree";
import { useHandleTapCoinMutation } from "@/services/airdrop";


const airdropContents: AirdropBadgeProps[] = [
  {
    title: "Passive Income",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: income,
    color: "#E77C1B",
    bgColor: "#29221C",
  },
  {
    title: "Lottery Spinner",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: spinner,
    color: "#65DEB8",
    bgColor: "#243C48",
  },
  {
    title: "Invite friends",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: friends,
    color: "#6D89FF",
    bgColor: "#2A334A",
  },
  {
    title: "Earn tasks",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: tasks,
    color: "#EB886D",
    bgColor: "#47313D",
  },
  {
    title: "Achivements",
    description: "Complete tasks to earn rewards and tokens",
    imageUrl: achivements,
    color: "#5A2DFD",
    bgColor: "#47313D",
  },
]
const maxTreeLevel = 6;
const levelExpRequirements = [100, 250, 400, 600, 800, 1200];
const MAX_WATERING_PER_DAY = 3;
const MAX_TAB_COUNT = 30;
// const POLLING_INTERVAL = 30000;
const RESET_AFTER = 3000;
const AirdropPage = () => {
  const [isWatering, setIsWatering] = useState(false);
  const [tapCount, setTapCount] = useState<number>(1);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const [waterTree, { data: levelData }] = useHandleWaterRewardTreeMutation({});
  const [handleTabCoin] = useHandleTapCoinMutation()
  const { data: treeData, refetch: refetchTree } = useGetRewardTreeQuery({});

  const foxState = useMemo(() => {
    if (!treeData?.data) {
      return {
        treeLevel: 0,
        experience: 0,
        waterCountToday: 0,
        shakeCountToday: 0
      };
    }

    return {
      ...treeData.data,
      treeLevel: treeData.data.treeLevel,
      experience: treeData.data.experience,
      waterCountToday: treeData.data.waterCountToday,
      shakeCountToday: treeData.data.shakeCountToday
    };
  }, [treeData]);
  useEffect(() => {
    if (levelData?.data) {
        refetchTree();
    }
}, [levelData, refetchTree]);
  const progressPercent = useMemo(() => {
    if (foxState.treeLevel >= maxTreeLevel) return 100;
    const requirement = levelExpRequirements[foxState.treeLevel];
    return Math.min((foxState.experience / requirement) * 100, 100);
  }, [foxState]);

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

      toast.success(t('airdrop.success.water'));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(t('airdrop.errors.water_failed', { hours: 4 }));
    } finally {
      setIsWatering(false);
    }
  }, [foxState.waterCountToday, refetchTree, t, waterTree]);

  const handleCoinTreeClick = useCallback(async () => {
    try {
      // dispatch(playSound(SoundType.COIN_TREE_SOUND));
      if (tapCount < MAX_TAB_COUNT) {
        setTapCount(prev => prev + 1);

      } else {
        setTapCount(MAX_TAB_COUNT)
      }
      handleTabCoin({ tapCount }).unwrap();
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }

      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(1);
      }, RESET_AFTER);
      toast.success(t('airdrop.success.shake'));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Hello");
    }
  }, [handleTabCoin, t, tapCount]);

  return (
    <motion.div
      className="w-full flex flex-col px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full min-h-screen">
        <h1 className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5 mb-6">
          Airdrop
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Fox Game */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col w-full bg-[#2A334A] border border-[#759CFF] bg-opacity-70 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full p-4 space-y-4 sm:space-y-0">
                {/* Progress Section */}
                <div className="flex flex-col space-y-2 w-full sm:w-auto">
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-white">Earn coin daily</h2>
                    <AirdropDialog
                      title="How to earn coins?"
                      icon={<IoHelpCircleSharp className="w-6 h-6" />}
                      description={
                        <div className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
                          {/* Help content */}
                        </div>
                      }
                    />
                  </div>

                  <div className="w-full max-w-md">
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Progress
                          value={progressPercent}
                          max={100}
                          className="h-4 bg-gray-500 rounded-lg overflow-hidden"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black">
                          {Math.floor(progressPercent)}%
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-300 whitespace-nowrap">
                        {foxState.experience} /{" "}
                        {levelExpRequirements[foxState.treeLevel] || "Max"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Watering Can Section */}
                <div className="flex flex-col items-center">
                  <WateringCan onClick={handleWateringCanClick} />
                  <Label className="mt-2">x{(Number(tapCount) / 10).toFixed(1)}</Label>
                </div>
              </div>

              {/* Fox Section */}
              <div className="flex justify-center items-center p-4">
                <CoinFox
                  isWatering={isWatering}
                  foxLevel={foxState.treeLevel}
                  onClick={handleCoinTreeClick}
                />
              </div>
            </div>
          </div>

          {/* Right Section - Badges Grid */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {airdropContents.map((airdrop, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <AirdropBadge
                    title={airdrop.title}
                    description={airdrop.description}
                    imageUrl={airdrop.imageUrl}
                    color={airdrop.color}
                    bgColor={airdrop.bgColor}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>


  )
}

export default AirdropPage
import { motion } from "framer-motion";
import task from '@/assets/icons/task_icon.svg';
import coin from '@/assets/icons/coin.svg';
import MissionDialog from "./components/MissionDialog";
import { Button } from "@/components/ui/button";
import { FaCirclePlay } from "react-icons/fa6";
// import { useTranslation } from 'react-i18next';
import MissionsList from "./missionsList/MissionsList";
// import { useGetMissionsQuery, useStartTaskMutation, useClaimTaskMutation } from "@/services/tasks";
import { MissionTypeEnum } from "@/enums/mission";
import achievement_icon from "@/assets/icons/cup_icon.svg";
import game_icon from "@/assets/icons/game_icon2.svg";
import social_icon from "@/assets/icons/social_icon.svg";
import referral_icon from "@/assets/icons/referral_icon.svg";
import { SocialTaskTypeEnum, MissionStatus } from "@/enums/mission";
import { fb_icon, ig_icon, tele_icon, x_icon, youtube_icon } from "@/assets/icons/socials";
import bg_mission from "@/assets/images/missions/bg_mission.svg"
import { useClaimTaskMutation, useGetMissionsQuery, useStartTaskMutation } from "@/services/tasks";
import LoadingPage from "../LoadingPage";


const statusStyles = {
  [MissionStatus.OPEN]: "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
  [MissionStatus.READY_TO_CLAIM]: "bg-gradient-to-br from-green-500 to-green-700 text-white",
  [MissionStatus.PENDING]: "bg-gradient-to-br from-yellow-500 to-yellow-700 text-white",
  [MissionStatus.COMPLETED]: "bg-gradient-to-br from-gray-500 to-gray-700 text-white",
};

const mapApiStatusToUI = (apiStatus: string) => {
  switch (apiStatus) {
    case 'open': return MissionStatus.OPEN;
    case 'completed': return MissionStatus.COMPLETED;
    case 'pending': return MissionStatus.PENDING;
    case 'ready_to_claim': return MissionStatus.READY_TO_CLAIM;
    default: return MissionStatus.OPEN;
  }
};

const getMissionStatusButton = (missionStatus: MissionStatus, action: () => void) => {
  switch (missionStatus) {
    case MissionStatus.OPEN:
      return <Button onClick={action} className={statusStyles[MissionStatus.OPEN]}>Start</Button>;
    case MissionStatus.COMPLETED:
      return <Button className={statusStyles[MissionStatus.COMPLETED]}>Completed</Button>;
    case MissionStatus.PENDING:
      return <Button className={statusStyles[MissionStatus.PENDING]}>Pending</Button>;
    case MissionStatus.READY_TO_CLAIM:
      return <Button onClick={action} className={statusStyles[MissionStatus.READY_TO_CLAIM]}>Claim</Button>;
    default:
      return <Button disabled className={statusStyles[MissionStatus.OPEN]}>Coming Soon!</Button>;
  }
};

const getMissionButton = (missionStatus: MissionStatus) => {
  switch (missionStatus) {
    case MissionStatus.OPEN:
      return "Start"
    case MissionStatus.COMPLETED:
      return "Completed";
    case MissionStatus.PENDING:
      return "Pending";
    case MissionStatus.READY_TO_CLAIM:
      return "Claim";
    default:
      return "Coming Soon!";
  }
}

const getPlatformIcon = (taskType: string, socialTaskType?: string) => {
  switch (taskType) {
    case MissionTypeEnum.ACHIEVEMENT: return achievement_icon;
    case MissionTypeEnum.GAME: return game_icon;
    case MissionTypeEnum.REFERRAL: return referral_icon;
    case MissionTypeEnum.SOCIAL:
      switch (socialTaskType) {
        case SocialTaskTypeEnum.YOUTUBE_SUBSCRIBE: return youtube_icon;
        case SocialTaskTypeEnum.YOUTUBE_WATCH: return youtube_icon;
        case SocialTaskTypeEnum.TWITTER_FOLLOW: return x_icon;
        case SocialTaskTypeEnum.TWITTER_RETWEET: return x_icon;
        case SocialTaskTypeEnum.FACEBOOK_LIKE: return fb_icon;
        case SocialTaskTypeEnum.FACEBOOK_SHARE: return fb_icon;
        case SocialTaskTypeEnum.INSTAGRAM_FOLLOW: return ig_icon;
        case SocialTaskTypeEnum.INSTAGRAM_LIKE: return ig_icon;
        case SocialTaskTypeEnum.TELEGRAM_JOIN: return tele_icon;
        default: return social_icon;
      }
    case MissionTypeEnum.OTHER: return task;
    default: return task;
  }
};

interface Mission {
  _id: string;
  task: {
    achievementTaskType: string;
    frequency: string;
    type: MissionTypeEnum;
    socialTaskType?: string;
    actionUrl: string;
  };
  title: string;
  pointsReward: number;
  status: string;
  description: string;
}

const MissionsPage = () => {
  const { data, error, isLoading, refetch } = useGetMissionsQuery({ page: 1, limit: 50 });
  const [startTask] = useStartTaskMutation();
  const [claimTask] = useClaimTaskMutation();

  if (isLoading) return <LoadingPage />;
  if (error) return <p>Error loading missions</p>;

  const processMissions = (missions: Mission[]) => {
    return missions.map(mission => {
      const handleAction = () => {
        const status = mapApiStatusToUI(mission.status);
        if (status === MissionStatus.OPEN) {
          startTask({ userTaskId: mission._id })
            .unwrap()
            .then(() => refetch())
            .catch(console.error);
          if (mission.task.type === MissionTypeEnum.SOCIAL) {
            window.open(mission.task.actionUrl, '_blank');
          }
        } else if (status === MissionStatus.READY_TO_CLAIM) {
          claimTask({ userTaskId: mission._id })
            .unwrap()
            .then(() => refetch())
            .catch(console.error);
        }
      };

      return {
        imgContent: getPlatformIcon(mission.task.type, mission.task.socialTaskType),
        title: mission.title,
        content: (
          <div className='flex flex-row justify-center items-center text-[#FFC800] font-semibold'>
            <img className="size-6 mt-1" src={coin} alt="coin" />+{mission.pointsReward}
          </div>
        ),
        dialog: (
          <MissionDialog
            triggerBtn={
              <Button
                className={`rounded-full shadow-xl px-3 ${statusStyles[mapApiStatusToUI(mission.status)]}`}
                size={'sm'}
              >
                <FaCirclePlay />
                {getMissionButton(mapApiStatusToUI(mission.status))}
              </Button>
            }
            dialogIcon={<img className="size-8" src={getPlatformIcon(mission.task.achievementTaskType, mission.task.socialTaskType)} alt="icon" />}
            title={mission.title}
            description={mission.description}
            dialogClassName="max-w-sm p-5 space-y-2 rounded-lg bg-background shadow-lg"
            actionBtn={getMissionStatusButton(mapApiStatusToUI(mission.status), handleAction)}
          />
        )
      };
    });
  };

  return (
    <motion.div
      className="w-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="px-8">
        <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5">Misions</p>

        <div className="w-full relative mt-6 bg-[#2F3543] rounded-2xl">
          <div
            className="rounded-t-2xl w-full h-48 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bg_mission})` }}
          >
            <div className="flex pt-10 flex-col justify-center items-center text-center px-4">
              <p className="text-2xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [-webkit-text-stroke:1px_#000]">
                Missions Daily
              </p>
              <p className="text-white text-xl mt-2 max-w-2xl drop-shadow-[0.5px_2px_1px_rgba(0,0,0,0.8)] [-webkit-text-stroke:0.3px_#000]">
                Take on exciting challenges, complete tasks, and unlock amazing rewards as you progress through your missions.
              </p>
            </div>
          </div>

          <MissionsList
            missions={processMissions(data.data.items || [])}
            frequency="all"
          />
        </div>
      </div>

    </motion.div>
  );
};

export default MissionsPage;
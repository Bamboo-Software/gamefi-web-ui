import { motion } from "framer-motion";
import task from '@/assets/icons/task_icon.svg';
import coin from '@/assets/icons/coin.svg';
import MissionDialog from "./components/MissionDialog";
import { Button } from "@/components/ui/button";
import { FaCirclePlay } from "react-icons/fa6";
// import { useTranslation } from 'react-i18next';
import MissionsList from "./missionsList/MissionsList";
// import { useGetMissionsQuery, useStartTaskMutation, useClaimTaskMutation } from "@/services/tasks";
import { AchievementTaskTypeEnum, MissionTypeEnum, OtherTaskTypeEnum } from "@/enums/mission";
import achievement_icon from "@/assets/icons/cup_icon.svg";
import game_icon from "@/assets/icons/game_icon2.svg";
import social_icon from "@/assets/icons/social_icon.png";
import referral_icon from "@/assets/icons/referral_icon.png";
import { SocialTaskTypeEnum, MissionStatus } from "@/enums/mission";
import  { tiktok_icon, fb_icon, ig_icon, tele_icon, x_icon, youtube_icon } from "@/assets/icons/socials";
import bg_mission from "@/assets/images/missions/bg_missions.png"
import login from "@/assets/images/missions/login.svg";
import { useClaimTaskMutation, useGetMissionsQuery, useStartTaskMutation } from "@/services/tasks";
import LoadingPage from "../LoadingPage";
import Image from "@/components/image";
import { useNavigate } from "react-router-dom";
import routes from "@/constants/routes";
import phantom_icon from "@/assets/icons/phantom.png";


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
    case AchievementTaskTypeEnum.DAILY_LOGIN_STREAK ||
      AchievementTaskTypeEnum.POINT_MILESTONE_100000 ||
      AchievementTaskTypeEnum.POINT_MILESTONE_500000:
      return login;
    case MissionTypeEnum.ACHIEVEMENT:
      return achievement_icon;
    case MissionTypeEnum.GAME:
      return game_icon;
    case MissionTypeEnum.REFERRAL:
      return referral_icon;
    case MissionTypeEnum.SOCIAL:
      switch (socialTaskType) {
        case SocialTaskTypeEnum.YOUTUBE_WATCH:
        case SocialTaskTypeEnum.YOUTUBE_SUBSCRIBE:
          return youtube_icon;
        case SocialTaskTypeEnum.X_FOLLOW:
        case SocialTaskTypeEnum.X_RETWEET:
        case SocialTaskTypeEnum.X_LIKE_COMMENT:
        case SocialTaskTypeEnum.X_SHARE_RETWEET:
          return x_icon;
        case SocialTaskTypeEnum.FACEBOOK_LIKE:
        case SocialTaskTypeEnum.FACEBOOK_SHARE:
          return fb_icon;
        case SocialTaskTypeEnum.INSTAGRAM_FOLLOW:
        case SocialTaskTypeEnum.INSTAGRAM_LIKE:
        case SocialTaskTypeEnum.INSTAGRAM_LIKE_COMMENT:
        case SocialTaskTypeEnum.INSTAGRAM_SHARE:
          return ig_icon;
        case SocialTaskTypeEnum.TELEGRAM_JOIN:
          return tele_icon;
        case SocialTaskTypeEnum.TIKTOK_WATCH:
          return tiktok_icon;
        default:
          return social_icon;
      }
    case MissionTypeEnum.OTHER:
      switch (socialTaskType) {
        case OtherTaskTypeEnum.PHANTOM_CONNECT:
          return phantom_icon;
        default:
          return task;
      }

    default:
      return task;
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
  const navigate = useNavigate();

  if (isLoading) return <LoadingPage />;
  if (error) return <p>Error loading missions</p>;

  const processMissions = (missions: Mission[]) => {
    return missions.map(mission => {
      const handleAction = (mission: Mission) => {
        const status = mapApiStatusToUI(mission.status);
        if (status === MissionStatus.OPEN) {
          startTask({ userTaskId: mission._id })
            .unwrap()
            .then(() => refetch())
            .catch(console.error);
          if (mission.task.type === MissionTypeEnum.SOCIAL) {
            window.open(mission.task.actionUrl, "_blank");
          }
          if (mission.task.type === MissionTypeEnum.REFERRAL) {
            navigate(routes.FRIENDS);
          }
        } else if (status === MissionStatus.READY_TO_CLAIM) {
          claimTask({ userTaskId: mission._id })
            .unwrap()
            .then(() => refetch())
            .catch(console.error);
        } else {
          if (mission.task.type === MissionTypeEnum.SOCIAL) {
            window.open(mission.task.actionUrl, "_blank");
          }
          if (mission.task.type === MissionTypeEnum.REFERRAL) {
            navigate(routes.FRIENDS);
          }
        }
      };

      return {
        imgContent: getPlatformIcon(mission.task.type, mission.task.socialTaskType),
        title: mission.title,
        content: (
          <div className='flex flex-row mt-1 justify-center items-center text-[#FFC800] font-semibold'>
            <img className="size-6" src={coin} alt="coin" />
            <span>+{mission.pointsReward.toLocaleString()}</span>
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
            dialogClassName="max-w-sm p-5 space-y-2 rounded-lg bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 shadow-lg"
            actionBtn={getMissionStatusButton(mapApiStatusToUI(mission.status), () => handleAction(mission))}
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

        <div className="w-full relative mt-6 rounded-2xl">
          <div className="rounded-t-2xl w-full my-10 h-48 bg-cover bg-center bg-no-repeat" >
              <div className="flex  flex-col justify-center items-center text-center px-4">
            <Image src={bg_mission} className="size-32" alt="game_bg" width={270} height={180} loading={'lazy'} />
              <p className="text-2xl mt-4 font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] [-webkit-text-stroke:1px_#000]">
              Missions Daily
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
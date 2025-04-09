import { Badge } from '@/components/ui/badge';
import UserProfile from '@/pages/airdrop/components/UserProfile';
import { IoHelpCircleSharp } from 'react-icons/io5';
import coin from '@/assets/icons/coin.svg';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { Button } from '@/components/ui/button';
import { GiTakeMyMoney } from "react-icons/gi";
import { TbBulbFilled } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import AvatarModal from '@/components/user-avatar';
import rank_icons from '@/assets/icons/lottery_game';
// import thumb_lottery from "@/assets/images/games/thumb_lottery.jpg";
import { useTranslation } from 'react-i18next';
import { faker } from '@faker-js/faker';
import { useGetMeQuery } from '@/services/auth';
import LoadingComponent from '@/components/loading-component';
import { useGetLotteryLeaderboardQuery, useHandleLotterySpinMutation } from '@/services/lottery';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import LotterySpinnerGameTransactions from './LotterySpinnerGameTransactions';
import CustomSpinner from './Wheel';
import wheel from "@/assets/images/lottery_game/wheel.svg";
import UserInfo from '@/components/user-info';
import bg_leader_board from "@/assets/images/airdrop/bg_leaderboad.svg";
import leader_board1 from "@/assets/images/airdrop/leader_board1.svg";
import history from "@/assets/images/games/history.svg";
import Image from '@/components/image';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { getRankDisplay } from '@/components/display-rank';
import { formatCompactUser } from '@/utils/formatCompactNumber';
import { useGetUserSettingQuery } from '@/services/user';
import { SettingKeyEnum } from '@/enums/setting';
import { SettingValueType } from '@/interfaces/ISetting';
import { FaAngleRight } from "react-icons/fa6";
import routes from '@/constants/routes';
import Trunk from './Trunk';
import { TransactionTypeEnum } from '@/enums/transactions';


const { GAMES } = routes;
interface Player {
    points?: number,
    rank?: number,
    user?: {
        avatar?: string,
        firstName?: string,
        lastName?: string,
        username?: string
    }
}

interface FakeData {
    name: string;
    coins: number | string;
}

const LotterySpinnerGame = () => {
    const [open, setOpen] = useState(false);
    const [spinResult, setSpinResult] = useState('');
    const [helpOpen, setHelpOpen] = useState(false);
    const [transactionOpen, setTransactionOpen] = useState(false);
    const [trunkOpen, setTrunkOpen] = useState(false);

    const navigate = useNavigate();
    // const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { data: userSettings } = useGetUserSettingQuery();
    const getSettingValue = useCallback(
        (key: SettingKeyEnum): SettingValueType => {
            const setting = userSettings?.data.find((item) => item.key === key);
            return setting?.value ?? "";
        },
        [userSettings]
    );
    const [names, setNames] = useState<FakeData[]>([]);
    const maxCoinPerSpin = getSettingValue(SettingKeyEnum.LOTTERY_ENTRY_FEE);
    const { data: leaderboardData, isLoading: isLoadingLotteryLeaderboard, error: errorGetLeaderboardData } = useGetLotteryLeaderboardQuery({});
    // const { data: lotteryPoints, isLoading: isLoadingLotteryPoints,  error: errorGetLotteryPoints} = useGetLotteryPointsQuery({});
    const [handleLotterySpin] = useHandleLotterySpinMutation({});
    const topPlayers = leaderboardData?.data?.items || [];
    // const spinnerItemsTemp: number[] = lotteryPoints?.data?.items.map((item: { pointsAwarded: number }) => item.pointsAwarded) || []



    const helpContents = [
        {
            title: t("game.our_game.lottery_game.help.step_1.title"),
            description_1: t("game.our_game.lottery_game.help.step_1.description_1"),
            description_2: t("game.our_game.lottery_game.help.step_1.description_2")
        },
        {
            title: t("game.our_game.lottery_game.help.step_2.title"),
            description_1: t("game.our_game.lottery_game.help.step_2.description_1"),
            description_2: t("game.our_game.lottery_game.help.step_2.description_2")
        },
        {
            title: t("game.our_game.lottery_game.help.step_3.title"),
            description_1: t("game.our_game.lottery_game.help.step_3.description_1"),
            description_2: t("game.our_game.lottery_game.help.step_3.description_2")
        },
        {
            title: t("game.our_game.lottery_game.help.step_4.title"),
            description_1: t("game.our_game.lottery_game.help.step_4.description_1"),
            description_2: t("game.our_game.lottery_game.help.step_4.description_2")
        },
    ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSpinFinish = async (item: any) => {
        try {
            const { data } = await handleLotterySpin({}).unwrap();
            handleRefeshUserInfo()
            if (item) setSpinResult(data?.prizeName || 0);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Something wrong!")
        }
        setOpen(true);
        // dispatch(playSound(SoundType.SUCCESS_SOUND))
    }

    const { data: userInfo, error: userInfoError, isLoading: userInfoLoading, refetch: handleRefeshUserInfo } = useGetMeQuery(undefined, {
        refetchOnFocus: true,
    })

    useEffect(() => {
        handleRefeshUserInfo()
        const fakeData = Array.from({ length: 20 }, () => ({
            name: faker.person.fullName(),
            coins: ["500", "1000", "3000", "5000", "1 USDT", "0.02 SOL"][Math.floor(Math.random() * 5)],
        }));
        setNames(fakeData);
    }, [handleRefeshUserInfo]);

    if (userInfoLoading) return <LoadingComponent />;
    if (userInfoError) return <p>Error loading user info</p>;
    if (!userInfo || !userInfo.data) return <p>No user data available</p>;

    const { pointsBalance } = userInfo.data;

    const handleSpinResult = () => {
        if (pointsBalance < maxCoinPerSpin) {
            toast.error(t("You don't have enough coins to spin!"));
            return;
        }
        // dispatch(playSound(SoundType.SPINNER_SOUND))
    }

    const handleBack = () => {
        navigate('/');
    };

    const items = [
        { id: 1, name: "Golden Key" },

        // Add more items as needed
    ];

    return (
        <div>
            <div className='flex ml-4 flex-row items-center'>
            <Link to={GAMES} className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5">Games</Link>
            <FaAngleRight className='mx-5'/>
            <Link to={GAMES} className=" text-gray-50 font-semibold text-xl">Lottery Spinner</Link>
            </div>
            <div className="w-full flex flex-col items-center justify-center mt-2 px-2">
                <motion.p
                    className="text-2xl w-full font-semibold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                </motion.p>
                <div className='w-full flex flex-col lg:flex-row lg:space-x-12 space-y-8 lg:space-y-0'>
                    <div className="w-full lg:w-1/2 mt-6 overflow-auto space-y-3 px-2">
                        <div className="flex flex-row justify-between items-end">
                            <div
                                className="w-2/3 pl-4 flex justify-start items-center mt-2 h-20 rounded-lg bg-cover bg-center bg-no-repeat"
                                style={{ backgroundImage: `url(${bg_leader_board})` }}
                            >
                                <UserInfo type="other" />
                            </div>
                            <button
                                onClick={() => setTransactionOpen(true)}
                                className="w-1/4 mt-2 h-20 relative flex flex-col justify-center items-center rounded-lg bg-cover bg-center bg-no-repeat cursor-pointer"
                                style={{ backgroundImage: `url(${leader_board1})` }}
                            >
                                <Image className="absolute -top-0" width={45} height={40} src={history} alt="leader board" />
                                <p className="text-sm font-medium mt-1"> {t("game.our_game.lottery_game.history.title")}</p>
                            </button>
                        </div>
                        <motion.div
                            className="flex flex-col w-full mt-4 h-auto items-center justify-between p-3 sm:p-2  bg-opacity-70 rounded-xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex flex-row items-center justify-between w-full">
                                
                                <motion.div onClick={() => setHelpOpen(true)} className="cursor-pointer">
                                    <IoHelpCircleSharp size={28} className="" />
                                </motion.div>
                                <Badge className="bg-[#21BBD880] text-gray-100flex items-center gap-1 text-xs sm:text-sm">
                                    <img src={coin} alt="coin" className="size-4 sm:size-5" /> -{maxCoinPerSpin.toLocaleString()}
                                </Badge>
                                <motion.div className="cursor-pointer">
                                <Trunk trunkOpen={trunkOpen} setTrunkOpen={setTrunkOpen} type={TransactionTypeEnum.SPINNER_REWARD} />
                                </motion.div>
                                
                            </div>
                            <div className="overflow-hidden mt-2 h-10 sm:h-12 w-full relative border-none bg-gradient-to-r from-[#21BBD833] via-[#21BBD880] to-[#21BBD833] rounded-lg">
                                <motion.div
                                    className="flex items-center"
                                    animate={{ x: ['100%', '-100%'] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 70,
                                        ease: 'linear',
                                    }}
                                    style={{ whiteSpace: 'nowrap', display: 'inline-flex' }}
                                >
                                    {names.map((item, index) => (
                                        <p
                                            key={index}
                                            className="text-sm sm:text-md pt-3 font-medium text-center flex-shrink-0"
                                            style={{ minWidth: '200px', marginRight: '16px' }}
                                        >
                                            🎉 {item.name} won {item.coins} coins!
                                        </p>
                                    ))}
                                </motion.div>
                            </div>
                            {pointsBalance < maxCoinPerSpin ? (
                                <motion.div
                                    className="flex flex-col items-center justify-center p-4 sm:p-6 m-2 bg-red-500/10 rounded-lg max-w-md w-full"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                >
                                    <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 mb-3 sm:mb-4" />
                                    <h2 className="text-lg sm:text-xl font-bold text-center mb-2">Insufficient Balance</h2>
                                    <p className="text-sm sm:text-base text-gray-400 text-center mb-4">
                                        You need {maxCoinPerSpin.toLocaleString()} coins to spin the wheel.
                                        Current balance: {pointsBalance} coins
                                    </p>
                                    <Button
                                        variant="secondary"
                                        className="w-full max-w-xs bg-[#8633DF] text-sm sm:text-base"
                                        onClick={handleBack}
                                    >
                                        Return to Home
                                    </Button>
                                </motion.div>
                            ) : (
                                <div className="relative inline-block w-full justify-center">
                                    <CustomSpinner
                                        items={items}
                                        spinnerImage={wheel}
                                        size={window.innerWidth < 640 ? 250 : 350}
                                        spinTime={3500}
                                        onResult={handleSpinResult}
                                        onFinishSpin={handleSpinFinish}
                                        onReset={() => { }}
                                        spinButtonText="Spin Now"
                                        resetButtonText="Reset Spinner"
                                        className="bg-transparent w-full pt-3 rounded-xl shadow-lg"
                                        buttonClassName="hover:brightness-110 transition-all text-sm sm:text-base"
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>
                    <div className="w-full lg:w-1/2 mt-0 lg:mt-6 overflow-auto space-y-3 px-2">
                        <div className='flex flex-row justify-center items-center space-x-2'>
                            <img src={rank_icons.rank_icon} alt='Rank Icon' className="size-6 sm:size-8" />
                            <p className='text-base sm:text-lg font-semibold my-4 sm:my-8'>{t("game.our_game.lottery_game.top_player", { players: 10 })}</p>
                        </div>

                        {isLoadingLotteryLeaderboard && (
                            <div className='w-full my-2'>
                                <UserProfile
                                    avatar={<AvatarModal isUserAvatar={true} userName="Loading..." userImage={coin} />}
                                    title={<p className='font-semibold'>Loading...</p>}
                                    content={<p className='text-gray-400 text-sm'>Loading...</p>}
                                    subContent={<div className='flex text-[#FFC800] font-semibold'><img className='size-5 sm:size-6' src={coin} alt="Coin" />0</div>} />
                            </div>
                        )}
                        {errorGetLeaderboardData && (<p className='font-semibold'>Error loading leaderboard</p>)}
                        {!isLoadingLotteryLeaderboard && !errorGetLeaderboardData && topPlayers.map((topPlayer: Player, index: number) => (
                            <div key={index} className='w-full my-2'>
                                <UserProfile
                                    avatar={
                                        <Avatar>
                                            <AvatarImage src={topPlayer?.user?.avatar} alt={""} />
                                            <AvatarFallback>
                                                {topPlayer?.user?.firstName && topPlayer?.user?.lastName
                                                    ? `${topPlayer?.user?.firstName.charAt(0)}${topPlayer?.user?.lastName.charAt(0)}`
                                                    : "JF"}
                                            </AvatarFallback>
                                        </Avatar>
                                    }
                                    title={<p className='font-semibold text-sm sm:text-base'>{topPlayer.user?.firstName + " " + topPlayer.user?.lastName}</p>}
                                    // content={<p className='text-gray-100 text-xs sm:text-sm'>JFOX coins</p>}
                                    subContent={<div className='flex flex-row items-center mt-1'><img className='size-5 sm:size-6' src={coin} alt="Coin" /><span className='text-sm font-semibold'>{formatCompactUser(topPlayer?.points || 0)}</span></div>}
                                    handleBtn={getRankDisplay(index + 1, "mr-3")}
                                    className='border-t-2  bottom-0 border-[#24E6F3] bg-gradient-to-t from-[#24E6F3] via-[#05A2C6CC] to-[#54a2c9] bg-white/50 text-gray-50 text-lg' />
                            </div>
                        ))}

                    </div>
                </div>

                <CustomDialog
                    className={`border-4 bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 border-[#24E6F3] sm:w-4/5 ${pointsBalance < maxCoinPerSpin ? "border-red" : "border-[#02B232]"}  rounded-xl`}
                    open={open}
                    onClose={setOpen}
                    title={
                        <p className='inline-block my-2 text-base sm:text-lg'> {t("game.our_game.lottery_game.dialog.title")}!</p>
                    }
                    description={
                        <div className="text-center text-sm sm:text-base text-gray-100">
                            {t("game.our_game.lottery_game.dialog.description")}: <span className="font-bold">{spinResult || 0}</span>
                        </div>
                    }
                    onHandle={
                        <Button className={`bg-[#02B232] text-white flex items-center text-xs sm:text-sm`} onClick={() => setOpen(false)}>
                            <GiTakeMyMoney className="mr-1" />{t("game.our_game.lottery_game.dialog.claim_btn")}
                        </Button>
                    }
                />

                <CustomDialog
                    className="border-4 w-11/12 sm:w-4/5 max-h-[80vh] overflow-y-auto bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 border-[#24E6F3] rounded-xl"
                    open={helpOpen}
                    onClose={setHelpOpen}
                    title={<span className="text-base sm:text-lg">{t("game.our_game.lottery_game.help.title")}</span>}
                    description={
                        <div className="space-y-2 *:text-left text-xs sm:text-sm">
                            {helpContents.map((helpContent, index) => (
                                <div key={index} className='text-gray-100'>
                                    <p className="font-semibold">{helpContent.title}:</p>
                                    <ul className="pl-4 list-disc">
                                        <li>{helpContent.description_1}</li>
                                        <li>{helpContent.description_2}</li>
                                    </ul>
                                </div>
                            ))}

                            <p className="text-center font-semibold mt-2 text-gray-100">
                                {t("game.our_game.lottery_game.help.good_luck")} 🎉
                            </p>
                        </div>
                    }
                    onHandle={
                        <Button className="bg-[#1594B8] text-white flex items-center gap-2 text-xs sm:text-sm" onClick={() => setHelpOpen(false)}>
                            <TbBulbFilled />
                            {t("game.our_game.lottery_game.help.got_it")}
                        </Button>
                    }
                />

                <CustomDialog
                    className={`border-4 h-[60%] bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 border-[#24E6F3] sm:w-4/5  rounded-xl`}
                    open={transactionOpen}
                    onClose={setTransactionOpen}
                    title={
                        <p className=''></p>
                    }
                    description={
                        <div className="text-center text-sm sm:text-base h-[60%] text-gray-100 overflow-scroll">
                            <LotterySpinnerGameTransactions />
                        </div>
                    }
                    onHandle={
                        <Button className={`bg-[#1594B8] text-white flex items-center text-xs sm:text-sm`} onClick={() => setTransactionOpen(false)}>
                            Close
                        </Button>
                    }
                />
            </div>
        </div>

    );
};

export default LotterySpinnerGame;

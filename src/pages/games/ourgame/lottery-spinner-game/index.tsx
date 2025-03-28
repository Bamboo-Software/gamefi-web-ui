import { Badge } from '@/components/ui/badge';
import UserProfile from '@/pages/airdrop/components/UserProfile';
import { GiSpellBook } from 'react-icons/gi';
import { IoHelpCircleSharp } from 'react-icons/io5';
import coin from '@/assets/icons/coin.svg';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CustomDialog from '@/components/custom-dialog';
import { Button } from '@/components/ui/button';
import { GiTakeMyMoney } from "react-icons/gi";
import { TbBulbFilled } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import AvatarModal from '@/components/user-avatar';
import rank_icons from '@/assets/icons/lottery_game';
import thumb_lottery from "@/assets/images/games/thumb_lottery.jpg";
import { useTranslation } from 'react-i18next';
import { faker } from '@faker-js/faker';
import { useGetMeQuery } from '@/services/auth';
import LoadingComponent from '@/components/loading-component';
import { useGetLotteryLeaderboardQuery, useHandleLotterySpinMutation } from '@/services/lottery';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
// import LotterySpinnerGameTransactions from './LotterySpinnerGameTransactions';
import { maxCoinPerSpin } from '@/configs/config';
import CustomSpinner from './Wheel';
import wheel from "@/assets/images/lottery_game/wheel.svg";


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
    coins: number;
}

const rankIconsArray = Object.values(rank_icons);

const LotterySpinnerGame = () => {
    const [open, setOpen] = useState(false);
    const [spinResult, setSpinResult] = useState('');
    const [helpOpen, setHelpOpen] = useState(false);
    const [transactionOpen, setTransactionOpen] = useState(false);
    const navigate = useNavigate();
    // const dispatch = useAppDispatch();
    const { t } = useTranslation();
console.log(transactionOpen);


    const [names, setNames] = useState<FakeData[]>([]);

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
            coins: [10, 20, 30, 40, 50][Math.floor(Math.random() * 5)],
        }));
        setNames(fakeData);
    }, [handleRefeshUserInfo]);

    if (userInfoLoading) return <LoadingComponent />;
    if (userInfoError) return <p>Error loading user info</p>;
    if (!userInfo || !userInfo.data) return <p>No user data available</p>;

    const { name, avatar, pointsBalance } = userInfo.data;

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
        <div className="w-full flex flex-col items-center justify-center mt-2 px-2">
        <motion.p
            className="text-2xl w-full font-semibold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="rounded-t-2xl w-full h-36 sm:h-48 flex justify-center items-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${thumb_lottery})` }}
            >
                <p className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [-webkit-text-stroke:1px_#000]">
                    Lottery Spinner Game
                </p>
            </div>
        </motion.p>
        <div className='w-full flex flex-col lg:flex-row lg:space-x-12 space-y-8 lg:space-y-0'>
            <div className="w-full lg:w-1/2 mt-6 overflow-auto space-y-3 px-2">
                <UserProfile
                    avatar={<AvatarModal isUserAvatar={true} userName={name} userImage={avatar} />}
                    title={<p className='font-semibold'>{name}</p>}
                    content={<p className='text-gray-400 text-sm'>JFOX coins</p>}
                    subContent={<div className='flex text-[#FFC800] font-semibold'><img src={coin} alt="Coin" />{pointsBalance}</div>} />
                <motion.div
                    className="flex flex-col w-full mt-4 h-auto items-center justify-between p-3 sm:p-4 bg-[#252525] bg-opacity-70 rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-row items-center justify-between w-full">
                        <motion.div
                            onClick={() => setTransactionOpen(true)}
                            className="cursor-pointer"
                        >
                            <GiSpellBook size={28} className="sm:size-35" />
                        </motion.div>

                        <Badge className="bg-[#8633DF] text-[#E3D000] flex items-center gap-1 text-xs sm:text-sm">
                            <img src={coin} alt="coin" className="size-4 sm:size-5" /> -{maxCoinPerSpin}
                        </Badge>

                        <motion.div onClick={() => setHelpOpen(true)} className="cursor-pointer">
                            <IoHelpCircleSharp size={28} className="sm:size-35" />
                        </motion.div>
                    </div>
                    <div className="overflow-hidden mt-2 h-10 sm:h-12 w-full relative border rounded-lg">
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
                                    className="text-sm sm:text-md pt-2 font-medium text-center flex-shrink-0"
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
                                You need {maxCoinPerSpin} coins to spin the wheel.
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
                        <div className="relative inline-block w-full flex justify-center">
                            <CustomSpinner
                                items={items}
                                spinnerImage={wheel}
                                size={window.innerWidth < 640 ? 250 : 300}
                                spinTime={3500}
                                onResult={handleSpinResult}
                                onFinishSpin={handleSpinFinish}
                                onReset={() => { }}
                                spinButtonText="Spin Now"
                                resetButtonText="Reset Spinner"
                                className="bg-transparent w-full pt-3 rounded-xl shadow-lg"
                                buttonClassName="hover:brightness-110 transition-all text-sm sm:text-base"
                            />
                            <div className="w-28 sm:w-36 h-3 sm:h-4 bg-gray-200 rounded-full mx-auto mt-2"></div>
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
                            avatar={<AvatarModal isUserAvatar={true} userName="Loading..." userImage={topPlayer?.user?.avatar || coin} />}
                            title={<p className='font-semibold text-sm sm:text-base'>{topPlayer.user?.firstName + " " + topPlayer.user?.lastName}</p>}
                            content={<p className='text-gray-400 text-xs sm:text-sm'>JFOX coins</p>}
                            subContent={<div className='flex text-[#FFC800] font-semibold'><img className='size-5 sm:size-6' src={coin} alt="Coin" />{topPlayer?.points}</div>}
                            handleBtn={<img className='size-8 sm:size-10 mr-2' src={`${rankIconsArray[index]}`} />} />
                    </div>
                ))}
            </div>
        </div>

        <CustomDialog
            className={`border-4 w-11/12 sm:w-4/5 ${pointsBalance < maxCoinPerSpin ? "border-red" : "border-[#02B232]"}  rounded-xl`}
            open={open}
            onClose={setOpen}
            title={
                <p className='inline-block my-2 text-base sm:text-lg'> {t("game.our_game.lottery_game.dialog.title")}!</p>
            }
            description={
                <div className="text-center text-sm sm:text-base">
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
            className="border-4 w-11/12 sm:w-4/5 max-h-[80vh] overflow-y-auto border-[#AB62FA] rounded-xl"
            open={helpOpen}
            onClose={setHelpOpen}
            title={<span className="text-base sm:text-lg">{t("game.our_game.lottery_game.help.title")}</span>}
            description={
                <div className="space-y-2 *:text-left text-xs sm:text-sm">
                    {helpContents.map((helpContent, index) => (
                        <div key={index}>
                            <p className="font-semibold">{helpContent.title}:</p>
                            <ul className="pl-4 list-disc">
                                <li>{helpContent.description_1}</li>
                                <li>{helpContent.description_2}</li>
                            </ul>
                        </div>
                    ))}

                    <p className="text-center font-semibold mt-2">
                        {t("game.our_game.lottery_game.help.good_luck")} 🎉
                    </p>
                </div>
            }
            onHandle={
                <Button className="bg-[#AB62FA] text-white flex items-center gap-2 text-xs sm:text-sm" onClick={() => setHelpOpen(false)}>
                    <TbBulbFilled />
                    {t("game.our_game.lottery_game.help.got_it")}
                </Button>
            }
        />
    </div>
    );
};

export default LotterySpinnerGame;

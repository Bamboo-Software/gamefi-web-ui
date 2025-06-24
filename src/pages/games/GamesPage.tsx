/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion"
import bg_games from "@/assets/images/games/bg-games.png"
import Image from "@/components/image";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import routesPath from "@/constants/routes";
import jupiter_fox from "@/assets/images/games/minesweeper.svg";
import wheel from "@/assets/images/games/spinner.svg";
import starship from "@/assets/images/games/starship.png";
import sudoku from "@/assets/images/games/sudoku.svg";
import { IoIosTimer } from "react-icons/io";
import { FaGamepad } from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa";
import GameDialog from "./components/GameDialog";
import LeaderboardDialog from "./ourgame/leaderboard";
import { useGetGameListQuery, useGetGamesPeriodQuery, usePlayGameMutation } from "@/services/game";
import { SettingKeyEnum } from "@/enums/setting";
import { useGetUserSettingQuery } from "@/services/user";
import { SettingValueType } from "@/interfaces/ISetting";
import { useNavigate } from "react-router-dom";
import { handleError } from "@/utils/apiError";
import coin from "@/assets/icons/coin.png";
import CountdownTimer from "@/components/countdown";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingPage from "../LoadingPage";

enum GameEnum {
  LOTTERY_SPINNER = "Lottery Spinner",
  FLAPPY_JFOX = "Flappy JFOX",
  MINESWEEPER = "Minesweeper",
  SUDOKU = "Sudoku",
}

const {
  GAMES_LOTTERY_SPINNER,
  GAMES_FLAPPY_JFOX,
  GAMES_MINESWEEPER,
  // GAMES_SUDOKU
} = routesPath;

const GamesPage = () => {
  const {t} = useTranslation(); 
  const navigate = useNavigate();
  const { data: userSettings } = useGetUserSettingQuery();
  const getSettingValue = useCallback(
    (key: SettingKeyEnum): SettingValueType => {
      const setting = userSettings?.data.find((item) => item.key === key);
      return setting?.value ?? "";
    },
    [userSettings]
  );
  const lotteryPointRequired = getSettingValue(SettingKeyEnum.LOTTERY_ENTRY_FEE).toLocaleString();
  const anotherGamePointRequired = getSettingValue(SettingKeyEnum.PLAY_GAME_ENTRY_FEE).toLocaleString();

  const { data, isLoading, isError } = useGetGameListQuery();
  const { data: allGamesPeriod } = useGetGamesPeriodQuery();
  const [playGame] = usePlayGameMutation();
  if (isLoading) return <LoadingPage />;
  if (isError) return <div>Error getting game</div>;

  const awardsTable = (prizes: any) => {
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex items-center justify-center gap-2 mb-3">
          <FaTrophy className="text-yellow-400 text-xl animate-pulse" />
          <p className="text-xl text-white font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">Awards Season</p>
        </div>
        <div className="max-h-[30vh] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-indigo-100 rounded-lg border border-indigo-300/30">
          <Table className="text-white">
            <TableHeader className="sticky top-0">
              <TableRow className="border-b border-indigo-300/30 sticky top-0">
                <TableHead className="text-white text-center bg-gradient-to-r from-indigo-600/90 to-purple-600/90 z-10 font-bold">Rank</TableHead>
                <TableHead className="text-white text-center bg-gradient-to-r from-indigo-600/90 to-purple-600/90 z-10 font-bold">Prize Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prizes?.map((prize: any, index: number) => (
                <TableRow 
                  key={prize.id} 
                  className={`border-b border-indigo-300/30 hover:bg-indigo-500/20 transition-colors ${index % 2 === 0 ? 'bg-indigo-800/10' : 'bg-indigo-900/10'}`}
                >
                  <TableCell className="font-medium">
                    {prize.minRank == prize.maxRank ? 
                      (<span className="font-bold text-amber-400">#{prize.minRank}</span>) : 
                      (<span><span className="font-bold text-amber-400">#{prize.minRank}</span> - <span className="font-bold text-amber-400">#{prize.maxRank}</span></span>)}
                  </TableCell>
                  <TableCell>{prize.prizeName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  const baseGames = [
    {
      img: wheel,
      gameId: data?.data?.[0]?.id,
      title: GameEnum.LOTTERY_SPINNER,
      color: "#6366f1", // indigo-500
      handle: async (id: string) => {
        toast.success(`You have joined the game! Note: A Lottery spin ticket costs ${lotteryPointRequired} points.`);
        navigate(`${GAMES_LOTTERY_SPINNER}?id=${id}`);
      },
      spent: lotteryPointRequired,
      intro: `Take a spin and test your luck with the Lottery Spinner Wheel! Each spin costs ${lotteryPointRequired} coins, offering you the chance to win incredible prizes. With a total reward pool of up to $500, the stakes have never been higher. Will fortune smile upon you? Spin now and find out!`,
      active: true,
    },
    {
      img: starship,
      gameId: data?.data?.[1]?.id,
      title: GameEnum.FLAPPY_JFOX,
      color: "#8b5cf6", // violet-500
      handle: async (id: string) => {
        const success = await handlePlayGame(id);
        if (success) {
          navigate(`${GAMES_FLAPPY_JFOX}?id=${id}`);
        }
      },
      spent: anotherGamePointRequired,
      intro: `Test your skills in the iconic Flappy JFOX! Each attempt costs ${anotherGamePointRequired} coins, giving you the chance to soar to the top of the leaderboard. Compete fiercely and aim for greatness! At the end of the season, the best players will win exclusive rewards, with a prize pool totaling $500. Are you ready to flap your way to victory?`,
      active: true,
      prizeTable: awardsTable(data?.data?.[1]?.prizes)
    },
    {
      img: jupiter_fox,
      gameId: data?.data?.[2]?.id,
      title: GameEnum.MINESWEEPER,
      color: "#ec4899", // pink-500
      handle: async (id: string) => {
        const success = await handlePlayGame(id);
        if (success) {
          navigate(`${GAMES_MINESWEEPER}?id=${id}`);
        }
      },
      spent: anotherGamePointRequired,
      intro: `Dive into the classic Minesweeper and outsmart the grid! Each game requires ${anotherGamePointRequired} coins to play, challenging your strategy and precision. Climb the rankings to secure your place among the elite. At season's end, top performers will share incredible prizes, with the total rewards reaching $500. Think you've got what it takes? Start sweeping now!`,
      active: true,
      prizeTable: awardsTable(data?.data?.[2]?.prizes)
    },
    {
      img: sudoku,
      gameId: data?.data?.[3]?.id,
      title: GameEnum.SUDOKU,
      color: "#f59e0b", // amber-500
      handle: (id?: string) => {
        console.log(id);
        toast.warning("Coming Soon");
      },
      spent: anotherGamePointRequired,
      active: false,
      prizeTable: awardsTable(data?.data?.[3]?.prizes)
    },
  ];

  const games: any[] = baseGames.map((game) => {
    const matchingPeriod = allGamesPeriod?.data.find((periodGame) => periodGame._id === game.gameId);

    return {
      ...game,
      period: matchingPeriod?.period,
      startDate: matchingPeriod?.startDate,
      endDate: matchingPeriod?.endDate,
    };
  });

  const handlePlayGame = async (gameId: string) => {
    try {
      const response = await playGame({ gameId }).unwrap();
      if (response.success) {
        const pointRequired = getSettingValue(SettingKeyEnum.PLAY_GAME_ENTRY_FEE);
        toast.success(`You have joined the game! ${pointRequired.toLocaleString()} points deducted.`);
        return true;
      }
      return false;
    } catch (error: any) {
      if (error?.data?.message === "Insufficient points to play game") {
        toast.error("You don't have enough points to play this game!");
        return false;
      } else {
        handleError(error);
        return false;
      }
    }
  };
  
  return (
    <motion.div
      className="w-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="px-8">
        {/* Header Section */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <h1 className="text-2xl font-bold text-white">Games</h1>
        </div>
        
        {/* Hero Section */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 z-10"></div>
          <div className="absolute inset-0 bg-[url('@/assets/images/games/bg-games.png')] bg-cover bg-center opacity-40"></div>
          
          <div className="relative z-20 py-16 px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-white mb-4"
              >
                Explore Exciting Games
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-100 mb-6"
              >
                Play, compete, and win amazing rewards in our collection of engaging games.
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/3 flex justify-center"
            >
              <Image 
                src={bg_games} 
                className="w-64 h-64 object-contain" 
                alt="game_bg" 
                animationVariant="bounce" 
              />
            </motion.div>
          </div>
        </div>
        
        {/* Games Grid */}
        <div className="w-full relative rounded-2xl gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-center items-stretch">
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <motion.div
                className={`relative rounded-xl overflow-hidden h-full bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-${game.color}/30 shadow-lg hover:shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                initial={{
                  boxShadow: `0 0 10px ${game.color}40, 0 0 10px ${game.color}40`,
                }}
                animate={{
                  boxShadow: [
                    `0 0 5px ${game.color}40, 0 0 10px ${game.color}40`,
                    `0 0 15px ${game.color}40, 0 0 20px ${game.color}40`,
                    `0 0 5px ${game.color}40, 0 0 10px ${game.color}40`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {/* Game Header */}
                <div className={`p-4 bg-gradient-to-r from-${game.color}/80 to-${game.color}/60`}>
                  <h3 className="text-xl font-bold text-white">{game.title}</h3>
                </div>
                
                {/* Game Content */}
                <div className="p-5 flex flex-col md:flex-row gap-4 items-center">
                  <div className="md:w-1/3 flex justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-${game.color}/10 to-transparent rounded-full blur-xl"></div>
                    <Image 
                      className="w-24 h-24 object-contain relative z-10" 
                      src={game.img} 
                      alt={game.title} 
                      animationVariant="bounce" 
                    />
                  </div>
                  
                  <div className="md:w-2/3 flex flex-col space-y-4">
                    <div className="relative">
                      <p className="text-gray-200 text-sm leading-relaxed line-clamp-2 italic">
                        {game.intro?.substring(0, 100)}...
                        <span className="text-${game.color} font-semibold ml-1 hover:underline cursor-pointer">Xem thêm</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="px-3 py-1.5 flex items-center space-x-1 rounded-full bg-gradient-to-r from-indigo-600/80 to-purple-600/80 shadow-md border border-indigo-400/30 backdrop-blur-sm"
                        >
                          <span className="text-xs font-medium text-white">{game.spent}</span>
                          <Image src={coin} height={16} width={16} loading={"lazy"} alt="coin" className="animate-pulse" />
                        </div>
                        
                        {game.endDate && new Date(game.endDate) > new Date() && (
                          <div className="px-3 py-1.5 text-xs text-gray-300 flex items-center space-x-1 rounded-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 shadow-md border border-gray-600/30">
                            <span className="text-amber-400 mr-1">Kết thúc:</span>
                            <CountdownTimer endDate={game.endDate} />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      {game.active === true ? (
                        <>
                          {game.title !== GameEnum.LOTTERY_SPINNER && (
                            <LeaderboardDialog 
                              id={game.gameId || ""} 
                              title={`${game.title} Leaderboard`} 
                              endDate={game.endDate} 
                            />
                          )}
                          
                          <GameDialog
                            title={<p className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{game.title}</p>}
                            dialogClassName={`border-2 border-${game.color} w-[90%] bg-gradient-to-b from-indigo-900/95 via-indigo-800/95 to-purple-900/95 rounded-xl shadow-2xl backdrop-blur-sm`}
                            description={
                              <div className="w-full text-center">
                                <article className="text-justify mb-5 text-gray-100 leading-relaxed">
                                  {game?.intro}
                                </article>
                                <div className="my-4">
                                  {game?.prizeTable}
                                </div>
                                <div className="flex flex-row justify-center items-center space-x-2 mt-6">
                                  {game.title !== GameEnum.LOTTERY_SPINNER && (
                                    <LeaderboardDialog id={game.gameId || ""} title={`${game.title} Leaderboard`} endDate={game.endDate} />
                                  )}
                                  <Button
                                    onClick={() => {
                                      game.handle?.(game.gameId ?? "");
                                    }}
                                    className={`rounded-full text-sm font-bold border-2 border-${game.color} text-white w-fit py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-${game.color}/20`}
                                    variant={"outline"}
                                    animation="bounce"
                                  >
                                    {t("game.our_game.play_btn")}
                                    <FaGamepad className="ml-2 text-${game.color}" />
                                  </Button>
                                </div>
                              </div>
                            }
                            triggerBtn={
                              <Button
                                className={`rounded-full text-sm font-bold border-2 border-${game.color} text-white w-fit bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-${game.color}/20`}
                                variant={"outline"}
                                animation="bounce"
                              >
                                {t("game.our_game.play_btn")}
                                <FaGamepad className="ml-2 text-${game.color}" />
                              </Button>
                            }
                          />
                        </>
                      ) : (
                        <Button
                          onClick={() => game.handle?.(game.gameId ?? "")}
                          className="rounded-full text-sm font-bold border-2 border-amber-500 text-white w-fit py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-500/20"
                          variant={"outline"}
                          animation="bounce"
                        >
                          {t("game.our_game.coming_soon_btn")}
                          <IoIosTimer className="ml-2 text-amber-300" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default GamesPage
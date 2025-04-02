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
import bg_badge from "@/assets/images/games/bg-badge.png";import { IoIosTimer } from "react-icons/io";
import { FaGamepad } from "react-icons/fa6";
import GameDialog from "./components/GameDialog";
import LeaderboardDialog from "./ourgame/leaderboard";
import LoadingComponent from "@/components/loading-component";
import { useGetGameListQuery, useGetGamesPeriodQuery, usePlayGameMutation } from "@/services/game";
import { SettingKeyEnum } from "@/enums/setting";
import { useGetUserSettingQuery } from "@/services/user";
import { SettingValueType } from "@/interfaces/ISetting";
import { useNavigate } from "react-router-dom";
import { handleError } from "@/utils/apiError";
import coin from "@/assets/icons/coin.png";
import CountdownTimer from "@/components/countdown";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface IGame {
  img: string;
  gameId?: string;
  title: string;
  color: string;
  handle?: (id: string) => void;
  intro?: string;
  active: boolean;
  spent: string;
  period?: string;
  startDate?: Date;
  endDate?: Date;
  prizeTable?: React.ReactNode; 
  prizes?: {id: string, minRank: number, maxRank: number, prizeName: string}[];
}

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
  if (isLoading) return <LoadingComponent />;
  if (isError) return <div>Error getting game</div>;
  // const handleExplore = () => {
  //   toast.error(t('game.alerts.coming_soon_alert'));
  // }

  const awardsTable = (prizes: any) => {
    return (
      <div className="flex flex-col justify-center items-center w-full">
        <p className="text-xl my-2 text-gray-100 font-semibold">Awards Season</p>
        <div className="max-h-[30vh] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <Table className="text-gray-100">
            <TableHeader className="sticky top-0">
              <TableRow className="border border-gray-100 sticky top-0">
                <TableHead className="text-gray-100 text-center bg-[#1594B8]/95 z-10 font-semibold">Rank</TableHead>
                <TableHead className="text-gray-100 text-center bg-[#1594B8]/95 z-10 font-semibold">Prize Name</TableHead>
                {/* <TableHead className="text-gray-100">Note</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody className="border border-gray-100">
              {prizes?.map((prize: any) => (
                <TableRow key={prize.id} className="border border-gray-100">
                  <TableCell>{prize.minRank == prize.maxRank ? (`#${prize.minRank}`) : (`#${prize.minRank} - #${prize.maxRank}`)}</TableCell>
                  <TableCell>{prize.prizeName}</TableCell>
                  {/* <TableCell>{user.email}</TableCell> */}
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
      color: "#05A2C6",
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
      color: "#05A2C6",
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
      color: "#05A2C6",
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
      color: "#05A2C6",
      handle: (id?: string) => {
        // navigate(`${GAMES_MINESWEEPER}?id=${id}`);
        console.log(id);
        toast.warning("Coming Soon");
      },
      spent: anotherGamePointRequired,
      active: false,
      prizeTable: awardsTable(data?.data?.[3]?.prizes)
    },
  ];

  const games: IGame[] = baseGames.map((game) => {
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
        // Show success message with the correct points based on game type
        // const gameInfo = games.find((game) => game.gameId === gameId);
        // const pointsDeducted = gameInfo?.spent || 2000;
        const pointRequired = getSettingValue(SettingKeyEnum.PLAY_GAME_ENTRY_FEE);
        toast.success(`You have joined the game! ${pointRequired.toLocaleString()} points deducted.`);
        return true;
      }
      return false;
    } catch (error: any) {
      // Check for the specific error message about insufficient points
      if (error?.data?.message === "Insufficient points to play game") {
        toast.error("You don't have enough points to play this game!");
        return false;
      } else {
        // Handle other errors
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
        <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5">Games</p>
        <div
            className="rounded-t-2xl w-full h-12 bg-cover bg-center bg-no-repeat"
          >
            <div className="flex  flex-col justify-center items-center text-center px-4">
            <Image src={bg_games} className="size-32" alt="game_bg" width={270} height={180} loading={'lazy'} />
              <p className="text-2xl font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)] [-webkit-text-stroke:1px_#000]">
                Explore Exciting Games
              </p>
            </div>
          </div>
        <div className="w-full relative mt-52 rounded-2xl gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
          {games.map((game, index) => (
          <motion.div
            key={index}
            className={`relative px-1 rounded-xl flex flex-row justify-between items-center h-28 bg-[#05A2C6CC] border-1 border-[#24E6F399] `}
            initial={{
              boxShadow: `0 0 10px ${game.color}, 0 0 10px ${game.color}, 0 0 40px ${game.color}`,
            }}
            animate={{
              boxShadow: [
                `0 0 5px ${game.color}, 0 0 10px ${game.color}`,
                `0 0 15px ${game.color}, 0 0 30px ${game.color}`,
                `0 0 5px ${game.color}, 0 0 10px ${game.color}`,
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="w-1/4">
              <Image className="w-20" src={game.img} alt="" animationVariant="bounce" />
            </div>
            <div className="flex w-3/4 flex-row justify-between items-center px-2">
              <div className="text-white py-1 rounded-md max-w-[60%] flex flex-col space-y-2">
                <p className={`font-semibold truncate ${game.active === true ? "text-md" : ""}`}>{game.title}</p>
                <div className="flex flex-row">
                  <div
                    className="w-fit px-2 h-5 flex justify-center space-x-0.5 items-center rounded-xl bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${bg_badge})` }}
                  >
                    <span className="text-xs">-{game.spent}</span>
                    <Image src={coin} height={16} width={16} loading={"lazy"} alt="coin" />
                  </div>
                </div>
              </div>
              {game.active === true ? (
                <div className="flex flex-col items-end">
                  <GameDialog
                    title={<p className="text-xl">{game.title}</p>}
                    dialogClassName={`border-4 w-[90%] bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 rounded-xl`}
                    description={
                      <div className="w-full text-center">
                        <article className="text-justify mb-5 text-gray-100">{game?.intro}</article>
                        <div className="my-4">
                        {game?.prizeTable}
                        </div>
                        <div className="flex flex-row justify-center items-center space-x-2">
                          {game.title !== GameEnum.LOTTERY_SPINNER && (
                            <LeaderboardDialog id={game.gameId || ""} title={`${game.title} Leaderboard`} endDate={game.endDate} />
                          )}
                          <Button
                            onClick={() => {
                              game.handle?.(game.gameId ?? "");
                            }}
                            className="rounded-full text-xs  border-2 border-[#50D7EE] text-black font-sans w-fit py-5 bg-gradient-to-tr from-[#9CFF8F] via-[#92FDB9] to-[#83FEE4]"
                            variant={"outline"}
                            animation="bounce"
                          >
                            {t("game.our_game.play_btn")}
                            <FaGamepad />
                          </Button>
                        </div>
                      </div>
                    }
                    triggerBtn={
                      <Button
                        className="rounded-full right-0 text-xs  border-2 my-2 border-[#50D7EE] text-black font-sans w-fit bg-gradient-to-tr from-[#9CFF8F] via-[#92FDB9] to-[#83FEE4]"
                        variant={"outline"}
                        animation="bounce"
                      >
                        {t("game.our_game.play_btn")}
                        <FaGamepad />
                      </Button>
                    }
                  />
                  <div className="absolute -bottom-4 right-3">
                  {game.endDate && new Date(game.endDate) > new Date() && <CountdownTimer endDate={game.endDate} />}
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => game.handle?.(game.gameId ?? "")}
                  className="rounded-full text-xs space-y-1 border-2 my-2 border-[#50D7EE] text-black font-sans w-fit py-5 bg-gradient-to-tr from-[#9CFF8F] via-[#92FDB9] to-[#83FEE4]"
                  variant={"outline"}
                  animation="bounce"
                >
                  {t("game.our_game.coming_soon_btn")}
                  <IoIosTimer />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        

        </div>

      </div>

    </motion.div>
  )
}

export default GamesPage
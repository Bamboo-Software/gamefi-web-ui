import thumb_flappy from "@/assets/images/games/thumb_flappy.jpg";
import thumb_coin_clicker from "@/assets/images/games/thumb_coin_clicker.jpg";
import thumb_lottery from "@/assets/images/games/thumb_lottery.jpg";
import { Button } from "@/components/ui/button";
import { FaGamepad } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import routesPath from '@/constants/routes';

const { GAMES_LOTTERY_SPINNER, GAMES_FLAPPY_JFOX } = routesPath;

interface IGame {
  img: string;
  title: string;
  color: string;
  route?: string;
  active: boolean;
}

const OurGames = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const games: IGame[] = [
    {
      img: thumb_lottery,
      title: "Lottery Spinner Game",
      color: "#E3D000",
      route: GAMES_LOTTERY_SPINNER,
      active: true
    },
    {
      img: thumb_flappy,
      title: "Flappy JFOX",
      color: "#d75b35",
      route: GAMES_FLAPPY_JFOX,
      active: true
    },
    {
      img: thumb_coin_clicker,
      title: "Coin Clicker",
      color: "#008D26",
      active: false
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center mt-8 px-2">
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        {games.map((game, index) => (
          <motion.div
            key={index}
            className="relative rounded-xl overflow-hidden aspect-[7/3]"
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
            <img
              src={game.img}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => console.error(`Errors: ${game.img}`)}
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="absolute top-2 left-2 z-10 bg-opacity-70 text-white px-2 py-1 rounded-md">
              <p className="font-semibold text-xl">{game.title}</p>
            </div>

            {game.active ? (
              <Button
                className="absolute bottom-2 right-2 flex items-center gap-2 px-4 py-2 font-semibold text-md rounded-md text-white shadow-xl z-10 transition-transform duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(90deg, ${game.color} 100%, ${game.color}90 90%)`,
                }}
                onClick={() => game.route && navigate(game.route)}
              >
                {t("game.our_game.play_btn")}
                <FaGamepad />
              </Button>
            ) : (
              <Button
                size={"tiny"}
                className="absolute bottom-1 right-1 flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white rounded-md shadow-lg hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5 transition-transform duration-300"
                style={{
                  background: `linear-gradient(90deg, ${game.color} 100%, ${game.color}90 90%)`,
                }}
                onClick={() => toast.warning("Coming Soon")}
              >
                {t("game.our_game.coming_soon_btn")}
                <IoIosTimer />
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OurGames;
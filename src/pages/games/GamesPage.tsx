import { motion } from "framer-motion"
import bg_game from "@/assets/images/games/bg_game.svg";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MdOutlineTravelExplore } from "react-icons/md";
import OurGames from "./ourgame";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import OtherGames from "./other-games/OtherGames";
const GamesPage = () => {

  const [selectedTab, setSelectedTab] = useState("our_games");
  const {t} = useTranslation(); 

  const handleExplore = () => {
    toast.error(t('game.alerts.coming_soon_alert'));
  }
  return (
    <motion.div
      className="w-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="px-8">
        <p className="border-l-4 border-[#E77C1B] text-gray-50 font-semibold text-xl pl-5">Games</p>

        <div className="w-full relative mt-6 bg-[#2F3543] rounded-2xl flex flex-col justify-center items-center">
          <div
            className="rounded-t-2xl w-full h-48 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bg_game})` }}
          >
            <div className="flex pt-10 flex-col justify-center items-center text-center px-4">
              <p className="text-2xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] [-webkit-text-stroke:1px_#000]">
                Explore Exciting Games
              </p>
              <p className="text-white text-xl mt-2 max-w-2xl drop-shadow-[0.5px_2px_1px_rgba(0,0,0,0.8)] [-webkit-text-stroke:0.3px_#000]">
                Dive into a world of fun and rewards! Play engaging games, earn coins, and enjoy endless entertainment.              </p>
            </div>
          </div>

          <Tabs defaultValue="our_games" value={selectedTab} onValueChange={setSelectedTab} className="w-full flex flex-col items-center justify-center mt-2">
            <TabsList className="flex bg-gray-700  flex-row w-[50%] h-auto items-center rounded-lg justify-between border-2 border-gray-600 my-4">
              <TabsTrigger
                className={`w-full p-1 text-sm font-medium  ${selectedTab === "our_games"
                    ? " text-white"
                    : "text-gray-300 "
                  }`}
                value="our_games"
              >
                Our Games
              </TabsTrigger>
              <TabsTrigger
                className={`w-full  p-1 text-sm font-medium ${selectedTab === "other_games"
                    ? " text-white"
                    : "text-gray-300"
                  }`}
                value="other_games"
              >
                Other Games
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="our_games">
            <OurGames/>
            </TabsContent>
            <TabsContent className="w-full" value="other_games">
              <OtherGames/>
            </TabsContent>
          </Tabs>
          <Button onClick={handleExplore} className="w-56 my-10 rounded-md font-md text-white bg-gradient-to-r from-[#FFA600] to-[#CD8808]">
          {t('game.explore_btn')}
        <MdOutlineTravelExplore />
      </Button>
        </div>

      </div>

    </motion.div>
  )
}

export default GamesPage
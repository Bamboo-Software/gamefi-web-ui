import { useTranslation } from "react-i18next";

const OtherGames = () => {
  const {t} = useTranslation(); 
  
  return (
    <div className="w-full flex flex-col mt-4 text-2xl font-semibold items-center justify-center">
        {t("game.other_game.content")}!
    </div>
  )
}

export default OtherGames
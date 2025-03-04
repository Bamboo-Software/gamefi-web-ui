import { useState } from "react";

import { useLocalStorage } from "react-use";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PageEnum } from "@/enums/page";
import avatars from "@/assets/icons/avatars";
import achivements from "@/assets/icons/achivements";
import { SliderPicker   } from 'react-color';
import { useTranslation } from "react-i18next";

interface UserAvatarProps {
  isUserAvatar: boolean;
  userName: string;
  userImage: string;
  className?: string;
  page?: PageEnum;
  onBadgeChange?: (newBadge: string) => void;
}

const UserAvatar = ({ isUserAvatar, page, userName, userImage, className, onBadgeChange }: UserAvatarProps) => {
  const [selectedAvatar, setSelectedAvatar] = useLocalStorage("selectedAvatar", avatars[0]);
  const [selectedColor, setSelectedColor] = useLocalStorage("selectedColor", "#AB62FA");

  const { t } = useTranslation();
  const canOpenDialog = page === PageEnum.AIRDROP || page === PageEnum.PROFILE;
  const [value] = useLocalStorage('selectedArchivement', 'foo');

  const [selectedArchivement, setSelectedArchivement] = useState(value);

  const handleArchivementClick = (archivement: string) => {
    setSelectedArchivement(archivement);
    if (onBadgeChange) onBadgeChange(archivement); 
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          className={`relative inline-block rounded-full cursor-pointer `}
          initial={{
            boxShadow: `0 0 25px ${selectedColor}, 0 0 25px ${selectedColor}, 0 0 40px ${selectedColor}`,
          }}
          animate={{
            boxShadow: [
              `0 0 15px ${selectedColor}, 0 0 20px ${selectedColor}`,
              `0 0 25px ${selectedColor}, 0 0 40px ${selectedColor}`,
              `0 0 15px ${selectedColor}, 0 0 20px ${selectedColor}`,
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          onClick={(e) => {
            if (!canOpenDialog) e.stopPropagation();
          }}
        >
          <Avatar className={`${className ? className : "size-14"} border-2`}>
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{userName}</AvatarFallback>
          </Avatar>
          {isUserAvatar && (
            <img
              className="absolute top-0 left-0 scale-150"
              src={selectedAvatar}
              alt=""
            />
          )}
        </motion.div>
      </DialogTrigger>
      {canOpenDialog && (
        <DialogContent className="overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("airdrop.avatar.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 gap-y-10 mt-10">
            {/* Avatar Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("airdrop.avatar.choose_avatar")}</h3>
              <div className="flex gap-4 gap-y-4 flex-wrap justify-center">
                {avatars.map((avatar, index) => (
                  <Button
                    variant={"outline"}
                    key={index}
                    className={`p-1 rounded-full border-4 h-24 w-24 ${
                      selectedAvatar === avatar ? "border-gray-200" : "border-transparent"
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <img
                      src={avatar}
                      alt="avatar option"
                      className="size-20 rounded-full"
                    />
                  </Button>
                ))}
              </div>
            </div>
            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("airdrop.avatar.choose_frame")}</h3>
              <SliderPicker  
                
                color={selectedColor}
                onChangeComplete={(color: { hex: string }) => setSelectedColor(color.hex)}
              />
            </div>
            {/* Archivement Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("airdrop.avatar.choose_archivement")}</h3>
              <div className="flex gap-4 gap-y-4 flex-wrap justify-center">
                {achivements.map((archivement, index) => (
                  <Button
                    variant="outline"
                    key={index}
                    className={`size-16 p-1 rounded-full ${
                      selectedArchivement === archivement
                        ? "bg-gray-200 text-black"
                        : "bg-transparent"
                    }`}
                    onClick={() => handleArchivementClick(archivement)}
                  >
                    <img
                      src={archivement}
                      alt="archivement option"
                      className="w-full h-full"
                    />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default UserAvatar;
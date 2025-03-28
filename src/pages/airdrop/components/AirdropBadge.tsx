import income from "@/assets/images/airdrop/income.svg";
import coin from "@/assets/icons/coin.svg";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface AirdropBadgeProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  color?: string;
  bgColor?: string;
  amount?: number | string; 
}

const AirdropBadge = ({
  title = "Earn Income",
  description = "Complete tasks to earn rewards and tokens",
  imageUrl = income,
  color = "#E77C1B",
  bgColor = "#29221C",
  amount = 0
}: AirdropBadgeProps) => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgb = hexToRgb(color);
  const shadowColor = rgb ? `${rgb.r} ${rgb.g} ${rgb.b}` : "231 124 27"; 

  const imageVariants = {
    initial: { filter: `drop-shadow(0 0 5px rgb(${shadowColor} / 0.5))` },
    hover: {
      filter: `drop-shadow(0 0 15px rgb(${shadowColor} / 0.8))`,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
<motion.div
  className={cn(
    `overflow-hidden  rounded-2xl relative shadow-lg border-2 border-solid`
  )}
  style={{ borderColor: color, backgroundColor: bgColor }}
  variants={imageVariants}
  initial="initial"
  whileHover="hover">
        <motion.img
          src={imageUrl}
          alt={title}
          className="size-full object-contain"
          initial="initial"
        />

      <CardContent className="p-4">
        <div className="flex flex-row justify-between items-center mb-2 text-[#FFC800] font-semibold">
            <h3 className="text-lg text-gray-50">{title}</h3>
            <div className="flex flex-row justify-between items-center space-x-0.5">
                <p className="font-bold">{amount}</p>
                <img className="size-6" src={coin} alt="Coin" />
            </div>
        </div>
        <p className="text-sm text-gray-100">{description}</p>
      </CardContent>
    </motion.div>
  );
};

export default AirdropBadge;
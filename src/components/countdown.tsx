import { useState, useEffect } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  endDate: Date;
}

const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div
      className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#FF6B6B]/80 via-[#4ECDC4]/80 to-[#45B7D1]/80 shadow-md"
      style={{ border: "1px solid #50D7EE" }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{ color: ["#FF6B6B", "#4ECDC4", "#45B7D1"] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <span className="text-xs text-white leading-tight min-w-[1rem] text-center">{days < 10 ? `0${days}` : days}</span>
        <span className="text-[10px] text-white leading-tight">D</span>
        <VisuallyHidden.Root>
          <span>Days remaining</span>
        </VisuallyHidden.Root>
      </motion.div>
      <span className="text-white font-bold text-xs">:</span>
      <motion.div
        className="flex flex-col items-center"
        animate={{ color: ["#FF6B6B", "#4ECDC4", "#45B7D1"] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <span className="text-xs text-white leading-tight min-w-[1rem] text-center">{hours < 10 ? `0${hours}` : hours}</span>
        <span className="text-[10px] text-white leading-tight">H</span>
        <VisuallyHidden.Root>
          <span>Hours remaining</span>
        </VisuallyHidden.Root>
      </motion.div>
      <span className="text-white font-bold text-xs">:</span>
      <motion.div
        className="flex flex-col items-center"
        animate={{ color: ["#FF6B6B", "#4ECDC4", "#45B7D1"] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <span className="text-xs text-white leading-tight min-w-[1rem] text-center">{minutes < 10 ? `0${minutes}` : minutes}</span>
        <span className="text-[10px] text-white leading-tight">M</span>
        <VisuallyHidden.Root>
          <span>Minutes remaining</span>
        </VisuallyHidden.Root>
      </motion.div>
      <span className="text-white font-bold text-xs">:</span>
      <motion.div
        className="flex flex-col items-center"
        animate={{ color: ["#FF6B6B", "#4ECDC4", "#45B7D1"] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <span className="text-xs text-white leading-tight min-w-[1rem] text-center">{seconds < 10 ? `0${seconds}` : seconds}</span>
        <span className="text-[10px] text-white leading-tight">S</span>
        <VisuallyHidden.Root>
          <span>Seconds remaining</span>
        </VisuallyHidden.Root>
      </motion.div>
    </div>
  );
};

export default CountdownTimer;
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import coin from '@/assets/icons/coin.svg';
import jupiter_fox from '@/assets/images/airdrop/jupiter.svg';
import salmon from '@/assets/icons/salmon.svg';

interface CoinPosition {
  id: number;
  x: number;
  y: number;
}

interface CoinFoxProps {
  isWatering: boolean;
  foxLevel: number;
  onClick?: () => void;
}

const getRandomPosition = () => ({
  x: Math.random() * window.innerWidth * 0.8 ,
  y: Math.random() * window.innerHeight * 0.3 + 100,
});

const CoinFox: React.FC<CoinFoxProps> = ({ isWatering, foxLevel, onClick }) => {
  const [coins, setCoins] = useState<CoinPosition[]>(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      ...getRandomPosition()
    }))
  );
  const [isJumping, setIsJumping] = useState(false);
  const [clickedCoinId, setClickedCoinId] = useState<number | null>(null);

  const handleCoinClick = useCallback((coinId: number) => {
    onClick?.();
    setIsJumping(true);
    setClickedCoinId(coinId);
    
    // Reset fox jump animation after 500ms
    setTimeout(() => {
      setIsJumping(false);
      setClickedCoinId(null);
      
      // Add new coin after animation completes
      setCoins(prevCoins => {
        const remainingCoins = prevCoins.filter(coin => coin.id !== coinId);
        const newCoin = {
          id: Date.now(),
          ...getRandomPosition()
        };
        return [...remainingCoins, newCoin];
      });
    }, 500);
  }, [onClick]);

  return (
    <div className="relative w-full flex items-center justify-center">
      <motion.div
        className="w-full my-1"
        animate={isJumping ? { y: -30 } : { y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <svg className="w-full h-full rounded-full">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation={foxLevel * 10} result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </motion.div>

          <img
            className="w-[80%] ml-[10%]"
            src={jupiter_fox}
            alt="fox"
            style={{ filter: "url(#glow)" }}
          />
        </div>
      </motion.div>

      {isWatering && (
        <div className="absolute top-0 w-full h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <motion.img
              key={index}
              src={salmon}
              alt="Water Animation"
              className="absolute size-40"
              initial={{ opacity: 0, y: -550 }}
              animate={{ 
                opacity: 1, 
                y: [0, 200, 300], 
                x: [300, Math.random() * 50 - 25] 
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {coins.map((coinData) => (
          <motion.div
            key={coinData.id}
            className="absolute cursor-pointer"
            style={{ 
              left: coinData.x, 
              top: coinData.y 
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.2, 1],
              y: coinData.id === clickedCoinId ? -100 : 0
            }}
            exit={{ 
              opacity: 0,
              scale: 0,
              y: -100,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            onClick={() => !clickedCoinId && handleCoinClick(coinData.id)}
          >
<motion.img 
  src={coin} 
  alt="Coin" 
  className="size-8 opacity-80"
  animate={{
    rotate: [-5, 5, -5],
    scale: [1, 1.1, 1]
  }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CoinFox;
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import coin from '@/assets/icons/coin.svg';
import jupiter_fox from '@/assets/images/airdrop/jupiter.svg';
import salmon from '@/assets/icons/salmon.svg';

interface CoinPosition {
  id: number;
  x: number;
  y: number;
  isAnimating: boolean;
}

interface CoinFoxProps {
  isWatering: boolean;
  foxLevel: number;
  onClick?: () => void;
  targetId?: string;
}

const getRandomPosition = () => {
  const centerX = window.innerWidth * 0.15; // Approximate center of the fox
  const centerY = window.innerHeight * 0.2; // Approximate center of the fox
  
  // Random offset from center (smaller radius)
  const radius = Math.min(window.innerWidth, window.innerHeight) * 0.15;
  const angle = Math.random() * Math.PI * 2; // Random angle
  
  return {
    x: centerX + Math.cos(angle) * radius * Math.random(),
    y: centerY + Math.sin(angle) * radius * Math.random(),
  };
};

const CoinFox: React.FC<CoinFoxProps> = ({ isWatering, foxLevel, onClick, targetId }) => {
  const [coins, setCoins] = useState<CoinPosition[]>(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      ...getRandomPosition(),
      isAnimating: false
    }))
  );
  const [isJumping, setIsJumping] = useState(false);
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
  const [coinAnimations, setCoinAnimations] = useState<{[key: number]: boolean}>({});

  // Update target position based on targetId
  const updateTargetPosition = useCallback(() => {
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setTargetPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    }
  }, [targetId]);

  // Update target position on mount, resize, or layout change
  useEffect(() => {
    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    return () => window.removeEventListener('resize', updateTargetPosition);
  }, [updateTargetPosition]);

  // Regenerate coins periodically to ensure there are always coins available
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prevCoins => {
        // Only add new coins if we have fewer than 5 non-animating coins
        const nonAnimatingCoins = prevCoins.filter(c => !c.isAnimating);
        if (nonAnimatingCoins.length >= 5) return prevCoins;
        
        // Add new coins to reach 5 total non-animating coins
        const newCoins = Array.from(
          { length: 5 - nonAnimatingCoins.length }, 
          (_, i) => ({
            id: Date.now() + i,
            ...getRandomPosition(),
            isAnimating: false
          })
        );
        
        return [...prevCoins, ...newCoins];
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCoinClick = useCallback(
    (coinId: number) => {
      onClick?.();
      setIsJumping(false);
      
      // Mark this coin as animating
      setCoins(prevCoins => 
        prevCoins.map(coin => 
          coin.id === coinId ? { ...coin, isAnimating: true } : coin
        )
      );
      
      setCoinAnimations(prev => ({...prev, [coinId]: true}));

      // Reset fox jump animation
      setTimeout(() => {
        setIsJumping(false);
      }, 300);

      // Remove the animated coin and add a new one
      setTimeout(() => {
        setCoins(prevCoins => {
          // Remove the animated coin
          const filteredCoins = prevCoins.filter(coin => coin.id !== coinId);
          
          // Add a new coin
          const newCoin = {
            id: Date.now() + Math.random(),
            ...getRandomPosition(),
            isAnimating: false
          };
          
          return [...filteredCoins, newCoin];
        });
        
        // Clear the animation state
        setCoinAnimations(prev => {
          const newState = {...prev};
          delete newState[coinId];
          return newState;
        });
      }, 1000);
    },
    [onClick]
  );

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Fox animation */}
      <motion.div
        className="w-full my-1"
        animate={isJumping ? { y: -30 } : { y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
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
          <img className="w-[90%] ml-[5%]" src={jupiter_fox} alt="fox" style={{ filter: 'url(#glow)' }} />
        </div>
      </motion.div>

      {/* Watering animation */}
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
                x: [300, Math.random() * 50 - 25],
              }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Coins */}
      <AnimatePresence>
        {coins.filter(coin => !coin.isAnimating).map((coinData) => (
          <motion.div
            key={coinData.id}
            className="absolute cursor-pointer"
            style={{
              left: coinData.x,
              top: coinData.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: [1, 1.2, 1],
            }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              x: targetPosition ? targetPosition.x - coinData.x - 100 : 0,
              y: targetPosition ? targetPosition.y - coinData.y - 200 : -100,
            }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
            onClick={() => handleCoinClick(coinData.id)}
          >
            <motion.img
              src={coin}
              alt="Coin"
              className="size-8 opacity-95 z-50"
              animate={{
                rotate: [-5, 5, -5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Coin animation effects */}
      <AnimatePresence>
        {Object.keys(coinAnimations).map((coinId) => (
          <motion.div
            key={`anim-${coinId}`}
            className="absolute text-[#FFD71F] font-bold text-2xl pointer-events-none"
            style={{
              left: coins.find(c => c.id === Number(coinId))?.x,
              top: (coins.find(c => c.id === Number(coinId))?.y ?? 0) - 20,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], y: -40, scale: [1, 1.2, 1.2, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut', times: [0, 0.1, 0.9, 1] }}
          >
            +0.001
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CoinFox;
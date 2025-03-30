/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import invite_btn from "@/assets/images/friends/invite_btn.png";
import { HiChevronDoubleUp } from "react-icons/hi";
import arrow from "@/assets/images/lottery_game/arrow.svg"
import useFPS from '@/hooks/useFPS';

type SpinnerItem = {
    name: string;
    id: string | number;
    probability?: number;
}

interface CustomSpinnerProps {
    items: SpinnerItem[];
    spinnerImage: string;
    size?: number;
    spinTime?: number;
    onResult?: (result: SpinnerItem) => void;
    onFinishSpin?: (result: SpinnerItem) => void;
    onReset?: () => void;
    spinButtonText?: string;
    resetButtonText?: string;
    disabled?: boolean;
    className?: string;
    buttonClassName?: string;
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({
    items,
    spinnerImage,
    size = 400,
    spinTime = 5000,
    onResult,
    onFinishSpin,
    onReset,
    spinButtonText = 'Spin',
    disabled = false,
    className = '',
    buttonClassName = '',
}) => {
    const [spinning, setSpinning] = useState(false);
    //   const [result, setResult] = useState<SpinnerItem | null>(null);
    const [rotation, setRotation] = useState(0);
    const spinnerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();
    const fps = useFPS();
    const showLightning = fps > 40;

    // Get a random result considering probabilities
    const getRandomResult = () => {
        // If probabilities are defined, use them
        if (items.some(item => item.probability !== undefined)) {
            const totalProbability = items.reduce((sum, item) => sum + (item.probability || 0), 0);
            const random = Math.random() * totalProbability;

            let cumulativeProbability = 0;
            for (const item of items) {
                cumulativeProbability += (item.probability || 0);
                if (random <= cumulativeProbability) {
                    return item;
                }
            }
        }

        // Fallback to equal probability
        return items[Math.floor(Math.random() * items.length)];
    };

    // Calculate the rotation needed to land on a specific item
    const getRotationForItem = (item: SpinnerItem) => {
        const index = items.findIndex(i => i.id === item.id);
        if (index === -1) return 0;

        const segmentSize = 360 / items.length;
        const segmentMiddle = index * segmentSize + segmentSize / 2;
        const extraRotations = fps > 30 ? 5 : fps > 20 ? 3 : 1;

        // Add extra rotations for more spinning effect (5 full rotations + segment)
        return 360 * extraRotations + (360 - segmentMiddle);
    };

    const handleSpin = () => {
        if (spinning || disabled) return;

        setSpinning(true);
        const selectedItem = getRandomResult();
        const newRotation = rotation + getRotationForItem(selectedItem);

        setRotation(newRotation);

        // Notify about the result immediately
        if (onResult) {
            onResult(selectedItem);
        }

        // Animate the spinner
        controls.start({
            rotate: newRotation,
            transition: {
                duration: spinTime / 1000,
                ease: [0.2, 0.0, 0.0, 1.0],
            }
        }).then(() => {
            setSpinning(false);
            //   setResult(selectedItem);

            // Notify when spinning is finished
            if (onFinishSpin) {
                onFinishSpin(selectedItem);
            }
        });
    };


    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div
                ref={spinnerRef}
                className="relative"
                style={{ width: size, height: size }}
            >
                <div className="w-full h-full relative">
                    {/* Lightning/Thunder effect */}

                    {showLightning && (<>
                        <motion.div
                        className="absolute inset-0 z-50 pointer-events-none overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0.2, 0.9, 0] }}
                        transition={{ 
                            duration: 0.8, 
                            repeat: Infinity, 
                            repeatDelay: Math.random() * 3 + 1
                        }}
                    >
                        <div className="absolute inset-0 bg-blue-100 opacity-20 rounded-full"></div>
                        
                        {[...Array(fps > 40 ? 3 : 1)].map((_, i) => {
                            const angle = (i * 60) * (Math.PI / 180);
                            const startX = Math.cos(angle) * (size / 2 - 20) + (size / 2);
                            const startY = Math.sin(angle) * (size / 2 - 20) + (size / 2);
                            
                            // Create zigzag path for lightningspinnerImage
                            const generateLightningPath = () => {
                                let path = `M ${startX} ${startY} `;
                                let currentX = startX;
                                let currentY = startY;
                                const segments = fps > 30 ? 4 + Math.floor(Math.random() * 3) : 2;
                                const outwardDistance = size / 2 + 30;
                                
                                for (let j = 0; j < segments; j++) {
                                    const progress = (j + 1) / segments;
                                    const targetX = startX + (Math.cos(angle) * outwardDistance * progress);
                                    const targetY = startY + (Math.sin(angle) * outwardDistance * progress);
                                    
                                    // Add some randomness to zigzag
                                    const zigzagX = targetX + (Math.random() * 20 - 10);
                                    const zigzagY = targetY + (Math.random() * 20 - 10);
                                    
                                    path += `L ${zigzagX} ${zigzagY} `;
                                    currentX = zigzagX;
                                    currentY = zigzagY;
                                }
                                
                                return path;
                            };
                            
                            return (
                                <motion.svg 
                                    key={i} 
                                    className="absolute top-0 left-0 w-full h-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ 
                                        opacity: [0, 0.9, 0.3, 0.7, 0],
                                    }}
                                    transition={{ 
                                        duration: 0.5, 
                                        repeat: Infinity, 
                                        repeatDelay: Math.random() * 4 + 1,
                                        delay: Math.random() * 0.5
                                    }}
                                >
                                    <path
                                        d={generateLightningPath()}
                                        stroke="#88ccff"
                                        strokeWidth={2 + Math.random() * 3}
                                        fill="none"
                                        strokeLinecap="round"
                                        filter="drop-shadow(0 0 8px #fff)"
                                    />
                                </motion.svg>
                            );
                        })}
                    </motion.div>
                    
                    {/* Occasional flash effect */}
                    <motion.div
                        className="absolute inset-10 z-50 bg-blue-100 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ 
                            duration: 0.3, 
                            repeat: Infinity, 
                            repeatDelay: Math.random() * 5 + 3
                        }}
                    />
                    </>)}

                    
                    <motion.div
                        className="w-full h-full absolute top-0 left-0 z-0"
                        animate={controls}
                        style={{
                            backgroundImage: `url(${spinnerImage})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            transformOrigin: 'center center',
                            willChange: 'transform'
                        }}
                    />
                    <img className='size-10 absolute left-1/2 -translate-x-1/2 z-10 rotate-180' src={arrow} alt="arrow" />
                </div>
            </div>

            <div className="mt-4 space-x-4">
                <div className="relative">
                    <motion.img
                        src={invite_btn}
                        alt="Invite button background"
                        className="w-56 h-auto"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    />
                    <Button
                        onClick={handleSpin}
                        disabled={spinning || disabled}
                        className="absolute top-1/2 text-md -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center bg-transparent border-none text-black font-semibold hover:bg-transparent"
                        variant="ghost"
                    >
                        <motion.div
                            animate={fps > 30 ? { y: [2, -3, 2] } : {}}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                        >
                            <HiChevronDoubleUp />
                        </motion.div>
                        {"Spin"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomSpinner;
import React from 'react';
import { motion } from 'framer-motion';
import salmon from '@/assets/images/airdrop/fish.svg';
interface WateringCanProps {
    onClick: () => void;
}

const WateringCan: React.FC<WateringCanProps> = ({ onClick }) => (
    <motion.div className='flex flex-row space-x-2' whileTap={{ rotate: [0, -45, 5, -25, 30, 20] }}>
        {/* <p>1/1</p> */}
        <img
            className="size-8"
            src={salmon}
            alt="salmon"
            onClick={onClick}
        />
    </motion.div>
);

export default WateringCan;
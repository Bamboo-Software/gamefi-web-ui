import React from 'react';
import { motion } from 'framer-motion';
import salmon from '@/assets/icons/salmon.svg';
interface WateringCanProps {
    onClick: () => void;
}

const WateringCan: React.FC<WateringCanProps> = ({ onClick }) => (
    <motion.div whileTap={{ rotate: [0, -45, 5, -25, 30, 20] }}>
        <img
            className="border-[#AB62FA] rounded-full size-12 border-4"
            src={salmon}
            alt="salmon"
            onClick={onClick}
        />
    </motion.div>
);

export default WateringCan;
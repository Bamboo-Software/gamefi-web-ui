
import React from 'react';
import BadgeModal from '@/components/badge';
import { motion } from 'framer-motion';

interface Content {
    imgContent?: string;
    title: string;
    content?: React.ReactNode;
    dialog?: React.ReactNode;
}

interface LotterySpinnerHistoryProps {
    contents: Content[];
}

const LotterySpinnerHistory: React.FC<LotterySpinnerHistoryProps> = ({ contents}) => (
<motion.div
            className={` w-full my-6 p-4`}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.2,
                    },
                },
            }}
        >
            {contents.map((airdrop, index) => (
                <BadgeModal
                    key={index}
                    imgContent={airdrop.imgContent}
                    title={airdrop.title}
                    content={airdrop.content}
                    dialog={airdrop.dialog}
                    titleClassName={"font-semibold text-lg"}
                />
            ))}
        </motion.div>
);

export default LotterySpinnerHistory;

// ContentList.tsx
import React from 'react';
import BadgeModal from '@/components/badge';
import { motion } from 'framer-motion';

interface Content {
    imgContent?: string;
    title: string;
    content?: React.ReactNode;
    dialog?: React.ReactNode;
}

interface ContentListProps {
    contents: Content[];
    variant?: 'mission' | 'default';
}

const ContentList: React.FC<ContentListProps> = ({ contents, variant = 'default' }) => (
<motion.div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 w-full my-6  ${
                variant === 'mission' ? 'justify-start' : 'justify-between'
            } p-4`}
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
                    variant={variant}
                />
            ))}
        </motion.div>
);

export default ContentList;

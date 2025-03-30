import React from 'react';
import { motion } from 'framer-motion';


interface IUserProfile {
    avatar?: React.ReactNode;
    title ?: React.ReactNode;
    content ?: React.ReactNode;
    subContent ?: React.ReactNode;
    handleBtn?: React.ReactNode;
    className?: string;
}

const UserProfile = ({ avatar, title, content, subContent, handleBtn, className }: IUserProfile) => {

    return (
        <div className={`flex flex-row w-full items-center justify-between p-4 ${className} bg-opacity-70 rounded-xl`}>
            <div className='flex flex-row items-center ml-2 justify-start'>
                {avatar}
                <div className="flex ml-6 flex-col items-start justify-start">
                    {title}
                    {content}
                    {subContent}
                </div>
            </div>

            <motion.div whileTap={{ scale: 0.9, rotate: 15 }}>
                 {handleBtn}
            </motion.div>

        </div>
    );
};

export default UserProfile;
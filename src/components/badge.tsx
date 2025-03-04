import React from "react";

interface BadgeModalProps {
  imgContent?:  string;
  title?: React.ReactNode | string;
  content?: React.ReactNode;
  dialog?: React.ReactNode;
  variant?: 'mission' | 'default';
  className?: string;
  imgClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  dialogClassName?: string;
  containerClassName?: string;
}

const BadgeModal: React.FC<BadgeModalProps> = ({
  imgContent,
  title,
  content,
  dialog,
  className = "",
  imgClassName = "",
  contentClassName = "",
  titleClassName = "",
  dialogClassName = "",
  containerClassName = "",
}) => {
  return (
    <div className={`flex flex-row w-full items-center justify-between py-4 px-6 bg-[#41434E] shadow-2xl rounded-md ${className}`}>
      <div className={`flex flex-row items-center justify-start ${containerClassName}`}>
        <div className="relative inline-block">
            <img 
              src={imgContent} 
              alt="Badge Content" 
              className={`size-10 rounded-full ${imgClassName}`} 
            />
        </div>
        <div className="flex ml-3 flex-col items-start justify-start">
          <p className={`font-normal text-sm text-white ${titleClassName}`}>{title}</p>
          {content && (
            <div className={`text-sm text-gray-300 text-justify ${contentClassName}`}>
              {content}
            </div>
          )}
        </div>
      </div>
      <div className={`flex items-center space-x-2 ${dialogClassName}`}>
        {dialog && <div>{dialog}</div>}
      </div>
    </div>
  );
};

export default BadgeModal;
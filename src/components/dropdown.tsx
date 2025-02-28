import { ReactNode } from "react";

interface IDropdownProps {
  triggers: ReactNode; 
  contents: ReactNode; 
  position?: "left" | "right" | "center"; 
  width?: string;
  bgColor?: string;
  borderColor?: string;
  className?: string; 
  contentClassName?: string; 
}

const Dropdown = ({
  triggers,
  contents,
  position = "left",
  width = "w-50",
  bgColor = "bg-[#040817]",
  borderColor = "border-gray-700/50",
  className = "",
  contentClassName = "",
}: IDropdownProps) => {
  const positionStyles =
    position === "right"
      ? "right-0"
      : position === "center"
      ? "left-1/2 -translate-x-1/2"
      : "left-0";

  return (
    <div className={`group relative inline-block ${className}`}>
      <button className="flex flex-row items-center gap-1 focus:outline-none space-x-2 hover:text-gray-400">
        {triggers}
      </button>
      <div
        className={`${width} ${bgColor} border ${borderColor} absolute mt-2 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ${positionStyles} ${contentClassName}`}
      >
        {contents}
      </div>
    </div>
  );
};

export default Dropdown;
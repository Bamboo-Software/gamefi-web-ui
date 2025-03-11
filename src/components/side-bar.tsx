import React from "react";
import { Link } from "react-router-dom";

export interface INavbar {
  title: string | React.ReactNode;
  path: string;
  icon: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  navbars: INavbar[];
}

const Sidebar = ({ isCollapsed, navbars }: SidebarProps) => {
  const sidebarClasses = `
    bg-[#040817] 
    relative 
    shadow-[0_0_15px_rgba(0,0,0,0.5)] 
    rounded-lg 
    border border-gray-700/50 
    text-gray-100 
    h-full 
    backdrop-blur-sm 
    transition-all duration-300 ease-in-out 
    flex flex-col 
    justify-between
    overflow-hidden 
    z-50 
    ${isCollapsed ? "w-18" : "w-50"}
  `;

  const linkClasses = `
    block 
    flex flex-row
    rounded-md 
    ml-2
    hover:bg-gray-700/50 
    active:bg-blue-600/70 
    transition-all duration-200 
    hover:shadow-lg hover:shadow-black/20 
    hover:translate-x-1
  `;

  return (
    <div className={sidebarClasses}>
      <ul className={`flex-1 ${isCollapsed ? "p-2 space-y-2" : "p-2 space-y-2"}`}>
        {navbars.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`${linkClasses} ${isCollapsed ? "my-2 flex justify-center" : "p-2"}`}
            >
              <div className={isCollapsed ? "" : "flex flex-row items-center gap-3"}>
                <img src={item.icon} className="h-8 w-6 my-2" alt="" />
                {!isCollapsed && (
                  <span className="text-gray-300 font-semibold text-center text-sm">{item.title}</span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
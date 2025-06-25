import React from "react";
import { Link, useLocation } from "react-router-dom";
export interface INavbar {
  title: string | React.ReactNode;
  path: string;
  icon: string | React.ReactNode;
}

interface SidebarProps {
  isCollapsed: boolean;
  navbars: INavbar[];
}


const Sidebar = ({ isCollapsed, navbars }: SidebarProps) => {
  const location = useLocation();
  const sidebarClasses = `
    bg-[#3fb1d0] 
    relative 
    rounded-lg 
    border border-gray-700/50 
    text-gray-100 
    h-full 
    backdrop-blur-sm 
    transition-all duration-300 ease-in-out 
    flex flex-col 
    justify-center
    overflow-hidden 
    z-50

    ${isCollapsed ? "w-18" : "w-50"}
  `;

  const linkClasses = `
    block 
    flex flex-row
    rounded-md 
    pl-1
    hover:bg-gray-700/50 
    active:bg-blue-[#3fb1d7] 
    transition-all duration-200 
    hover:shadow-lg hover:shadow-black/20
    my-4
  `;

  return (
    <div className={sidebarClasses}>
      <ul className={`flex-1 ${isCollapsed ? "p-2 space-y-2" : "p-2 space-y-2"}`}>
        {navbars.map((item, index) => (
          <li key={index} className={`${linkClasses} ${(location.pathname === item.path && index != 0) && "bg-gray-700/50 rounded-lg "}`}>
            <Link
              to={item.path}
              className={` ${isCollapsed ? " flex py-2 justify-center" : "p-2"}`}
            >
              <div className={isCollapsed ? "" : "flex flex-row items-center justify-center gap-3"}>
                <img src={item.icon as string} className="h-8 w-6 ml-2.5" alt="" />
                {!isCollapsed && (
                  <span className="text-gray-50 font-semibold text-center text-sm">{item.title}</span>
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
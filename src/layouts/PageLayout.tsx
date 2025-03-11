import Sidebar from "@/components/side-bar"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom"
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { INavbar } from "@/components/side-bar";
import routes from "@/constants/routes"
import missions from "@/assets/icons/bottom_tab/missions.svg"
import games from "@/assets/icons/bottom_tab/games.svg"
import airdrop from "@/assets/icons/bottom_tab/airdrop.svg"
import friends from "@/assets/icons/friends_icon.svg"
import profile from "@/assets/icons/profile_icon.svg"
import logo from "@/assets/icons/logo.svg"
import { FaAngleDown } from "react-icons/fa6";
import youtube from "@/assets/icons/youtube.svg"
import x from "@/assets/icons/x2.svg"
import instagram from "@/assets/icons/instagram.svg"
import tiktok from "@/assets/icons/tiktok.svg"
import { FaRegBell } from "react-icons/fa";
import Dropdown from "@/components/dropdown";
import UserAvatarDropdownProps from "@/components/avatar";
import { useGetMeQuery } from "@/services/auth";
import LoadingComponent from "@/components/loading-component";

const { MISSIONS, GAMES, FRIENDS, ROOT, PROFILE } = routes
const PageLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data, error, isLoading } = useGetMeQuery({}, { refetchOnFocus: true })

  if (isLoading) return <LoadingComponent />;
  if (error) return <p>Error loading user info</p>;
  const { avatar, firstName, lastName } = data.data;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  const navbars: INavbar[] = [
    {
      title: <div className="">Lottery <span className="text-[#F3BE8E]">JuniperFOX</span> Game</div>,
      path: ROOT,
      icon: logo
    },
    {
      title: "Missions",
      path: MISSIONS,
      icon: missions
    }, {
      title: "Games",
      path: GAMES,
      icon: games
    }, {
      title: "Airdrop",
      path: ROOT,
      icon: airdrop
    }, {
      title: "Friends",
      path: FRIENDS,
      icon: friends
    }, {
      title: "Profile",
      path: PROFILE,
      icon: profile
    }
  ];

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://youtube.com/@yourhandle",
      icon: youtube
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/yourhandle",
      icon: x
    },
    {
      name: "Instagram",
      href: "https://instagram.com/yourhandle",
      icon: instagram
    },
    {
      name: "Tiktok",
      href: "https://tiktok.com/yourhandle",
      icon: tiktok
    },
  ];

  return (
    <div className="flex p-5 bg-[#040817] w-full h-screen overflow-hidden">
    <div className={`h-screen ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex-shrink-0`}>
      <Sidebar isCollapsed={isCollapsed} navbars={navbars} />
    </div>
    <div className="flex flex-col w-full h-screen overflow-y-auto overflow-x-hidden">
      <div className="sticky top-0 z-50 flex flex-row items-center justify-between bg-[#040817] shadow-md px-2">
        <div className="flex flex-row items-center">
          <Button
            onClick={toggleCollapse}
            className="size-10 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-700/50 bg-[#040817] hover:bg-gray-600"
          >
            {isCollapsed ? <TbLayoutSidebarRightCollapse className="text-gray-200 size-5" /> : <TbLayoutSidebarLeftCollapse className="text-gray-200 size-5" />}
          </Button>
          <div className="hidden md:flex flex-row items-center gap-4 lg:gap-8 ml-2 lg:ml-5">
            <Link to={ROOT} className="text-gray-200! font-semibold text-sm whitespace-nowrap">About Us</Link>
            <Link to={ROOT} className="text-gray-200! font-semibold text-sm whitespace-nowrap">Introduction</Link>
            <Dropdown
              offset={4} 
              triggers={
                <div className="flex items-center">
                  <span className="text-gray-200 font-semibold text-sm transition-colors whitespace-nowrap">Follow Us</span>
                  <FaAngleDown className="text-gray-200 ml-1" />
                </div>
              } 
              contents={
                <div className="py-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center text-gray-200! justify-start space-x-2 font-semibold px-4 py-2 mx-2 my-1 text-sm text-gray-200 hover:bg-gray-700/50 rounded-sm transition-colors"
                    >
                      <img src={link.icon} className="size-6 mr-2" alt="" />
                      <span className="whitespace-nowrap">{link.name}</span>
                    </a>
                  ))}
                </div>
              } 
            />
          </div>
        </div>

        <div className="text-gray-200 flex items-center">
          <FaRegBell className="size-5 mx-4" />
          <UserAvatarDropdownProps 
            imageUrl={avatar} 
            userName={firstName && lastName ? `${firstName} ${lastName}` : "User"} 
            // pointsBalance={pointsBalance} 
            fallback={firstName && lastName ? `${String(firstName).charAt(0)}${String(lastName).charAt(0)}` : "JF"} 
          />
        </div>
      </div>
      <div className="flex-1 md:my-8 max-w-full">
        <Outlet />
      </div>
    </div>
  </div>
  )
}

export default PageLayout
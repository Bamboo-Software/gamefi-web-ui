import Sidebar from "@/components/side-bar"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
// import { FaRegBell } from "react-icons/fa";
import Dropdown from "@/components/dropdown";
import UserAvatarDropdownProps from "@/components/avatar";
import { useGetMeQuery } from "@/services/auth";
import LoadingComponent from "@/components/loading-component";
// import { useLocalStorage } from "react-use";
import { useNavigate } from "react-router-dom";
import { socialLinks, webLinks } from "@/constants/social-links";

const { MISSIONS, GAMES, FRIENDS, ROOT, PROFILE, AUTH } = routes
const PageLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, error, isLoading } = useGetMeQuery({}, { refetchOnFocus: true })

  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebar && !sidebar.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const goBackToLogin = () => {
    localStorage.removeItem('auth-token');
    navigate(AUTH)
  }
  if (isLoading) return <LoadingComponent />;
  if (error) return (
    <div className="flex flex-col space-y-2 justify-center items-center h-screen w-full">
      <p className="font-semibold text-xl">Failed To Get Data</p>
      <Button onClick={goBackToLogin}>Back To Login</Button>
    </div>
  );
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

  


  return (
    <div style={{
      backgroundImage: `url('/images/bg_web.webp')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }} className="flex p-5 w-full h-screen overflow-hidden">
      <div className={`h-auto hidden md:block ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex-shrink-0`}>
        <Sidebar isCollapsed={isCollapsed} navbars={navbars} />
      </div>
      <div className="flex flex-col w-full h-screen  overflow-x-hidden">
        <div
          id="mobile-sidebar"
          className={`fixed md:hidden top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="h-full w-64 p-5">
            <Sidebar isCollapsed={false} navbars={navbars} />
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isMobileMenuOpen && (
          <div
            className="fixed md:hidden inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        <div className="flex flex-col w-full h-screen overflow-x-hidden">
          <div className="sticky top-0 z-30 py-2 flex flex-row items-center justify-between rounded-lg px-2">
            <div className="flex flex-row items-center">
              {/* Mobile menu button */}
              <Button
                onClick={toggleMobileMenu}
                className="md:hidden size-10 shadow-2xl bg-transparent hover:bg-gray-600"
              >
                <TbLayoutSidebarRightCollapse className="text-gray-50 size-5" />
              </Button>

              {/* Desktop collapse button */}
              <Button
                onClick={toggleCollapse}
                className="hidden md:flex size-10 shadow-2xl bg-transparent hover:bg-gray-600"
              >
                {isCollapsed ? <TbLayoutSidebarRightCollapse className="text-gray-50 size-5" /> : <TbLayoutSidebarLeftCollapse className="text-gray-50 size-5" />}
              </Button>

              {/* Rest of the header content */}
              <div className="hidden md:flex flex-row items-center gap-4 lg:gap-8 ml-2 lg:ml-5">
                <div className="hidden md:flex flex-row items-center gap-4 lg:gap-8 ml-2 lg:ml-5">
                  <Link to={webLinks} className="text-gray-50! font-semibold text-sm whitespace-nowrap">About Us</Link>
                  <Link to={webLinks} className="text-gray-50! font-semibold text-sm whitespace-nowrap">Introduction</Link>
                  <Dropdown
                  contentClassName="bg-gradient-to-b from-[#47C3E6]/95 via-[#47C3E6]/95 via-[#32BAE0]/95  via-[#13A0C8]/95 to-[#24E6F3]/95"
                    offset={4}
                    triggers={
                      <div className="flex items-center">
                        <span className="text-gray-50 font-semibold text-sm transition-colors whitespace-nowrap">Follow Us</span>
                        <FaAngleDown className="text-gray-50 ml-1" />
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
                            className="flex flex-row items-center text-gray-50! justify-start space-x-2 font-semibold px-4 py-2 mx-2 my-1 text-sm hover:bg-gray-700/50 rounded-sm transition-colors"
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
            </div>
            <div className="text-gray-50 flex items-center">
              {/* <FaRegBell className="size-5 mx-4" /> */}
              <UserAvatarDropdownProps
                imageUrl={avatar}
                userName={firstName && lastName ? `${firstName} ${lastName}` : "User"}
                // pointsBalance={pointsBalance} 
                fallback={firstName && lastName ? `${String(firstName).charAt(0)}${String(lastName).charAt(0)}` : "JF"}
              />
            </div>
          </div>
          <div className="flex-1 md:my-2 max-w-full overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageLayout
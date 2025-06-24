import Navbar, { INavItem } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import routes from "@/constants/routes";
import logo from "@/assets/icons/logo.svg";
import { useGetMeQuery } from "@/services/auth";
import { useNavigate } from "react-router-dom";
// Icon imports
import { FaStore } from "react-icons/fa";
import { FaGamepad, FaRankingStar, FaRegCircleUser } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import LoadingPage from "@/pages/LoadingPage";
import { motion } from "framer-motion";
import { RiNftLine } from "react-icons/ri";

const { STAKING, GAMES, MARKETPLACE, ROOT, PROFILE, AUTH, USER_NFT } = routes;
const PageLayout = () => {
  const { data, error, isLoading } = useGetMeQuery({}, { refetchOnFocus: true });
  const navigate = useNavigate();

  const goBackToLogin = () => {
    localStorage.removeItem("auth-token");
    navigate(AUTH);
  };

  if (isLoading) return <LoadingPage />;
  if (error)
    return (
      <div className="flex flex-col space-y-2 justify-center items-center h-screen w-full bg-gray-900">
        <p className="font-semibold text-xl text-white">Failed To Get Data</p>
        <Button onClick={goBackToLogin} className="bg-indigo-600 hover:bg-indigo-700">Back To Login</Button>
      </div>
    );

  const { avatar, firstName, lastName } = data.data;

  const navItems: INavItem[] = [
    {
      title: (
        <div className="text-lg font-bold">
          NFT <span className="text-amber-400">JuniperFOX</span>
        </div>
      ),
      path: ROOT,
      icon: logo,
    },
    {
      title: "Home",
      path: ROOT,
      icon: <FaRankingStar className="size-5" />,
    },
    {
      title: "Games",
      path: GAMES,
      icon: <FaGamepad className="size-5" />,
    },

    {
      title: "Marketplace",
      path: MARKETPLACE,
      icon: <FaStore className="size-5" />,
    },
    {
      title: "Staking",
      path: STAKING,
      icon: <GiTakeMyMoney className="size-5" />,
    },
    {
      title: "NFT",
      path: USER_NFT,
      icon: <RiNftLine className="size-5" />,
    },
    {
      title: "Profile",
      path: PROFILE,
      icon: <FaRegCircleUser className="size-5" />,
    },
  ];

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(13, 17, 23, 0.9), rgba(13, 17, 23, 0.8)), url('/images/bg_web.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      className="flex flex-col w-full min-h-screen overflow-hidden p-4 md:p-6 bg-gray-900 text-gray-100"
    >
      {/* Navbar */}
      <div className="mb-6">
        <Navbar navItems={navItems} userInfo={{ avatar, firstName, lastName }} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 shadow-xl p-4">
        <Outlet />
      </div>


        {/* Footer */}
        <motion.div 
          className="text-center text-white/60 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p>© {new Date().getFullYear()} JuniperFOX NFT Marketplace. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <motion.a 
              href="#" 
              className="text-white/60 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="text-white/60 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>
    </div>
  );
};

export default PageLayout;

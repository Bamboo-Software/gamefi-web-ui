import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import Dropdown from "@/components/dropdown";
import { socialLinks, webLinks } from "@/constants/social-links";
import UserAvatarDropdownProps from "@/components/avatar";
import { FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export interface INavItem {
  title: string | React.ReactNode;
  path: string;
  icon: string | React.ReactNode;
}

interface NavbarProps {
  navItems: INavItem[];
  userInfo: {
    avatar: string;
    firstName: string;
    lastName: string;
  };
}

const Navbar = ({ navItems, userInfo }: NavbarProps) => {
  const location = useLocation();
  const { avatar, firstName, lastName } = userInfo;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav 
      className={`relative rounded-xl border border-gray-700/50 w-full backdrop-blur-lg transition-all duration-300 ease-in-out z-50 ${scrolled ? 'bg-gray-900/90 shadow-lg' : 'bg-gray-900/70'}`}
    >
      <div className="flex flex-row items-center justify-between px-4 py-3">
        {/* Logo và tên ứng dụng */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center group">
            {typeof navItems[0].icon === 'string' ? (
              <motion.img 
                src={navItems[0].icon as string} 
                className="h-9 w-auto mr-3" 
                alt="Logo" 
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ) : (
              navItems[0].icon
            )}
            <motion.span 
              className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ opacity: 0.9 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {navItems[0].title}
            </motion.span>
          </Link>
        </div>

        {/* Menu chính */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.slice(1).map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === item.path 
                ? "bg-indigo-600/90 text-white shadow-md" 
                : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                {typeof item.icon === 'string' ? (
                  <img src={item.icon as string} className="h-5 w-5" alt="" />
                ) : (
                  <span className="text-amber-400">{item.icon}</span>
                )}
                <span className="font-medium">{item.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Links phụ */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to={webLinks} 
            className="text-gray-300 font-medium text-sm hover:text-white transition-colors whitespace-nowrap"
          >
            About Us
          </Link>
          <Link 
            to={webLinks} 
            className="text-gray-300 font-medium text-sm hover:text-white transition-colors whitespace-nowrap"
          >
            Introduction
          </Link>
          <Dropdown
            contentClassName="bg-gray-900/95 border border-gray-700 shadow-xl rounded-lg backdrop-blur-lg"
            offset={4}
            triggers={
              <motion.div 
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-gray-300 font-medium text-sm hover:text-white transition-colors whitespace-nowrap">
                  Follow Us
                </span>
                <FaAngleDown className="text-amber-400 ml-1" />
              </motion.div>
            }
            contents={
              <div className="py-2">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center text-gray-300 justify-start space-x-2 font-medium px-4 py-2 mx-2 my-1 text-sm hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                    whileHover={{ x: 5, backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={link.icon} className="size-6 mr-2" alt="" />
                    <span className="whitespace-nowrap">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            }
          />
        </div>

        {/* User info và giỏ hàng */}
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <FaShoppingCart className="size-5 cursor-pointer text-amber-400 hover:text-amber-300 transition-colors" />
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </motion.div>
          
          <UserAvatarDropdownProps
            imageUrl={avatar}
            userName={firstName && lastName ? `${firstName} ${lastName}` : "User"}
            fallback={firstName && lastName ? `${String(firstName).charAt(0)}${String(lastName).charAt(0)}` : "JF"}
          />
          
          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - hiển thị khi màn hình nhỏ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-gray-700/30 bg-gray-900/90 backdrop-blur-lg rounded-b-xl overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-3 p-4">
              {navItems.slice(1).map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${location.pathname === item.path 
                    ? "bg-indigo-600/80 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="mb-1 text-amber-400"
                  >
                    {typeof item.icon === 'string' ? (
                      <img src={item.icon as string} className="h-6 w-6" alt="" />
                    ) : (
                      item.icon
                    )}
                  </motion.div>
                  <span className="font-medium text-xs">{item.title}</span>
                </Link>
              ))}
            </div>
            
            <div className="flex justify-around p-4 border-t border-gray-700/30">
              <Link 
                to={webLinks} 
                className="text-gray-300 font-medium text-sm hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to={webLinks} 
                className="text-gray-300 font-medium text-sm hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Introduction
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
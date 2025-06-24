import { motion, AnimatePresence } from "framer-motion";
import { socialLinks, webLinks } from "@/constants/social-links";
import projectLogo from "@/assets/images/airdrop/jupiter.svg";
import featureImage1 from "@/assets/images/airdrop/income.svg";
import featureImage2 from "@/assets/images/airdrop/achivements.svg";
import featureImage3 from "@/assets/images/airdrop/friends.svg";
import featureImage4 from "@/assets/images/airdrop/tasks.svg";
import featureImage5 from "@/assets/images/airdrop/spinner.svg";
import { useEffect, useState } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
  color: string;
  bgColor: string;
}

const FeatureCard = ({ title, description, imageUrl, color, bgColor }: FeatureCardProps) => {
  return (
    <motion.div
      className={`overflow-hidden rounded-2xl relative shadow-lg border-2 border-solid p-6`}
      style={{ borderColor: color, backgroundColor: bgColor }}
      whileHover={{ y: -10, boxShadow: `0 10px 25px -5px ${color}50` }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full"
        style={{ backgroundColor: `${color}20` }}
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      <div className="flex items-center mb-4 relative z-10">
        <motion.div 
          className="bg-white/10 p-3 rounded-full mr-4 backdrop-blur-sm"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img 
            src={imageUrl} 
            alt={title} 
            className="w-10 h-10" 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <h3 
          className="text-xl font-bold" 
          style={{ 
            background: `linear-gradient(90deg, white, ${color})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {title}
        </h3>
      </div>
      <p className="text-gray-100 relative z-10">{description}</p>
    </motion.div>
  );
};

const ProjectIntroPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features: FeatureCardProps[] = [
    {
      title: "NFT Marketplace",
      description: "Browse, buy, and sell unique digital collectibles on our secure NFT marketplace",
      imageUrl: featureImage1,
      color: "#E77C1B",
      bgColor: "#E77C1B30",
    },
    {
      title: "Staking Rewards",
      description: "Earn passive income by staking your tokens and participating in our reward system",
      imageUrl: featureImage2,
      color: "#65DEB8",
      bgColor: "#65DEB830",
    },
    {
      title: "Community",
      description: "Join our vibrant community of collectors, creators, and crypto enthusiasts",
      imageUrl: featureImage3,
      color: "#6D89FF",
      bgColor: "#6D89FF30",
    },
    {
      title: "Gaming Integration",
      description: "Experience seamless integration with popular games and earn rewards while playing",
      imageUrl: featureImage4,
      color: "#EB886D",
      bgColor: "#EB886D30",
    },
    {
      title: "Tokenomics",
      description: "Understand our token economy, distribution, and long-term value proposition",
      imageUrl: featureImage5,
      color: "#5A2DFD",
      bgColor: "#5A2DFD30",
    },
  ];

  return (
    <motion.div
      className="w-full flex flex-col px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full h-full overflow-hidden">
        {/* Hero Section */}
        <motion.div 
          className="w-full bg-gradient-to-r  from-[#1594B8]/80 to-[#24E6F3]/80 rounded-2xl p-12 mb-12 relative overflow-hidden"
          style={{ minHeight: "60vh" }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Animation Elements */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full opacity-20"
            style={{ 
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
              backgroundSize: "150% 150%"
            }}
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          <motion.div 
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 40, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          />
          
          <div className="flex flex-col lg:flex-row items-center justify-between h-full relative z-10">
            <div className="lg:w-1/2 mb-8 lg:mb-0 flex flex-col justify-center">
              <AnimatePresence>
                {isLoaded && (
                  <motion.h1 
                    className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
                  >
                    <span className="inline-block">
                      <motion.span 
                        className="inline-block"
                        style={{ 
                          background: "linear-gradient(90deg, white, #24E6F3)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          textShadow: "0 0 30px rgba(36, 230, 243, 0.5)"
                        }}
                        animate={{ 
                          textShadow: ["0 0 20px rgba(36, 230, 243, 0.3)", "0 0 40px rgba(36, 230, 243, 0.7)", "0 0 20px rgba(36, 230, 243, 0.3)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        JuniperFOX
                      </motion.span>
                    </span>
                    <br />
                    <motion.span 
                      className="inline-block text-white"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      NFT Marketplace
                    </motion.span>
                  </motion.h1>
                )}
              </AnimatePresence>
              
              <motion.p 
                className="text-xl text-gray-100 mb-8 max-w-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Discover, collect, and trade unique digital assets in our secure and user-friendly NFT marketplace.
                <motion.span 
                  className="block mt-4 text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  Join the future of digital ownership today.
                </motion.span>
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.a 
                  href="#features" 
                  className="bg-white text-[#1594B8] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                  Explore Features
                </motion.a>
                
                <motion.a 
                  href={webLinks} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors relative overflow-hidden group"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                  Visit Website
                </motion.a>
              </motion.div>
            </div>
            
            <motion.div 
              className="lg:w-1/2 flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
            >
              <motion.div className="relative">
                {/* Glow effect behind logo */}
                <motion.div 
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{ backgroundColor: "rgba(36, 230, 243, 0.3)" }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <motion.img 
                  src={projectLogo} 
                  alt="JuniperFOX NFT" 
                  className="w-80 h-80 object-contain relative z-10"
                  animate={{ 
                    y: [0, -15, 0],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut" 
                  }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  whileDrag={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                
                {/* Floating particles around logo */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 rounded-full bg-white/80"
                    style={{ 
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{ 
                      x: [0, Math.random() * 40 - 20, 0],
                      y: [0, Math.random() * 40 - 20, 0],
                      opacity: [0.4, 0.8, 0.4],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 3, 
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div id="features" className="mb-12 pt-10">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4 text-white"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span
                style={{ 
                  background: "linear-gradient(90deg, #1594B8, #24E6F3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Key Features
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our platform offers a comprehensive suite of features designed to enhance your NFT experience
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <motion.div 
          className="bg-gradient-to-r from-[#1594B8]/30 to-[#24E6F3]/30 rounded-2xl p-8 mb-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Background animation */}
          <motion.div 
            className="absolute inset-0 opacity-30"
            style={{ 
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
              backgroundSize: "150% 150%"
            }}
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="flex flex-col lg:flex-row items-center relative z-10">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span
                  style={{ 
                    background: "linear-gradient(90deg, white, #24E6F3)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  About JuniperFOX
                </span>
              </motion.h2>
              <motion.p 
                className="text-gray-100 mb-4"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                JuniperFOX is a next-generation NFT marketplace built on blockchain technology, offering a secure, transparent, and user-friendly platform for digital asset trading.
              </motion.p>
              <motion.p 
                className="text-gray-100 mb-4"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Our mission is to democratize access to digital collectibles and empower creators and collectors in the growing NFT ecosystem.
              </motion.p>
              <motion.p 
                className="text-gray-100"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                With advanced features, low fees, and a commitment to sustainability, JuniperFOX is setting new standards in the NFT space.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Community Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-center mb-10"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span
                style={{ 
                  background: "linear-gradient(90deg, #1594B8, #24E6F3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 20px rgba(36, 230, 243, 0.3)"
                }}
              >
                Join Our Community
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Connect with fellow collectors and creators in our growing community
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {Object.entries(socialLinks).map(([platform, link], index) => (
              <motion.a
                key={platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-4 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all"
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0 0 20px rgba(36, 230, 243, 0.5)",
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                >
                  {/* social icon */}
                </motion.div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div 
          className="bg-gradient-to-r from-[#1594B8]/20 to-[#24E6F3]/20 rounded-2xl p-8 mb-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Background animation */}
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{ 
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)",
              backgroundSize: "150% 150%"
            }}
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="flex flex-col items-center relative z-10">
            <motion.h2 
              className="text-3xl font-bold mb-4 text-center"
              initial={{ y: -30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span
                style={{ 
                  background: "linear-gradient(90deg, white, #24E6F3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 20px rgba(36, 230, 243, 0.3)"
                }}
              >
                Stay Updated
              </span>
            </motion.h2>
            <motion.p 
              className="text-gray-100 mb-6 text-center max-w-2xl"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Subscribe to our newsletter to receive the latest updates, exclusive offers, and early access to new features.
            </motion.p>
            
            <motion.form 
              className="w-full max-w-md"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#24E6F3]/50"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 15px rgba(36, 230, 243, 0.3)" }}
                  transition={{ duration: 0.2 }}
                />
                <motion.button 
                  type="submit" 
                  className="px-6 py-3 rounded-full bg-white text-[#1594B8] font-bold hover:bg-opacity-90 transition-colors relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(36, 230, 243, 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />
                  Subscribe
                </motion.button>
              </div>
              <motion.p 
                className="text-sm text-white/60 mt-3 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                We respect your privacy. Unsubscribe at any time.
              </motion.p>
            </motion.form>
          </div>
        </motion.div>


      </div>
    </motion.div>
  );
};



export default ProjectIntroPage;


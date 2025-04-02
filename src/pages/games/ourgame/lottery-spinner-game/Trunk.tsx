/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import trunk from "@/assets/images/lottery_game/trunk.png";
import CustomDialog from "@/components/custom-dialog";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IFilter } from "@/interfaces/IFilter";
import { useGetWonItemQuery } from "@/services/lottery";
import { IWonItem } from "@/interfaces/IWonItems";
import { CryptoCurrencyEnum } from "@/enums/games";
import usdc from "@/assets/images/lottery_game/usdc.svg";
import usdt from "@/assets/images/lottery_game/usdt.svg";
import solana from "@/assets/images/lottery_game/sol.svg";
import group_coins from "@/assets/images/lottery_game/group_coins.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingComponent from "@/components/loading-component";
import ShareDialog from "./ShareDialog";
import { useGetMeQuery } from "@/services/auth";
import { TransactionTypeEnum } from "@/enums/transactions";

dayjs.extend(relativeTime);
interface ITrunkProps {
  trunkOpen: boolean;
  setTrunkOpen: (condition: boolean) => void;
  type?: TransactionTypeEnum;
}

const Trunk = ({ setTrunkOpen, trunkOpen, type }: ITrunkProps) => {
  const [glowParticles, setGlowParticles] = useState<Array<{ id: number }>>([]);
  const [filter, setFilter] = useState<IFilter & { type?: TransactionTypeEnum }>({
    limit: 10,
    page: 1,
    ...(type && { type }),
  });
  const [trunkItems, setTrunkItems] = useState<any[]>([]);
  const [openShare, setOpenShare] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const {
    data: wonItems,
    isLoading: isLoadingWonItems,
    error: errorGetWonItems,
    isFetching: isFetchingWonItems,
  } = useGetWonItemQuery(filter, { refetchOnMountOrArgChange: true});

  const { data: userInfo } = useGetMeQuery(undefined);

  const handleOpenShare = (item: IWonItem) => {
    setSelectedItem(item);
    setTrunkOpen(false);

    setTimeout(() => {
      setOpenShare(true);
    }, 100);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const particles = Array.from({ length: 15 }, (_, i) => ({
        id: Date.now() + i,
      }));
      setGlowParticles(particles);

      // Clear particles after animation
      setTimeout(() => {
        setGlowParticles([]);
      }, 2000);
    }, 3000); // Generate particles every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (wonItems?.data?.items) {
      if (filter.page === 1) {
        setTrunkItems(Array.isArray(wonItems.data.items) ? wonItems.data.items : []);
      } else {
        setTrunkItems((prev) => [...prev, ...(Array.isArray(wonItems.data.items) ? wonItems.data.items : [])]);
      }
      setHasMore(trunkItems.length + wonItems.data.items.length < wonItems.data.total);
    }
  }, [wonItems?.data?.items]);

  const isExpired = (expiryDate: string | Date) => {
    return dayjs(expiryDate).isBefore(dayjs());
  };

  const filterImages = (cryptoType: CryptoCurrencyEnum) => {
    switch (cryptoType) {
      case CryptoCurrencyEnum.JFOX:
        return group_coins;
      case CryptoCurrencyEnum.SOL:
        return solana;
      case CryptoCurrencyEnum.USDT:
        return usdt;
      case CryptoCurrencyEnum.USDC:
        return usdc;
      default:
        return group_coins;
    }
  };

  // const hasMore = trunkItems.length < (wonItems?.data?.total || 0);
  const loadMore = () => {
    if (hasMore && !isFetchingWonItems) {
      setFilter((prev) => ({
        ...prev,
        page: (prev.page ?? 2) + 1,
      }));
    }
  };

  if (isLoadingWonItems) {
    return <LoadingComponent />;
  }

  if (errorGetWonItems) {
    return (
      <div className="text-center">
        <p className="text-red-500">An error occurred while fetching won items.</p>
      </div>
    );
  }

  return (
    <motion.div animate={{ y: 0 }} transition={{ duration: 2, ease: "easeOut" }}>
      <div className="relative">
        {/* Glow Particles */}
        <AnimatePresence>
          {glowParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute size-2 bg-yellow-200 rounded-full shadow-[0_0_10px_2px_rgba(255,215,31,0.8)]"
              style={{
                left: "50%",
                top: "50%",
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 2,
                x: (Math.random() - 0.5) * 150,
                y: -Math.random() * 150,
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>

        <motion.img
          className="w-16 cursor-pointer rounded-full"
          src={trunk}
          alt="trunk"
          onClick={() => setTrunkOpen(true)}
          // style={{ filter: 'url(#glow)' }}
          animate={{
            rotate: [0, -5, 5, -5, 5, 0],
            x: [0, -2, 2, -2, 2, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Trunk Dialog */}
      <CustomDialog
        className="border-4 w-full h-2/3 overflow-auto bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 to-[#24E6F3]/95 border-[#24E6F3] rounded-xl"
        open={trunkOpen}
        onClose={() => setTrunkOpen(false)}
        title="Your items"
        description={
          <div id="scrollableDiv" className="h-[60vh] overflow-auto">
            <InfiniteScroll
              dataLength={trunkItems.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<div className="text-center py-4">Loading more items...</div>}
              endMessage={
                <p className="text-center py-4 text-white/70">
                  {trunkItems.length > 0 ? "You've seen all your items!" : "No items found in your trunk."}
                </p>
              }
              scrollableTarget="scrollableDiv"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 pt-4">
                {trunkItems.map((item: IWonItem, index: number) => {
                  const expired = isExpired(item.expiresAt);
                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${
                        expired ? "bg-red-500/20 hover:bg-red-500/30" : "bg-white/10 hover:bg-white/20"
                      }`}
                      onClick={() => (expired ? () => {} : handleOpenShare(item))}
                    >
                      <div className="relative">
                        <img
                          src={filterImages(item.lotteryPrize?.cryptoCurrency)}
                          alt={item.lotteryPrize?.prizeName}
                          className={`w-12 h-12 ${expired ? "opacity-50" : ""}`}
                        />
                      </div>
                      <span className="mt-2 text-sm text-center text-white">{item.lotteryPrize?.prizeName}</span>
                      <span className={`text-xs text-center ${expired ? "text-red-300" : "text-blue-100"}`}>
                        {expired
                          ? "Expired " + dayjs(item.expiresAt).fromNow()
                          : "Expires " + dayjs(item.expiresAt).fromNow()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
        }
      />

      {/* Share Dialog - Now managed directly within Trunk */}
      {selectedItem && (
        <ShareDialog
          openShare={openShare}
          setOpenShare={setOpenShare}
          selectedItem={selectedItem}
          referralCode={userInfo?.data?.referralCode || ""}
          userInfo={userInfo?.data}
        />
      )}
    </motion.div>
  );
};

export default Trunk;

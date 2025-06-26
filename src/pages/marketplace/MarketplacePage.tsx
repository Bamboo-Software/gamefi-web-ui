/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion"
import bg_games from "@/assets/images/games/bg-games.png?url"
import Image from "@/components/image";
import {useMemo, useState } from "react";
import LoadingPage from "@/pages/LoadingPage";
import { seasonApi } from '@/services/seasons';
import PaginationTable from '@/components/pagination-table';
import BuyNFTComponent from './components/BuyNFT';

const MarketplacePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const {useGetAllSeasonQuery} =  seasonApi
  const {
    data: seasonData,
    isLoading,
    error,
    refetch
  } = useGetAllSeasonQuery({
    page: currentPage,
    limit: itemsPerPage,
    hasNFT: 'true',
    active: "true"
  });
  const seasonItems = useMemo(()=> seasonData?.data?.items || [], [seasonData])
  const seasonTotal = useMemo(()=> seasonData?.data?.total || 0, [seasonData])
  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error getting seasons</div>;
 

  return (
    <motion.div
      className="w-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Header with gradient underline */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">Marketplace</span>
            <motion.span 
              className="ml-2 inline-block"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🛒
            </motion.span>
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full"></div>
          <p className="text-gray-300 mt-2">Discover and collect unique digital assets</p>
        </div>

        {/* Grid of items */}
        <div className="w-full relative rounded-2xl gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-stretch">
          {seasonItems.map((season, index) => (
            <motion.div
              key={index}
              className={`relative p-4 rounded-xl flex flex-col h-auto min-h-[200px] bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-sm border border-indigo-500/30 hover:border-indigo-400 cursor-pointer overflow-hidden group`}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-1/3">
                  <Image 
                    fallbackSrc={bg_games} 
                    className="w-full aspect-square rounded-lg object-cover shadow-lg ring-2 ring-indigo-500/30 group-hover:ring-indigo-400/70 transition-all duration-300" 
                    src={season.imageUrl || bg_games} 
                    alt={season.name || "Season image"} 
                    animationVariant="bounce" 
                  />
                </div>
                <div className="flex w-2/3 flex-col justify-between">
                  <div className="text-white py-1 flex flex-col space-y-2">
                    <h2 className={`font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 group-hover:from-amber-200 group-hover:to-amber-400 transition-all duration-300`}>
                      {season.name}
                    </h2>
                    <div className="flex flex-row">
                      <div className="w-fit px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-indigo-200">
                        <span className="text-sm">{season.description}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className='pt-4 flex justify-center'>
                <motion.div 
                  className=" w-fit px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium flex items-center gap-1 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className='text-xl text-gray-300'> {season.nftCount} NFT left </span> 
                </motion.div>
              </div>

              {/* Buy Buttons */}
              <div className="mt-auto pt-4 flex justify-center">
                 {!season.nftCount || !season?.nfts?.[0] || !season.collectionNFTId ? (
                  <div className="px-4 py-2 rounded-lg bg-gray-800/80 text-gray-400 font-medium inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Sold Out
                  </div>
                ) : (
                  <div className=" p-3 rounded-lg">
                    <BuyNFTComponent refetch={refetch} collectionNFTId={season.collectionNFTId} nft={season.nfts[0]}/>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Empty state */}
        {seasonItems.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Collections Found</h3>
            <p className="text-gray-400 max-w-md">There are no NFT collections available at the moment. Please check back later.</p>
          </div>
        )}
        
        {/* Pagination */}
        <div className='mt-8 bg-indigo-900/30 p-4 rounded-xl border border-indigo-800/30'>
          <PaginationTable
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(seasonTotal / itemsPerPage))}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default MarketplacePage
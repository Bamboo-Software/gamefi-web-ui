/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion"
import bg_games from "@/assets/images/games/bg-games.png?url"
import Image from "@/components/image";
import {useMemo, useState } from "react";
import LoadingPage from "@/pages/LoadingPage";
import PaginationTable from '@/components/pagination-table';
import { userNFTApi } from '@/services/userNFT';

const UserNFTPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const {useGetAllUserNFTQuery} =  userNFTApi
  const {
    data: userNftData,
    isLoading,
    error,
  } = useGetAllUserNFTQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
  const userNftItems = useMemo(()=> userNftData?.data?.items || [], [userNftData])
  const userNftTotal = useMemo(()=> userNftData?.data?.total || 0, [userNftData])
  if (isLoading) return <LoadingPage />;
  if (error) return <div>Error getting nft</div>;
 
  return (
    <motion.div
      className="w-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Header with back button */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">Your NFT</span>
              <motion.span 
                className="ml-2 inline-block"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full"></div>
          </div>
        </div>

        {/* Grid of NFT items */}
        <div className="w-full relative rounded-2xl gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-stretch">
          {userNftItems.map(({status, nft}, index) => (
            <motion.div
              key={index}
              className={`relative p-5 rounded-xl flex flex-col bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-sm border border-amber-500/30 overflow-hidden group`}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.3)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="w-full aspect-square max-w-[200px] mx-auto">
                  <Image 
                    fallbackSrc={bg_games} 
                    className="w-full h-full rounded-lg object-cover shadow-lg ring-2 ring-amber-500/30 group-hover:ring-amber-400/70 transition-all duration-300" 
                    src={nft.image || bg_games} 
                    alt={nft.name || "NFT image"} 
                    animationVariant="zoom" 
                  />
                </div>
                <div className="w-full text-center">
                  <h2 className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-100 group-hover:from-amber-300 group-hover:to-amber-200 transition-all duration-300 mb-2">
                    {nft.name}
                  </h2>
                  <div className="mb-4 px-3 py-2 rounded-lg bg-amber-900/30 border border-amber-700/30 text-amber-200 mx-auto inline-block">
                    <span className="text-sm">{nft.description}</span>
                  </div>
                  
                  <div className="mt-4">
                    <span
                      className='p-2  rounded relative z-10 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-none shadow-lg shadow-amber-900/20 font-medium'
                    >
                      {status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Empty state */}
        {userNftItems.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-400 max-w-md">There are no NFTs available in this collection at the moment. Please check back later.</p>
          </div>
        )}
        
        {/* Pagination */}
        <div className='mt-8 bg-amber-900/30 p-4 rounded-xl border border-amber-800/30'>
          <PaginationTable
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(userNftTotal / itemsPerPage))}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default UserNFTPage
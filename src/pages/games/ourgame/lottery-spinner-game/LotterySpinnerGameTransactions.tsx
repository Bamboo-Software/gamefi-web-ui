/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { motion } from 'framer-motion'
import coin from '@/assets/icons/coin.svg'
import { useTranslation } from 'react-i18next'
import { useGetLotteryHistoryQuery } from '@/services/lottery'
import LoadingComponent from '@/components/loading-component'
import LotterySpinnerHistory from './LotterySpinnerHistory'

const PAGE_SIZE = 10

const LotterySpinnerGameTransactions = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [combinedData, setCombinedData] = useState<any[]>([])
  
  const { data, isLoading, isFetching, error } = useGetLotteryHistoryQuery(
    { page, limit: PAGE_SIZE },
   
  )

  useEffect(() => {
    if (page === 1) {
      setCombinedData([])
    }

    if (data?.data?.items) {
      setCombinedData(prev => {
        const newItems = data.data.items.filter(
          (          newItem: { _id: any }) => !prev.some(prevItem => prevItem._id === newItem._id)
        )
        return [...prev, ...newItems]
      })
      
      setHasMore(data.data.items.length === PAGE_SIZE)
    }
  }, [data, page])

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  if (isLoading && page === 1) return <LoadingComponent />
  if (error) return <div>{t('error.loading_data')}</div>

  const transactionsList = combinedData.map((transaction) => ({
    imgContent: coin,
    title: transaction.metadata.prize.prizeName,
    dialog: (
      <div className='flex flex-col space-y-2 items-end justify-center'>
        <p className='text-[#FFC800] font-semibold text-3xl'>
          +{transaction.earnPoints}
        </p>
        <p className='text-sm text-gray-100'>
          {new Date(transaction.createdAt).toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().timeZoneName, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    )
  }))

  return (
    <div className="w-full flex flex-col items-center overflow-scroll justify-center mt-2 px-2">
      <motion.p
        className="text-2xl font-semibold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("game.our_game.lottery_game.history.title")}
      </motion.p>

      <div className="w-full mt-6 overflow-auto h-[80vh]" id="scrollableDiv">
        <InfiniteScroll
          dataLength={combinedData.length}
          next={loadMore}
          hasMore={hasMore}
          loader={isFetching && <LoadingComponent />}
          endMessage={
            <p className="text-center  text-gray-100">
              {/* {t('common.no_more_data')} */}
              No More Data
            </p>
          }
          scrollableTarget="scrollableDiv"
        >
          <LotterySpinnerHistory 
            contents={transactionsList} 
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default LotterySpinnerGameTransactions;
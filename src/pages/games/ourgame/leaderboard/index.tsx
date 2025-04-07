/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { FaRankingStar } from "react-icons/fa6";
import GameDialog from "@/pages/games/components/GameDialog";
import { useGetGameLeaderboardQuery } from "@/services/game";
import { useEffect, useState } from "react";
import { IFilter } from "@/interfaces/IFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import CountdownTimer from "@/components/countdown";
import { getDisplayName } from "@/utils/user";

const LeaderboardDialog = ({ id, title, endDate }: { id: string; title: string; endDate?: Date }) => {
  const [leaderboardItems, setLeaderboardItems] = useState<unknown[]>([]);
  const [filter, setFilter] = useState<IFilter>({
    limit: 10,
    page: 1,
  });

  const { data, isError, isFetching } = useGetGameLeaderboardQuery({
    id,
    page: filter.page || 1,
    limit: filter.limit || 10,
  });

  useEffect(() => {
    if (data?.data?.items) {
      if (filter.page === 1) {
        setLeaderboardItems(data.data.items);
      } else {
        setLeaderboardItems((prev) => {
          const newItems = data.data.items.filter((item: any) => !prev.some((i: any) => i._id === item._id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, filter.page]);

  const hasMore = leaderboardItems.length < (data?.data?.total || 0);

  const loadMore = () => {
    if (!isFetching && hasMore) {
      setFilter((prev) => ({
        ...prev,
        page: (prev.page ?? 1) + 1,
      }));
    }
  };

  return (
    <div className="">
      <GameDialog
        dialogClassName={
          "border-4 w-[90%] bg-gradient-to-b from-[#1594B8]/95 via-[#47C3E6]/95 via-[#32BAE0]/95 via-[#1594B8]/95 via-[#13A0C8]/95 to-[#24E6F3]/95 rounded-xl"
        }
        title={
          <div className="flex flex-col items-center space-y-2">
            {title}
            <p className="text-xs my-1 mt-2">
              Your ranking:{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-semibold">
                #{data?.data?.currentUserRank ?? "Unknown"}
              </span>
            </p>
            {endDate && new Date(endDate) > new Date() && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-white">Ends in:</span>
                <CountdownTimer endDate={endDate} />
              </div>
            )}
          </div>
        }
        description={
          !isError ? (
            <div id="scrollableDiv" className="h-[25vh] overflow-auto">
              <InfiniteScroll
                dataLength={leaderboardItems.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<div className="text-center py-4">Loading more items...</div>}
                endMessage={
                  <p className="text-center py-4 text-white/70">
                    {leaderboardItems.length > 0
                      ? "You've reached the end of the leaderboard!"
                      : "No rankings available yet. Be the first!"}
                  </p>
                }
                scrollableTarget="scrollableDiv"
              >
                <div className="flex flex-col justify-center items-center w-full">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="py-2 px-4 text-center text-gray-100">#</th>
                        <th className="py-2 text-sm font-bold text-gray-100">Name</th>
                        <th className="py-2 px-4 text-xs font-bold text-gray-100 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardItems.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-2 px-4 text-center">
                            <div className="size-5 rounded-full bg-gray-100 flex justify-center items-center mx-auto">
                              <p className="text-xs font-bold text-gray-700">{index + 1}</p>
                            </div>
                          </td>
                          <td className="py-2 text-start text-sm font-bold text-gray-100 truncate max-w-xs">
                            {getDisplayName(item.user)}
                          </td>
                          <td className="py-2 px-4 text-xs font-bold text-gray-100 text-right">{item.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </InfiniteScroll>
            </div>
          ) : (
            <div>Error getting leaderboard</div>
          )
        }
        triggerBtn={
          <Button
            onClick={() => {}}
            className="rounded-full h-10 py-5 text-xs border-2 border-[#50D7EE] text-black font-sans w-fit bg-gradient-to-tr from-[#9CFF8F] via-[#92FDB9] to-[#83FEE4]"
            variant={"outline"}
            animation="bounce"
          >
            <span>{"Ranking"}</span>
            <FaRankingStar />
          </Button>
        }
      />
    </div>
  );
};

export default LeaderboardDialog;

import { createApi,  } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { IFilter } from "@/interfaces/IFilter";
import { baseQueryWithReauth } from "@/utils/baseQuery";

const reducerPath = "lotteryApi";
const endpoint = 'lottery';

export const lotteryApi = createApi({
    reducerPath,
    tagTypes: [InvalidatesTagsEnum.AUTH, InvalidatesTagsEnum.LOTTERY],
    baseQuery: baseQueryWithReauth(baseUrl),
    endpoints: (builder) => ({
      getLotteryPoints: builder.query({
        query: () => ({
          url: endpoint,
        }),
      }),
      getLotteryLeaderboard: builder.query({
        query: () => ({
          url: `${endpoint}/leaderboard`,
        }),
      }),
      getLotteryHistory: builder.query({
        query: (filter: IFilter) => {
          const params = new URLSearchParams(filter as Record<string, string>);
          return {
            url: `${endpoint}/history?${params.toString()}`,

          }
        },
        providesTags: [InvalidatesTagsEnum.LOTTERY]
      }),
      handleLotterySpin: builder.mutation({
        query: () => ({
          url: `${endpoint}/spin`,
          method: "POST",
        }),
        invalidatesTags: [InvalidatesTagsEnum.AUTH, InvalidatesTagsEnum.LOTTERY],
      }),
    }),
  });

export const {useGetLotteryLeaderboardQuery, useGetLotteryPointsQuery, useHandleLotterySpinMutation, useGetLotteryHistoryQuery} = lotteryApi;
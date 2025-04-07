import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { IFilter } from "@/interfaces/IFilter";
import { baseQueryWithReauth } from "@/utils/baseQuery";
import { SharePrizeRequest, SharePrizeResponse } from "@/interfaces/ISharePrize";
import { IWonItemsResponse } from "@/interfaces/IWonItems";
import { IItemsResponse } from "@/interfaces/IItems";

const reducerPath = "lotteryApi";
const endpoint = "lottery";

export const lotteryApi = createApi({
  reducerPath,
  tagTypes: [InvalidatesTagsEnum.AUTH, InvalidatesTagsEnum.LOTTERY, InvalidatesTagsEnum.LOTTERY_ITEMS],
  baseQuery: baseQueryWithReauth(baseUrl),
  endpoints: (builder) => ({
    // getLotteryPoints: builder.query({
    //   query: () => ({
    //     url: endpoint,
    //   }),
    // }),
    getLotteryLeaderboard: builder.query({
      query: () => ({
        url: `${endpoint}/leaderboard`,
      }),
    }),
    getLotteryHistory: builder.query({
      query: (filter: IFilter) => {
        const params = new URLSearchParams(filter as unknown as Record<string, string>);
        return {
          url: `${endpoint}/history?${params.toString()}`,
        };
      },
      providesTags: [InvalidatesTagsEnum.LOTTERY],
    }),
    handleLotterySpin: builder.mutation({
      query: () => ({
        url: `${endpoint}/spin`,
        method: "POST",
      }),
      invalidatesTags: [InvalidatesTagsEnum.AUTH, InvalidatesTagsEnum.LOTTERY, InvalidatesTagsEnum.LOTTERY_ITEMS],
    }),
    sharePrizeOnSocial: builder.mutation<SharePrizeResponse, SharePrizeRequest>({
      query: (body) => ({
        url: `${endpoint}/share-prize`,
        method: "POST",
        body,
      }),
      invalidatesTags: [InvalidatesTagsEnum.AUTH, InvalidatesTagsEnum.LOTTERY],
    }),
    getItems: builder.query<IItemsResponse, void>({
      query: () => ({
        url: `${endpoint}`,
      }),
    }),
    getWonItem: builder.query<IWonItemsResponse, IFilter>({
      query: (filter: IFilter) => {
        const params = new URLSearchParams(filter as unknown as Record<string, string>);
        return {
          url: `${endpoint}/won-items/token?${params.toString()}`,
        };
      },
      providesTags: [InvalidatesTagsEnum.LOTTERY_ITEMS],
    }),
  }),
});

export const {
  useGetLotteryLeaderboardQuery,
  // useGetLotteryPointsQuery,
  useHandleLotterySpinMutation,
  useGetLotteryHistoryQuery,
  useSharePrizeOnSocialMutation,
  useGetWonItemQuery,
  useGetItemsQuery
} = lotteryApi;

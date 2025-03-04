import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";

const reducerPath = "rewardTreeApi";
const endpoint = 'reward-tree';

export const rewardTreeApi = createApi({
  reducerPath,
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.REWARD_TREE, InvalidatesTagsEnum.AUTH],
  endpoints: (builder) => ({
    getRewardTree: builder.query({
      query: () => ({
        url: endpoint,
      }),
    providesTags: [InvalidatesTagsEnum.REWARD_TREE]
    }),
    handleWaterRewardTree: builder.mutation({
        query : () => ({
            url: `${endpoint}/water`,
            method: 'POST',
        }),
        invalidatesTags: [InvalidatesTagsEnum.REWARD_TREE]
    }),
    handleShakeRewardTree: builder.mutation({
        query : () => ({
            url: `${endpoint}/shake`,
            method: 'POST',
        }),
        invalidatesTags: [InvalidatesTagsEnum.REWARD_TREE, InvalidatesTagsEnum.AUTH]
    }),
  }),
});

export const { useGetRewardTreeQuery, useHandleShakeRewardTreeMutation, useHandleWaterRewardTreeMutation } = rewardTreeApi;

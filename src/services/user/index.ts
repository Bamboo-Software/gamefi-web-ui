import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";
import { IFilter } from "@/interfaces/IFilter";
import { ISettingResponse } from "@/interfaces/ISetting";

export interface IUserAirdropResponse {
data: {
  achievements: number;
  earnTasks: number;
  inviteFriends: number;
  lotterySpinner: number;
  passiveIncome: number;
}
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.USER, InvalidatesTagsEnum.SETTING],
  endpoints: (builder) => ({
    getUserAirdrop: builder.query<IUserAirdropResponse, void>({
      query: () => ({
        url: "user/earn-point-stats",
      }),
      providesTags: [InvalidatesTagsEnum.USER]
    }),
    handleDeleteAccount: builder.mutation({
      query: () => ({
        url: `user`,
        method: 'DELETE',
      })
    }),
    etLeaderBoard: builder.query({
      query: (filter: IFilter) => {
        const params = new URLSearchParams(filter as unknown as Record<string, string>);
        return {
          url: `user/leaderboard?${params.toString()}`,
        };
      },
    }),
    getUserSetting: builder.query<ISettingResponse, void>({
      query: () => ({
        url: `user/settings`,
      }),
      providesTags: [InvalidatesTagsEnum.SETTING],
    }),
  }),
});

export const { useGetUserAirdropQuery, useGetUserSettingQuery, useHandleDeleteAccountMutation } = userApi;

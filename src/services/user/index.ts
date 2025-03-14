import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";

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
  tagTypes: [InvalidatesTagsEnum.USER],
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
  }),
});

export const { useGetUserAirdropQuery, useHandleDeleteAccountMutation } = userApi;

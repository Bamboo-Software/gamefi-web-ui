/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";
import { ApiResponse } from "@/interfaces/IApiResponse";
import { IGamesPeriodResponse } from "@/interfaces/IGamePeriod";

export interface IGame {
  id?: string;
  _id?: string;
  title: string;
  description: string;
}

export interface IGameList {
  data: IGame[];
}

const reducerPath = "gamesApi";
const endpoint = "games";

export const gamesApi = createApi({
  reducerPath,
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.GAME],
  endpoints: (builder) => ({
    getGameList: builder.query<any, void>({
      query: () => ({
        url: `${endpoint}`,
      }),
      providesTags: [InvalidatesTagsEnum.GAME],
    }),
    getGameLeaderboard: builder.query({
      query: ({ id, limit, page }: { id: string; limit: number; page: number }) => ({
        url: `${endpoint}/leaderboard/${id}?limit=${limit}&page=${page}`,
      }),
      providesTags: [InvalidatesTagsEnum.GAME],
    }),
    handleGameScoreSubmit: builder.mutation({
      query: (body) => {
        return {
          url: `${endpoint}/submit`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: [InvalidatesTagsEnum.GAME],
    }),
    playGame: builder.mutation<ApiResponse<boolean>, { gameId: string }>({
      query: ({ gameId }) => {
        return {
          url: `${endpoint}/play/${gameId}`,
          method: "PUT",
        };
      },
      invalidatesTags: [InvalidatesTagsEnum.GAME],
    }),
    getGamesPeriod: builder.query<IGamesPeriodResponse, void>({
      query: () => ({
        url: `${endpoint}/period`,
      }),
    }),
  }),
});

export const {
  useGetGameListQuery,
  useGetGameLeaderboardQuery,
  useLazyGetGameLeaderboardQuery,
  useHandleGameScoreSubmitMutation,
  usePlayGameMutation,
  useGetGamesPeriodQuery,
} = gamesApi;

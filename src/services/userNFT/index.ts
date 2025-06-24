/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { baseQueryWithReauth } from "@/utils/baseQuery";
import { ApiResponse, PaginatedResponse } from "@/interfaces/IApiResponse";
import { InvalidatesTagsEnum } from '@/constants/invalidates-tags';
import { UserNFT } from '@/interfaces/user-nft';

const reducerPath = "userNftApi";
const endpoint = "user-nft";

export const userNFTApi = createApi({
  reducerPath,
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.USER_NFT],
  endpoints: (builder) => ({
    getAllUserNFT: builder.query<
      ApiResponse<PaginatedResponse<UserNFT[]>>,
      {
        page?: number;
        q?: string;
        limit?: number;
        offset?: number;
        orderField?: string;
        orderDirection?: string;
        seasonId?: string
      }
    >({
      query: ({ page, limit, offset, q, orderField, orderDirection }) => ({
        url: endpoint,
        method: "GET",
        params: {
          page,
          limit,
          offset,
          q,
          orderField,
          orderDirection,
        },
      }),
      providesTags: [InvalidatesTagsEnum.USER_NFT],
    }),
  }),
});
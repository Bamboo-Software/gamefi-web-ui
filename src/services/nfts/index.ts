/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { baseQueryWithReauth } from "@/utils/baseQuery";
import { ApiResponse, PaginatedResponse } from "@/interfaces/IApiResponse";
import { InvalidatesTagsEnum } from '@/constants/invalidates-tags';
import { NFT, SubmitTxHashRequest } from '@/interfaces/nfts';

const reducerPath = "nftApi";
const endpoint = "nfts";

export const nftApi = createApi({
  reducerPath,
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.NFT],
  endpoints: (builder) => ({
    getAllNFT: builder.query<
      ApiResponse<PaginatedResponse<NFT[]>>,
      {
        page?: number;
        q?: string;
        limit?: number;
        active?: string;
        offset?: number;
        orderField?: string;
        orderDirection?: string;
        seasonId?: string
      }
    >({
      query: ({ page, limit, offset, q, orderField, orderDirection, active, seasonId }) => ({
        url: endpoint,
        method: "GET",
        params: {
          page,
          limit,
          offset,
          q,
          orderField,
          orderDirection,
          active,
          seasonId
        },
      }),
      providesTags: [InvalidatesTagsEnum.NFT],
    }),
    submitTxHash: builder.mutation<void,SubmitTxHashRequest>({
      query: (data) => ({
        url: `${endpoint}/submit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [InvalidatesTagsEnum.NFT],
    }),
  }),
});
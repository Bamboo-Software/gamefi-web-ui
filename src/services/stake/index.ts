/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { baseQueryWithReauth } from "@/utils/baseQuery";
import { InvalidatesTagsEnum } from '@/constants/invalidates-tags';
import { SubmitTxHashRequest } from '@/interfaces/nfts';
import { ApiResponse, PaginatedResponse } from '@/interfaces/IApiResponse';
import { IStakeEntry } from '@/interfaces/stake';

const reducerPath = "stakingApi";
const endpoint = "staking";

export const stakeApi = createApi({
  reducerPath,
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.STAKE],
  endpoints: (builder) => ({
    submitTxHash: builder.mutation<void, SubmitTxHashRequest>({
      query: (data) => ({
        url: `${endpoint}/submit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [InvalidatesTagsEnum.STAKE],
    }),
    submitWithdrawTxHash: builder.mutation<void, SubmitTxHashRequest>({
      query: (data) => ({
        url: `${endpoint}/withdraw`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [InvalidatesTagsEnum.STAKE],
    }),
    getAllNFT: builder.query<
      ApiResponse<PaginatedResponse<IStakeEntry[]>>,
      {
        page?: number;
        q?: string;
        limit?: number;
        // active?: string;
        offset?: number;
        orderField?: string;
        orderDirection?: string;
      }
    >({
      query: ({ page, limit, offset, q, orderField, orderDirection,
        //  active 
        }) => ({
        url: endpoint,
        method: "GET",
        params: {
          page,
          limit,
          offset,
          q,
          orderField,
          orderDirection,
          // active,
        },
      }),
      providesTags: [InvalidatesTagsEnum.STAKE],
    }),
  }),
});
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { baseQueryWithReauth } from "@/utils/baseQuery";
import { ApiResponse, PaginatedResponse } from "@/interfaces/IApiResponse";
import { InvalidatesTagsEnum } from '@/constants/invalidates-tags';
import { Season } from '@/interfaces/seasons';

const reducerPath = "seasonApi";
const endpoint = "seasons";

export const seasonApi = createApi({
  reducerPath,
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.SEASON],
  endpoints: (builder) => ({
    getAllSeason: builder.query<
      ApiResponse<PaginatedResponse<Season[]>>,
      {
        page?: number;
        q?: string;
        limit?: number;
        active?: string;
        offset?: number;
        orderField?: string;
        orderDirection?: string;
        hasNFT?:string;
      }
    >({
      query: ({ page, limit, offset, q, orderField, orderDirection, active, hasNFT }) => ({
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
          hasNFT
        },
      }),
      providesTags: [InvalidatesTagsEnum.SEASON],
    }),
  }),
});



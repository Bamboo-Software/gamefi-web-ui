import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config"; 
import { IFilter } from "@/interfaces/IFilter";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";

const reducerPath = "referralApi";
const endpoint = 'referral';

export const referralApi = createApi({
    reducerPath,
    baseQuery: baseQueryWithReauth(baseUrl),
    tagTypes: [InvalidatesTagsEnum.AUTH],
    endpoints: (builder) => ({
      addReferral: builder.mutation({
        query: ({
          referralLink
        }: {
          referralLink: string;
        }) => ({
          url: `${endpoint}/add`,
          method: "POST",
          body: { referralLink },
        }),
        invalidatesTags: [InvalidatesTagsEnum.AUTH],
      }),
      getReferral: builder.query({
        query: () => ({
          url: `${endpoint}`,
        }),
      }),
      getReferralList: builder.query({
        query: (filter: IFilter) => {
          const params = new URLSearchParams(filter as Record<string, string>);
          return {
            url: `${endpoint}/list?${params.toString()}`,
          };
        },
      }),      
    }),
  });
  
  export const { useAddReferralMutation, useGetReferralListQuery, useGetReferralQuery } = referralApi;
  
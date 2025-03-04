import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";

const reducerPath = "airdropApi";
const endpoint = 'airdrop';

export const airdropApi = createApi({
  reducerPath,
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [ InvalidatesTagsEnum.AUTH],
  endpoints: (builder) => ({

    handleTapCoin: builder.mutation({
        query : ({tapCount} : {tapCount: number}) => ({
            url: `${endpoint}/tap`,
            method: 'POST',
            body: {tapCount}
        }),
        invalidatesTags: [InvalidatesTagsEnum.AUTH]
    })
  }),
});

export const { useHandleTapCoinMutation } = airdropApi;

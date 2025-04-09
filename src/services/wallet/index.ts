import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";
import { IAddWalletRequest, IAddWalletResponse } from "@/interfaces/wallet/IWallet";

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.WALLET],
  endpoints: (builder) => ({
    addWallet: builder.mutation<IAddWalletResponse, IAddWalletRequest>({
      query: (body) => ({
        url: `wallets`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAddWalletMutation } = walletApi;

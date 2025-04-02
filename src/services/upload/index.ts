import { createApi,  } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";

const reducerPath  = "uploadApi";
const endpoint = 'upload';

export const uploadApi = createApi({
  reducerPath,
  tagTypes: [InvalidatesTagsEnum.UPLOAD],
  baseQuery: baseQueryWithReauth(baseUrl),
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (file) => ({
        url: `${endpoint}`,
        method: "POST",
        body: file,
      }),
      invalidatesTags: [InvalidatesTagsEnum.UPLOAD],
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
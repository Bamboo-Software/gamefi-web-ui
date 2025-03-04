import { createApi } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { IFilter } from "@/interfaces/IFilter";
import { MissionTypeEnum, FrequencyEnum } from "@/enums/mission";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";
import { baseQueryWithReauth } from "@/utils/baseQuery";


const reducerPath = "tasksApi";
const endpoint = 'tasks';
interface IMissionFilter extends IFilter {
  type?: MissionTypeEnum,
  frequency?: FrequencyEnum
}

export const tasksApi = createApi({
  reducerPath,
  baseQuery: baseQueryWithReauth(baseUrl),
  tagTypes: [InvalidatesTagsEnum.TASKS,InvalidatesTagsEnum.AUTH],
  endpoints: (builder) => ({
    getMissions: builder.query({
      query: (filter: IMissionFilter) => {
        const params = new URLSearchParams(filter as Record<string, string>);
        return {
          url: `${endpoint}/earn?${params.toString()}`,
        };
      },
      providesTags: [InvalidatesTagsEnum.TASKS]
    }),
    startTask: builder.mutation({
      query: ({userTaskId}: {userTaskId: string}) => ({
        url: `${endpoint}/start/${userTaskId}`,
        method: 'PUT',
      }),
      invalidatesTags: [InvalidatesTagsEnum.TASKS],
    }),
    claimTask: builder.mutation({
      query: ({userTaskId}: {userTaskId: string}) => ({
        url: `${endpoint}/claim/${userTaskId}`,
        method: 'PUT',
      }),
      invalidatesTags: [InvalidatesTagsEnum.TASKS,InvalidatesTagsEnum.AUTH],
    })
  }),
});

export const { useGetMissionsQuery, useClaimTaskMutation, useStartTaskMutation } = tasksApi;
export type { IMissionFilter };

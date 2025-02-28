import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "@/configs/config";
import { InvalidatesTagsEnum } from "@/constants/invalidates-tags";

const reducerPath = "authApi";
const endpoint = 'auth';

export interface User {
  first_name: string;
  last_name: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Custom hook for managing auth token


export const authApi = createApi({
  reducerPath,
  tagTypes: [InvalidatesTagsEnum.AUTH],
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint === "getMe") {
        const storedToken = localStorage.getItem('auth-token');
        const token = storedToken ? JSON.parse(storedToken) : null;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<UserResponse, LoginRequest>({
      query: (body) => ({
        url: `${endpoint}/login`,
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("auth-token", JSON.stringify(data.token));
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => {
        localStorage.removeItem("auth-token");
        return { data: undefined };
      },
      invalidatesTags: [InvalidatesTagsEnum.AUTH],
    }),
    getMe: builder.query({
      query: () => ({
        url: `${endpoint}/me`,
      }),
      providesTags: [InvalidatesTagsEnum.AUTH],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;
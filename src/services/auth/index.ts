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
  data: {
    user: User;
    token: string;
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  timezone: string,
  ref?: string
}

export interface ResendAccountActivationRequest {
  email: string,
}

export interface RegisterResponse {
  message: string;
  token: string;
  success:boolean
}

export interface LoginResponse {
  message: string;
  token: string;
  success:boolean
}

export interface VerifyAccountRequest {
  code: string;
  token: string;
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
        if (storedToken) {
          headers.set("Authorization", `Bearer ${JSON.parse(storedToken).replace(/^"|"$/g, "")}`);
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
      // async onQueryStarted(_arg, { queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;
         
      //     localStorage.setItem("auth-token", JSON.parse(data.token));
      //   } catch (error) {
      //     console.error("Login error:", error);
      //   }
      // },
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: `${endpoint}/register`,
        method: "POST",
        body,
      })
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => {
        localStorage.removeItem("auth-token");
        return { data: undefined };
      },
      invalidatesTags: [InvalidatesTagsEnum.AUTH],
    }),
    resendAccountActivation: builder.mutation({
      query: (body) => ({
        url: `${endpoint}/resend-account-activation`,
        method: "POST",
        body,
      })
    }),
    verifyAccount: builder.mutation({
      query: (body) => ({
        url: `${endpoint}/verify-account`,
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          localStorage.setItem("auth-token", JSON.parse(data.data.token));
        } catch (error) {
          console.error("Login error:", error);
        }
      }
    }),
    loginSocial: builder.mutation({
      query: (body) => ({
        url: `${endpoint}/login-social`,
        method: "POST",
        body,
      })
    }),
    loginX: builder.query({
      query: () => ({
        url: `${endpoint}/login/x`,
      }),
    }),
    loginGoogle: builder.query({
      query: () => ({
        url: `${endpoint}/login/google`,
      }),
    }),
    loginFacebook: builder.query({
      query: () => ({
        url: `${endpoint}/login/facebook`,
      }),
    }),
    loginInstagram: builder.query({
      query: () => ({
        url: `${endpoint}/login/instagram`,
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: `${endpoint}/me`,
      }),
      providesTags: [InvalidatesTagsEnum.AUTH],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useRegisterMutation,
  useResendAccountActivationMutation,
  useVerifyAccountMutation,
  useLoginSocialMutation,
  useLoginXQuery,
  useLoginFacebookQuery,
  useLoginGoogleQuery,
  useLoginInstagramQuery,
  useGetMeQuery 
} = authApi;
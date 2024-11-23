import {TAuthCredentials} from "../../definitions/types/TAuthCredentials";
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {TAuthResponse} from "../../definitions/types/TAuthResponse";

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.yourapp.com',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<TAuthResponse, TAuthCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<TAuthResponse, TAuthCredentials>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getUser: builder.query<any, void>({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    // Добавьте другие endpoints здесь
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
} = apiSlice;
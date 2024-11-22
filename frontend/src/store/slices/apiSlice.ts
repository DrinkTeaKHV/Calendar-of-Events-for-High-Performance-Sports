import {TAuthCredentials} from "../../definitions/types/TAuthCredentials";
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {TAuthResponse} from "../../definitions/types/TAuthResponse";
import {RootState} from '../store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.yourapp.com',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
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
    }),
    // Добавьте другие эндпоинты здесь
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery
} = apiSlice;
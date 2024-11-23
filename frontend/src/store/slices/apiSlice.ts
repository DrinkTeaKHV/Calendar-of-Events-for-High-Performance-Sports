import {TAuthCredentials} from "../../definitions/types/TAuthCredentials";
import {TEventsResponse} from "../../definitions/types/TEventsResponse";
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {TAuthResponse} from "../../definitions/types/TAuthResponse";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: REACT_APP_API_URL,
  // prepareHeaders: (headers) => {
  //   const token = localStorage.getItem('token');
  //
  //   if (token) {
  //     headers.set('Authorization', `Bearer ${token}`);
  //   }
  //
  //   return headers;
  // },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['User', 'Events'],
  endpoints: (builder) => ({
    login: builder.mutation<TAuthResponse, TAuthCredentials>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    getEvents: builder.query<TEventsResponse, void>({
      query: () => '/events/',
      providesTags: ['Events'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetEventsQuery
} = apiSlice;
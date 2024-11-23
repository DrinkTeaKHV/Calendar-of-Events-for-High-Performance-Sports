import {TAuthCredentials} from "../../definitions/types/TAuthCredentials";
import {TEventsResponse} from "../../definitions/types/TEventsResponse";
import {createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {TAuthResponse} from "../../definitions/types/TAuthResponse";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: REACT_APP_API_URL,
  // Uncomment and modify if you need to set headers
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
    getEvents: builder.query<TEventsResponse, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 10 }) => `/events/?page=${page}&page_size=${pageSize}`,
      providesTags: ['Events'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetEventsQuery,
} = apiSlice;
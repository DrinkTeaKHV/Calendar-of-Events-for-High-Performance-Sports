import {TAuthCredentials} from "../../definitions/types/TAuthCredentials";
import {TFiltersResponse} from "../../definitions/types/TFiltersResponse";
import {TEventsResponse} from "../../definitions/types/TEventsResponse";
import {createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {TAuthResponse} from "../../definitions/types/TAuthResponse";
import {TEventsParams} from "../../definitions/types/TEventsParams";

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
  tagTypes: ['User', 'Events', 'Filters'],
  endpoints: (builder) => ({
    login: builder.mutation<TAuthResponse, TAuthCredentials>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    getEvents: builder.query<TEventsResponse, TEventsParams>({
      query: ({ page, pageSize, sport, location, participantsCount }) => {
        const params = new URLSearchParams();

        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        if (sport) params.append('sport', sport);
        if (location) params.append('location', location);
        if (participantsCount) params.append('participantsCount', participantsCount.toString());

        return {
          url: `/events?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Events'],
    }),
    getFilters: builder.query<TFiltersResponse, void>({
      query: () => `/events/filter-options/`,
      providesTags: ['Filters'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetEventsQuery,
  useGetFiltersQuery,
} = apiSlice;
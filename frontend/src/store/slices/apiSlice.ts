import { TAuthCredentials } from "../../definitions/types/TAuthCredentials";
import { TEventsResponse } from "../../definitions/types/TEventsResponse";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAuthResponse } from "../../definitions/types/TAuthResponse";
import { TNotificationSettings } from "../../definitions/types/TNotificationSettings";
import {TFilterOptionsResponse} from "../../definitions/types/TFilterResponse";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: REACT_APP_API_URL,
  credentials: 'include', // Для работы с куками
  prepareHeaders: (headers) => {
    const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['User', 'Events', 'NotificationSettings', 'filters'],
  endpoints: (builder) => ({
    login: builder.mutation<TAuthResponse, TAuthCredentials>({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    getEvents: builder.query<TEventsResponse, void>({
      query: () => '/events/',
      providesTags: ['Events'],
    }),
    getFilters: builder.query<TFilterOptionsResponse, void>({
      query: () => '/events/filter-options/',
      providesTags: ['filters'],
    }),
    updateNotificationSettings: builder.mutation<void, TNotificationSettings>({
      query: (settings) => ({
        url: '/settings/notifications/',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['NotificationSettings'],
    }),
    getNotificationSettings: builder.query<TNotificationSettings, void>({
      query: () => '/settings/notifications/',
      providesTags: ['NotificationSettings'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetEventsQuery,
  useGetFiltersQuery,
  useUpdateNotificationSettingsMutation,
  useGetNotificationSettingsQuery,
} = apiSlice;

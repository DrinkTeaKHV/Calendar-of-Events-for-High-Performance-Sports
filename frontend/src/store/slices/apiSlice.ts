import { TAuthCredentials } from "../../definitions/types/TAuthCredentials";
import { TEventsResponse } from "../../definitions/types/TEventsResponse";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAuthResponse } from "../../definitions/types/TAuthResponse";
import {TEventsParams} from "../../definitions/types/TEventsParams";
import { TNotificationSettings } from "../../definitions/types/TNotificationSettings";
import {TFiltersResponse} from "../../definitions/types/TFiltersResponse";

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
  tagTypes: ['User', 'Events', 'Filters', 'NotificationSettings'],
  endpoints: (builder) => ({
    // Аутентификация
    login: builder.mutation<TAuthResponse, TAuthCredentials>({
      query: (credentials) => ({
        url: '/login/',
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
    // Получение настроек уведомлений
    getNotificationSettings: builder.query<TNotificationSettings, void>({
      query: () => '/settings/notifications/',
      providesTags: ['NotificationSettings'],
    }),
    // Обновление настроек уведомлений
    updateNotificationSettings: builder.mutation<void, TNotificationSettings>({
      query: (settings) => ({
        url: '/settings/notifications/',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['NotificationSettings'],
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
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetFiltersQuery,
} = apiSlice;
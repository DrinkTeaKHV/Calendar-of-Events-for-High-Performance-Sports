import { TAuthCredentials } from "../../definitions/types/TAuthCredentials";
import { TEventsResponse } from "../../definitions/types/TEventsResponse";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAuthResponse } from "../../definitions/types/TAuthResponse";
import {TEventsParams} from "../../definitions/types/TEventsParams";
import { TNotificationSettings } from "../../definitions/types/TNotificationSettings";
import {TFiltersResponse} from "../../definitions/types/TFiltersResponse";
import {TSport} from "../../definitions/types/TSport";

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
  tagTypes: ['User', 'Events', 'Filters', 'NotificationSettings', 'Sports'],
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
      query: ({ page, pageSize, sport, location, participantsCount, competitionType, genders }) => {
        const params = new URLSearchParams();

        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        if (sport) params.append('sport_type', sport);
        if (location) params.append('location', location);
        if (participantsCount) params.append('max_participants_count', participantsCount.toString());
        if (competitionType) params.append('competition_type', competitionType);
        if (genders) params.append('genders', genders);

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
    // получение видов спорта
    getSports: builder.query<TSport[], void>({
      query: () => '/sports/',
      providesTags: ['Sports'],
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
  useGetSportsQuery,
  useUpdateNotificationSettingsMutation,
  useGetFiltersQuery,
} = apiSlice;
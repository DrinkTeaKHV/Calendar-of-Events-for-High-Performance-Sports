import { TAuthCredentials } from "../../definitions/types/TAuthCredentials";
import { TEventsResponse } from "../../definitions/types/TEventsResponse";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAuthResponse } from "../../definitions/types/TAuthResponse";
import { TNotificationSettings } from "../../definitions/types/TNotificationSettings";

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
  tagTypes: ['User', 'Events', 'NotificationSettings'],
  endpoints: (builder) => ({
    // Аутентификация
    login: builder.mutation<TAuthResponse, TAuthCredentials>({
      query: (credentials) => ({
        url: '/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    // Получение событий
    getEvents: builder.query<TEventsResponse, void>({
      query: () => '/events/',
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
  }),
});

export const {
  useLoginMutation,
  useGetEventsQuery,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = apiSlice;

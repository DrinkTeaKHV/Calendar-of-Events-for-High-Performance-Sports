import { TAuthCredentials } from "../../definitions/types/TAuthCredentials";
import { TEventsResponse } from "../../definitions/types/TEventsResponse";
import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react';
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

// Типизированный baseQueryWithReauth
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Перенаправление на страницу логина
    window.location.href = '/login';
  }

  return result;
};


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
    addToFavorites: builder.mutation<void, { event: number }>({
      query: (body) => ({
        url: '/favorite-events/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Events'], // Для обновления списка, если нужно
    }),
    getEvents: builder.query<TEventsResponse, TEventsParams>({
      query: ({ page, pageSize, sport, location, participantsCount, competitionType, gender, start_date, end_date, ordering,  q }) => { // Include 'q'
        const params = new URLSearchParams();

        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        if (sport) params.append('sport_type', sport);
        if (location) params.append('location', location);
        if (participantsCount) params.append('max_participants_count', participantsCount.toString());
        if (competitionType) params.append('competition_type', competitionType);
        if (gender) params.append('gender', gender);
        if (start_date)  params.append('start_date', start_date);
        if (end_date)  params.append('end_date', end_date);
        if (q) params.append('q', q);
        if (ordering) params.append('ordering', ordering);

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
  useAddToFavoritesMutation,
  useGetFiltersQuery,
} = apiSlice;
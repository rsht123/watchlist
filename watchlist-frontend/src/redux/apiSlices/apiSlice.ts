import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appConfig } from '../../appConfig';

const baseQuery = fetchBaseQuery({
  baseUrl: `${appConfig.baseUrl}`,
  prepareHeaders: (headers: Headers) => {
    const token = localStorage.getItem(appConfig.localStorageKey);
    if (!token) return headers;
    const headerValue = `Bearer ${token}`;
    headers.set('Authorization', headerValue);
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Title', 'Person', 'List', 'User', 'Season'],
  keepUnusedDataFor: 5,
  endpoints: () => ({}),
});

import { Media } from '../../interfaces';
import {
  AllListsQuery,
  DiscoverFields,
  IdType,
  PaginatedResults,
  SearchIdFields,
  SearchQuery,
  TrendingQuery,
} from '../../interfaces/Search';
import { apiSlice } from './apiSlice';

export const searchSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<PaginatedResults<Media>, SearchQuery>({
      query: ({ searchType, searchQuery, page }) => ({
        url: '/search/tmdb/',
        params: {
          type: searchType,
          query: searchQuery,
          page,
        },
      }),
      providesTags: ['Title'],
    }),
    trending: builder.query<PaginatedResults<Media>, TrendingQuery>({
      query: ({ type, window }) => ({
        url: '/search/trending/',
        params: {
          type,
          window,
        },
      }),
    }),
    allLists: builder.query<PaginatedResults<Media>, AllListsQuery>({
      query: ({ type, listType, page }) => ({
        url: '/search/lists/',
        params: {
          type,
          listType,
          page,
        },
      }),
    }),
    discover: builder.query<PaginatedResults<Media>, DiscoverFields>({
      query: ({ titleType, ...fields }) => ({
        url: `/search/discover/${titleType}`,
        params: fields,
      }),
    }),
    searchIds: builder.query<PaginatedResults<IdType>, SearchIdFields>({
      query: ({ searchValue, field, titleType }) => ({
        url: '/search/ids',
        params: {
          searchValue,
          field,
          titleType,
        },
      }),
    }),
  }),
});

export const {
  useLazySearchQuery,
  useLazyTrendingQuery,
  useLazyAllListsQuery,
  useLazyDiscoverQuery,
  useLazySearchIdsQuery,
} = searchSlice;

import { Media } from '../../interfaces';
import { ListDetails } from '../../interfaces/ListDetails';
import { PaginatedResults } from '../../interfaces/Search';
import { apiSlice } from './apiSlice';

export const accountSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchWatchlist: builder.query<
      PaginatedResults<Media>,
      { type: string; page: number }
    >({
      query: ({ type, page }) => ({
        url: `/account/watchlist/${type}`,
        params: {
          page,
        },
      }),
    }),
    fetchFavorites: builder.query<
      PaginatedResults<Media>,
      { type: string; page: number }
    >({
      query: ({ type, page }) => ({
        url: `/account/favorite/${type}`,
        params: {
          page,
        },
      }),
    }),
    fetchAccountLists: builder.query<PaginatedResults<Media>, number>({
      query: (page) => ({
        url: `/account/lists`,
        params: {
          page,
        },
      }),
    }),
    fetchList: builder.query<
      ListDetails<Media>,
      { listId: string; page: number }
    >({
      query: ({ listId, page }) => ({
        url: `/account/lists/${listId}`,
        params: {
          page,
        },
      }),
    }),
  }),
});

export const {
  useLazyFetchWatchlistQuery,
  useLazyFetchFavoritesQuery,
  useFetchAccountListsQuery,
  useFetchListQuery,
} = accountSlice;

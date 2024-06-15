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
    createList: builder.mutation<void, { name: string; desc: string }>({
      query: ({ name, desc }) => ({
        url: `/account/lists/create`,
        method: 'post',
        body: {
          name,
          desc,
        },
      }),
    }),
    deleteList: builder.mutation({
      query: (listId: number) => ({
        url: '/account/lists/delete',
        method: 'delete',
        params: {
          listId,
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
  useCreateListMutation,
  useDeleteListMutation,
} = accountSlice;

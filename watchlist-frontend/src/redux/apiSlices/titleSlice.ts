import { CollectionDetails } from '../../interfaces/Collection';
import { MovieDetails } from '../../interfaces/Movie';
import { FetchTitleQuery } from '../../interfaces/Title';
import {
  Episode,
  EpisodeQuery,
  SeasonDetails,
  SeasonQuery,
  TvDetails,
} from '../../interfaces/Tv';
import { ImdbRating } from '../slices/stateSlice';
import { apiSlice } from './apiSlice';

export const titleSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchTitle: builder.query<MovieDetails | TvDetails, FetchTitleQuery>({
      query: ({ media_type, media_id }) => ({
        url: '/title/fetch',
        params: {
          media_id,
          media_type,
        },
      }),
      providesTags: ['Title'],
    }),
    // Not being used, might use later;
    // fetchCastInfo: builder.query<Credits, AdditionalInfoQuery>({
    //   query: ({ media_id, media_type, info_type }) => ({
    //     url: '/title/info',
    //     params: {
    //       media_id,
    //       media_type,
    //       info_type,
    //     },
    //   }),
    // }),
    // fetchAdditionalInfo: builder.query<
    //   PaginatedResults<Media>,
    //   AdditionalInfoQuery
    // >({
    //   query: ({ media_id, media_type, info_type }) => ({
    //     url: '/title/info',
    //     params: {
    //       media_id,
    //       media_type,
    //       info_type,
    //     },
    //   }),
    // }),
    fetchImdbRating: builder.mutation<ImdbRating[], string[]>({
      query: (imdb_ids) => ({
        url: '/title/imdb_rating',
        method: 'post',
        body: { imdb_ids },
      }),
    }),
    fetchCollection: builder.query<CollectionDetails, number>({
      query: (collectionId) => ({
        url: '/title/collection',
        params: {
          collection_id: collectionId,
        },
      }),
    }),
    fetchSeason: builder.query<SeasonDetails, SeasonQuery>({
      query: ({ media_id, season_number }) => ({
        url: 'title/season',
        params: {
          media_id,
          season_number,
        },
      }),
      providesTags: (_result, _error, data) => [
        'Season',
        { type: 'Season', id: `${data.media_id}-${data.season_number}` },
      ],
      keepUnusedDataFor: 30,
    }),
    fetchEpisodeDetails: builder.query<Episode, EpisodeQuery>({
      query: ({ media_id, season_number, episode_number }) => ({
        url: `title/episode`,
        params: {
          media_id,
          season_number,
          episode_number,
        },
      }),
    }),
    fetchPersonDetails: builder.query({
      query: (person_id: string) => ({
        url: 'title/person',
        params: {
          person_id,
        },
      }),
    }),
    fetchCreditDetails: builder.query({
      query: (credit_id: string) => ({
        url: 'title/credit',
        params: {
          credit_id,
        },
      }),
    }),
  }),
});

export const {
  useFetchTitleQuery,
  useFetchImdbRatingMutation,
  useFetchCollectionQuery,
  useLazyFetchCollectionQuery,
  useFetchSeasonQuery,
  useFetchEpisodeDetailsQuery,
  useFetchPersonDetailsQuery,
  useFetchCreditDetailsQuery,
} = titleSlice;

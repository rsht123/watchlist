import { createSlice } from '@reduxjs/toolkit';
import { DatePickerProps, PaginationProps } from 'antd';
import { MediaTypesEnum, MediaTypes } from '../../interfaces';
import { keys } from 'lodash';

export interface SearchType {
  pagination: PaginationProps;
  searchType: MediaTypes;
  searchQuery: string;
}

// TODO: create new interface for this
export const discoverFields = [
  { type: 'string', key: 'with_companies', help: true },
  { type: 'string', key: 'with_people', help: true },
  { type: 'string', key: 'with_keywords', help: true },
  { type: 'string', key: 'with_genres', help: true },
  { type: 'string', key: 'with_origin_country' },
  { type: 'string', key: 'with_original_language' },
  { type: 'string', key: 'vote_count.gte' },
  { type: 'string', key: 'vote_count.lte' },
  { type: 'string', key: 'vote_average.gte' },
  { type: 'string', key: 'vote_average.lte' },
  { type: 'string', key: 'with_runtime.gte' },
  { type: 'string', key: 'with_runtime.lte' },
  { type: 'date', key: 'year' },
  { type: 'date', key: 'release_date.gte' },
  { type: 'date', key: 'release_date.lte' },
  { type: 'select', key: 'titleType', options: ['movie', 'tv'] },
  {
    type: 'select',
    key: 'sort_by',
    options: [
      'popularity.desc',
      'popularity.asc',
      'revenue.desc',
      'revenue.asc',
      'primary_release_date.desc',
      'primary_release_date.asc',
      'vote_average.desc',
      'vote_average.asc',
      'vote_count.desc',
      'vote_count.asc',
    ],
  },
];

export type DateType = DatePickerProps['value'];

interface AllFields {
  [key: string]: string | DateType | number;
}

const allFields: AllFields = {};
discoverFields.forEach((field) => {
  allFields[field.key] = '';
  if (field.key === 'titleType') {
    allFields[field.key] = MediaTypesEnum.MOVIE;
  }
  if (field.key === 'sort_by') {
    allFields[field.key] = 'popularity.desc';
  }
  if (field.type === 'date') {
    allFields[field.key] = null;
  }
});

export interface StatePagination {
  current: number;
  total: number;
  pageSize: number;
}

export interface ImdbRating {
  imdb_id: string;
  rating: string;
  votes: string;
}

export interface ImdbRatingObj {
  [key: string]: ImdbRating;
}

export interface InitialState {
  search: {
    searchQuery: string;
    searchType: MediaTypes;
    pagination: StatePagination;
  };
  trending: {
    type: MediaTypes;
    window: string;
  };
  lists: {
    pagination: StatePagination;
    type: MediaTypes;
    listType: string;
  };
  discover: {
    pagination: StatePagination;
    allFields: AllFields;
  };
  watchlist: {
    type: MediaTypes;
    pagination: StatePagination;
  };
  favorite: {
    type: MediaTypes;
    pagination: StatePagination;
  };
  userLists: {
    pagination: StatePagination;
  };
  imdb_ratings: {
    imdb_ids: ImdbRatingObj;
    current_imdb_id_ratings: ImdbRating | null;
  };
}

const initialState: InitialState = {
  search: {
    pagination: {
      current: 1,
      total: 1,
      pageSize: 20,
    },
    searchQuery: '',
    searchType: MediaTypesEnum.MULTI,
  },
  trending: {
    type: MediaTypesEnum.MOVIE,
    window: 'week',
  },
  lists: {
    pagination: {
      current: 1,
      total: 1,
      pageSize: 20,
    },
    type: MediaTypesEnum.MOVIE,
    listType: 'popular',
  },
  discover: {
    pagination: {
      current: 1,
      total: 1,
      pageSize: 20,
    },
    allFields,
  },
  watchlist: {
    type: MediaTypesEnum.MOVIE,
    pagination: {
      current: 1,
      total: 1,
      pageSize: 20,
    },
  },
  favorite: {
    type: MediaTypesEnum.MOVIE,
    pagination: {
      current: 1,
      total: 1,
      pageSize: 20,
    },
  },
  userLists: {
    pagination: {
      current: 1,
      total: 1,
      pageSize: 20,
    },
  },
  imdb_ratings: {
    imdb_ids: {},
    current_imdb_id_ratings: null,
  },
};

const stateSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveSearchPagination: (state, action) => {
      const search = action.payload;
      state.search = search;
      return state;
    },
    saveTrendingOptions: (state, action) => {
      const trending = action.payload;
      state.trending = trending;
      return state;
    },
    saveListOptions: (state, action) => {
      const lists = action.payload;
      state.lists = lists;
      return state;
    },
    saveDiscoverFields: (state, action) => {
      const discover = action.payload;
      state.discover = discover;
      return state;
    },
    saveUserListsOptions: (state, action) => {
      const userLists = action.payload;
      state.userLists = userLists;
      return state;
    },
    saveWatchlistOptions: (state, action) => {
      const watchlist = action.payload;
      state.watchlist = watchlist;
      return state;
    },
    saveFavoriteOptions: (state, action) => {
      const watchlist = action.payload;
      state.watchlist = watchlist;
      return state;
    },
    loadImdbRating: (state, action) => {
      const imdb_id = action.payload;
      const imdb_ids = state.imdb_ratings.imdb_ids;
      if (imdb_ids[imdb_id]) {
        state.imdb_ratings.current_imdb_id_ratings = imdb_ids[imdb_id];
      }
      return state;
    },
    setLocalImdbRatings: (state, action) => {
      const imdb_ratings = action.payload;
      const imdb_ids = keys(action.payload);
      const state_imdb_ids = state.imdb_ratings.imdb_ids;

      imdb_ids.forEach((id) => {
        if (!state_imdb_ids[id]) {
          state_imdb_ids[id] = imdb_ratings[id];
        }
      });
      state.imdb_ratings.imdb_ids = state_imdb_ids;
      return state;
    },
    removeCurrentImdbRating: (state) => {
      state.imdb_ratings.current_imdb_id_ratings = null;
      return state;
    },
  },
});

export const {
  saveSearchPagination,
  saveTrendingOptions,
  saveListOptions,
  saveDiscoverFields,
  saveWatchlistOptions,
  saveFavoriteOptions,
  saveUserListsOptions,
  loadImdbRating,
  setLocalImdbRatings,
  removeCurrentImdbRating,
} = stateSlice.actions;

export default stateSlice.reducer;

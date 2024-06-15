export interface SearchQuery {
  searchType: string;
  searchQuery: string;
  page: number;
}

export interface TrendingQuery {
  type: string;
  window: string;
}

export interface AllListsQuery {
  type: string;
  listType: string;
  page: number;
}

export interface DiscoverFields {
  [key: string]: string | number;
}

export interface SearchIdFields {
  searchValue: string;
  titleType: string;
  field: string;
}

export interface IdType {
  id: number;
  name: string;
}

export interface SearchIds {
  genres?: IdType;
  results?: IdType;
}

export interface PaginatedResults<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

import { MediaTypesEnum } from '.';
import { Movie } from './Movie';

export interface Collection {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: MediaTypesEnum.COLLECTION;
}

export interface CollectionDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  media_type: MediaTypesEnum.COLLECTION_DETAILS;
  parts: Movie[];
}

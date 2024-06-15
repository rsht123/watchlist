import { MediaTypesEnum } from '.';
import { Credits } from './Credits';
import { PaginatedResults } from './Search';
import { Genre, Keyword } from './Title';
import { TvSeries } from './Tv';

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: MediaTypesEnum.MOVIE;
  genre_ids: number[];
  popularity: number;
  release_date?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface CollectionInfo {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

// Add Account States
export interface MovieDetails extends Movie {
  external_ids: { imdb_id: string };
  belongs_to_collection: CollectionInfo | null;
  budget: number;
  homepage: string;
  imdb_id: string;
  release_date: string;
  revenue: number;
  status: string;
  tagline: string;
  runtime: number;
  genres: Genre[];
  keywords: {
    keywords: Keyword[];
  };
  credits: Credits;
  recommendations?: PaginatedResults<Movie | TvSeries>;
  production_companies: ProductionCompanies[];
  production_countries: ProductionCountries[];
  spoken_languages: SpokenLanguages[];
}

interface ProductionCompanies {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCountries {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguages {
  english_name: string;
  iso_639_1: string;
  name: string;
}

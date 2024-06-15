import { MediaTypesEnum } from '.';
import { Cast, Credits, Crew } from './Credits';
import { Movie } from './Movie';
import { PaginatedResults } from './Search';
import { Genre, Keyword } from './Title';

export interface TvSeries {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  media_type: MediaTypesEnum.TV;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
  media_type: MediaTypesEnum.SEASON;
}

export interface TvDetails extends TvSeries {
  external_ids: { imdb_id: string };
  status: string;
  number_of_episodes: number;
  number_of_seasons: number;
  episode_run_time: number[];
  last_episode_to_air: { runtime: number };
  genres: Genre[];
  keywords: {
    results: Keyword[];
  };
  seasons: Season[];
  aggregate_credits: Credits;
  recommendations?: PaginatedResults<Movie | TvSeries>;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  imdb_id: string;
  crew: Crew[];
  guest_stars: Cast[];
  info_type: SeasonInfoEnum.EPISODE;
}

export interface SeasonDetails {
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
  info_type: SeasonInfoEnum.SEASON;
}

export interface SeasonQuery {
  media_id: string;
  season_number: string;
}

export interface EpisodeQuery {
  media_id: string;
  season_number: string;
  episode_number: string;
}

export type SeasonInfoTypes = SeasonDetails | Episode;

export enum SeasonInfoEnum {
  SEASON = 'season',
  EPISODE = 'episode',
}

import { Collection, CollectionDetails } from './Collection';
import { Company } from './Company';
import { Movie } from './Movie';
import { Person } from './Person';
import { Season, TvSeries } from './Tv';

// TODO: check all types

export type MediaTypes =
  | MediaTypesEnum.MOVIE
  | MediaTypesEnum.TV
  | MediaTypesEnum.PERSON
  | MediaTypesEnum.PERSON
  | MediaTypesEnum.COLLECTION
  | MediaTypesEnum.MULTI
  | MediaTypesEnum.LIST
  | MediaTypesEnum.COLLECTION_DETAILS
  | MediaTypesEnum.SEASON
  | MediaTypesEnum.EPISODE;

export enum MediaTypesEnum {
  MOVIE = 'movie',
  TV = 'tv',
  PERSON = 'person',
  COMPANY = 'company',
  COLLECTION = 'collection',
  COLLECTION_DETAILS = 'collection_details',
  MULTI = 'multi',
  LIST = 'list',
  SEASON = 'season',
  EPISODE = 'episode',
}

export interface List {
  id: string;
  backdrop_path: string;
  name: string;
  updated_at: string;
  number_of_items: number;
  media_type: MediaTypesEnum.LIST;
}

export type Multi = Movie | TvSeries | Person;

export type Media =
  | Multi
  | Movie
  | TvSeries
  | Person
  | Company
  | Collection
  | List
  | CollectionDetails
  | Season;

export type ListTitleOptionKeys =
  | MediaTypesEnum.MOVIE
  | MediaTypesEnum.TV
  | MediaTypesEnum.PERSON;

export type Options = {
  [key in ListTitleOptionKeys]: string[];
};

import { MediaTypesEnum } from '.';

export enum CreditTypesEnum {
  CAST = 'cast',
  CREW = 'crew',
}

export type CreditTypes = CreditTypesEnum.CAST | CreditTypesEnum.CREW;

interface CommonCreditAttr {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}

export interface MovieCast extends CommonCreditAttr {
  cast_id: number;
  character: string;
  credit_id: string;
  name: string;
  order: number;
  credit_type: CreditTypesEnum.CAST;
  media_type: MediaTypesEnum.MOVIE;
}

export interface PersonCast extends CommonCreditAttr {
  title: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
  credit_type: CreditTypesEnum.CAST;
  media_type: MediaTypesEnum.PERSON;
  poster_path: string;
}

export interface MovieCrew extends CommonCreditAttr {
  department: string;
  job: string;
  name: string;
  credit_id: string;
  credit_type: CreditTypesEnum.CREW;
  media_type: MediaTypesEnum.MOVIE;
}

export interface PersonCrew extends CommonCreditAttr {
  title: string;
  department: string;
  job: string;
  credit_id: string;
  credit_type: CreditTypesEnum.CREW;
  media_type: MediaTypesEnum.PERSON;
  poster_path: string;
}

export interface Role {
  credit_id: string;
  character: string;
  episode_count: number;
}

export interface Job {
  credit_id: string;
  job: string;
  episode_count: number;
}

export interface TVCast extends CommonCreditAttr {
  roles: Role[];
  order: number;
  name: string;
  total_episode_count: number;
  credit_type: CreditTypesEnum.CAST;
  media_type: MediaTypesEnum.TV;
}

export interface TVCrew extends CommonCreditAttr {
  jobs: Job[];
  name: string;
  total_episode_count: number;
  credit_type: CreditTypesEnum.CREW;
  media_type: MediaTypesEnum.TV;
}

export type Cast = MovieCast | TVCast | PersonCast;
export type Crew = MovieCrew | TVCrew | PersonCrew;

export type CreditType = Cast | Crew;

export interface Credits {
  id?: number;
  cast: Cast[];
  crew: Crew[];
}

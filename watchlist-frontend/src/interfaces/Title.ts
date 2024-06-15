import { MediaTypesEnum } from '.';
import { Movie } from './Movie';
import { TvSeries } from './Tv';

export interface FetchTitleQuery {
  media_type: string;
  media_id: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface AdditionalInfoQuery {
  titles: (Movie | TvSeries)[];
  media_type: MediaTypesEnum;
  info_type: string;
}

import { Expose, Type } from 'class-transformer';

export class SearchDto {
  @Expose()
  title: string;

  @Expose()
  name: string;

  @Expose()
  id: number;

  @Expose()
  media_type: string;

  @Expose()
  first_air_date: string;

  @Expose()
  release_date: string;

  @Expose()
  updated_at: string;

  @Expose()
  vote_average: number;

  @Expose()
  popularity: number;

  @Expose()
  poster_path: string;

  @Expose()
  profile_path: string;

  @Expose()
  logo_path: string;

  @Expose()
  known_for_department: string;

  @Expose()
  number_of_items: string;
}

export class SearchResultsDto {
  @Expose()
  @Type(() => SearchDto)
  results: SearchDto;

  @Expose()
  total_pages: number;

  @Expose()
  total_results: number;

  @Expose()
  page: number;
}

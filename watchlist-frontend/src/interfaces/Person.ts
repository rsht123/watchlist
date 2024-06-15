import { MediaTypesEnum } from '.';

export interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: object[];
  media_type: MediaTypesEnum.PERSON;
  external_ids?: { imdb_id: string };
  biography: string;
}

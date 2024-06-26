import { MediaTypesEnum } from '.';

export interface Company {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
  media_type: MediaTypesEnum.COMPANY;
}

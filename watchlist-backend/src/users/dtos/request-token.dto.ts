import { Expose } from 'class-transformer';

export class TmdbTokenDto {
  @Expose()
  success: boolean;

  @Expose()
  request_token: string;
}

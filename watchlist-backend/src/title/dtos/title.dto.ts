import { Expose } from 'class-transformer';

export class TitleDto {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  token: string;

  @Expose()
  request_token: string;

  @Expose()
  tokenV4: string;

  @Expose()
  username: string;

  @Expose()
  message: string;
}

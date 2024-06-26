import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AccountService {
  constructor(
    private usersService: UsersService,
    private httpService: HttpService,
  ) {}

  async fetchWatchlist(type: string, userId: string, page: string) {
    const headerValue = await this.usersService.getAuthHeader();
    const token = await this.usersService.getAuthToken(userId);
    if (!token) {
      throw new BadRequestException('Server Error');
    }

    const { data } = await this.httpService.axiosRef.get(
      `3/account/account_id/watchlist/${type}`,
      {
        params: {
          page,
          language: 'en-US',
          session_id: token,
        },
        headers: {
          Authorization: headerValue,
        },
      },
    );
    return data;
  }

  async fetchFavorites(type: string, userId: string) {
    const headerValue = await this.usersService.getAuthHeader();
    const token = await this.usersService.getAuthToken(userId);
    if (!token) {
      throw new BadRequestException('Server Error');
    }

    const { data } = await this.httpService.axiosRef.get(
      `3/account/account_id/favorite/${type}`,
      {
        params: {
          page: 1,
          language: 'en-US',
          session_id: token,
        },
        headers: {
          Authorization: headerValue,
        },
      },
    );
    return data;
  }

  async fetchAccountLists(userId: string, page: string) {
    const headerValue = await this.usersService.getAuthHeader(userId);
    const token = await this.usersService.getAuthTokenV4(userId);
    if (!token) {
      throw new BadRequestException('Server Error');
    }
    try {
      const { data } = await this.httpService.axiosRef.get(
        `4/account/${token}/lists`,
        {
          params: {
            page,
          },
          headers: {
            Authorization: headerValue,
          },
        },
      );
      return data;
    } catch (err: any) {
      console.log(err);
      throw new InternalServerErrorException('Error');
    }
  }

  async fetchListDetails(listId: string, userId: string, page: string) {
    // 4/list/list_id
    const headerValue = await this.usersService.getAuthHeader(userId);
    try {
      const { data } = await this.httpService.axiosRef.get(`4/list/${listId}`, {
        headers: {
          Authorization: headerValue,
        },
        params: {
          page,
        },
      });
      return data;
    } catch (err: any) {
      console.log(err);
      throw new InternalServerErrorException('Error');
    }
  }

  async createList(userId: string, name: string, desc: string) {
    const headerValue = await this.usersService.getAuthHeader(userId);
    const token = await this.usersService.getAuthTokenV4(userId);
    if (!token) {
      throw new BadRequestException('Token invalid');
    }
    try {
      const { data } = await this.httpService.axiosRef.post(
        '4/list',
        {
          name,
          desc,
          iso_3166_1: 'US',
          iso_639_1: 'en',
          public: false,
        },
        {
          headers: {
            Authorization: headerValue,
          },
        },
      );
      return data;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error');
    }
  }

  async deleteList(userId: string, listId: string) {
    const headerValue = await this.usersService.getAuthHeader(userId);

    console.log({ headerValue, userId, listId });
    try {
      const { data } = await this.httpService.axiosRef.delete(`4/${listId}`, {
        headers: {
          Authorization: headerValue,
        },
      });
      console.log(data);

      return data;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Error');
    }
  }
}

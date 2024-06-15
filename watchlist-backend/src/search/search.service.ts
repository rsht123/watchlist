import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  private readonly logger = new Logger();

  async setAuthHeader() {
    const token = await this.config.get('APP_TOKEN');
    if (token) {
      this.httpService.axiosRef.defaults.headers.common.Authorization = `Bearer ${token}`;
      return true;
    } else {
      return false;
    }
  }

  async search(type: string, query: string, page: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const { data } = await this.httpService.axiosRef.get(`3/search/${type}`, {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return data;
  }

  async searchTrending(type: string, window: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const { data } = await this.httpService.axiosRef.get(
      `3/trending/${type === 'multi' ? 'all' : type}/${window}`,
      {
        params: {
          language: 'en-US',
        },
      },
    );
    return data;
  }

  async searchLists(type: string, listType: string, page: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const { data } = await this.httpService.axiosRef.get(
      `3/${type}/${listType}`,
      {
        params: {
          page,
          language: 'en-US',
        },
      },
    );
    return data;
  }

  async discoverTitles(titleType: string, queries: object) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    console.log({});
    let newQueries = { ...queries };
    console.log({ newQueries, titleType });
    const { data } = await this.httpService.axiosRef.get(
      `3/discover/${titleType}`,
      {
        params: queries,
      },
    );
    return data;
  }

  async searchIds(params) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const { searchValue, titleType, field } = params;
    if (field === 'with_genres') {
      // console.log({ titleType, genres: 'genres' });
      const { data } = await this.httpService.axiosRef.get(
        `3/genre/${titleType}/list`,
        {
          params: {
            language: 'en',
          },
        },
      );
      console.log(data.genres, searchValue);
      const filtered = data.genres.filter(
        (g: { name: string }) =>
          g.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1,
      );
      return { results: filtered };
    } else {
      const type =
        field === 'with_companies'
          ? 'company'
          : field === 'with_people'
          ? 'person'
          : 'keyword';

      const data = this.search(type, searchValue, '1');
      return data;
    }
  }
}

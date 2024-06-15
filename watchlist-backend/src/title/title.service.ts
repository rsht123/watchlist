import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ImdbId } from './imdb_id.schema';
import { Model } from 'mongoose';
import puppeteer, { Browser } from 'puppeteer';
import { readFileSync } from 'fs';

@Injectable()
export class TitleService {
  constructor(
    @InjectModel(ImdbId.name) private imdbIdModel: Model<ImdbId>,
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  async setAuthHeader() {
    const token = await this.config.get('APP_TOKEN');
    if (token) {
      this.httpService.axiosRef.defaults.headers.common.Authorization = `Bearer ${token}`;
      return true;
    } else {
      return false;
    }
  }

  async fetchTitle(media_id: string, media_type: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const append_to_response = [
      'external_ids',
      'keywords',
      'account_states',
      'recommendations',
    ];
    if (media_type === 'movie') {
      append_to_response.push('credits');
    } else if (media_type === 'tv') {
      append_to_response.push('aggregate_credits');
    }
    const url = `3/${media_type}/${media_id}`;
    const { data } = await this.httpService.axiosRef.get(url, {
      params: {
        append_to_response: append_to_response.join(','),
      },
    });
    if (media_type === 'movie') {
      data.credits.cast = data.credits.cast.slice(0, 20);
      data.credits.crew = data.credits.crew.slice(0, 20);
    } else {
      data.aggregate_credits.cast = data.aggregate_credits.cast.slice(0, 20);
      data.aggregate_credits.crew = data.aggregate_credits.crew.slice(0, 20);
    }
    data.media_type = media_type;
    const { data: languages } = await this.httpService.axiosRef.get(
      '3/configuration/languages',
    );
    const langName = languages.find(
      (lang: { iso_639_1: string; englishName: string }) =>
        lang.iso_639_1 === data.original_language,
    ).english_name;
    data.original_language = langName;
    return data;
  }

  async fetchCollection(collection_id: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const url = `3/collection/${collection_id}`;
    const { data } = await this.httpService.axiosRef.get(url);
    data.media_type = 'collection';
    return data;
  }

  async fetchPerson(person_id: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const url = `3/person/${person_id}`;
    const { data } = await this.httpService.axiosRef.get(url, {
      params: {
        append_to_response: 'combined_credits,images',
      },
    });
    data.media_type = 'person';
    data.combined_credits.cast = data.combined_credits.cast
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);
    data.combined_credits.crew = data.combined_credits.crew.slice(0, 20);
    console.log(data);
    return data;
  }

  async fetchCreditInfo(credit_id: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const url = `3/credit/${credit_id}`;
    const { data } = await this.httpService.axiosRef.get(url);
    return data;
  }

  async fetchSeasonInfo(media_id: string, season_number: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const url = `3/tv/${media_id}/season/${season_number}`;
    const { data } = await this.httpService.axiosRef.get(url);
    for (const [index, episode] of data.episodes.entries()) {
      const imdb_id = await this.fetchImdbId(
        media_id,
        'tv',
        episode.season_number,
        episode.episode_number,
      );
      data.episodes[index].imdb_id = imdb_id;
    }
    return data;
  }

  async fetchEpisodeInfo(
    media_id: string,
    season_number: string,
    episode_number: string,
  ) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const url = `3/tv/${media_id}/season/${season_number}/episode/${episode_number}`;
    const { data } = await this.httpService.axiosRef.get(url, {
      params: { append_to_response: 'credits' },
    });
    const imdb_id = await this.fetchImdbId(
      media_id,
      'tv',
      season_number,
      episode_number,
    );
    data.imdb_id = imdb_id;
    return data;
  }

  async fetchAdditionalInfo(
    media_id: string,
    media_type: string,
    info_type: string,
  ) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const { data } = await this.httpService.axiosRef.get(
      `3/${media_type}/${media_id}/${info_type}?page=1`,
    );
    if (data.cast) {
      data.cast = data.cast.slice(0, 25);
    }
    if (data.crew) {
      const crewTypes = [
        'producer',
        'director',
        'writer',
        'executive producer',
      ];
      data.crew = data.crew
        .filter((crew) => {
          const job = crew.job ? crew.job : crew.jobs[0].job;
          let isTrue = false;
          crewTypes.forEach((type) => {
            if (job.toLowerCase().indexOf(type) !== -1) isTrue = true;
          });
          return isTrue;
        })
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 25);
    }
    return data;
  }

  async fetchCollectionInfo(collection_id: string) {
    const isAuthSet = await this.setAuthHeader();
    if (!isAuthSet) {
      throw new BadRequestException('Server Error');
    }
    const { data } = await this.httpService.axiosRef.get(
      `3/collection/${collection_id}`,
    );
    return data;
  }

  async fetchImdbId(
    media_id: string,
    media_type: string,
    season_number?: string,
    episode_number?: string,
  ) {
    let url = `3/${media_type}/${media_id}/`;
    if (season_number && episode_number) {
      url += `season/${season_number}/episode/${episode_number}/`;
    }
    url += 'external_ids';

    const { data } = await this.httpService.axiosRef.get(url);

    return data.imdb_id;
  }

  async fetchRating(imdb_id: string, browser: Browser, html: string) {
    const newHtml = html.replaceAll('IMDB_ID', imdb_id);
    const page = await browser.newPage();
    await page.setContent(newHtml);
    const rating = await (
      await (await page.waitForSelector('.rating')).getProperty('textContent')
    ).jsonValue();
    const votes = await (
      await (await page.waitForSelector('.votes')).getProperty('textContent')
    ).jsonValue();
    await page.close();
    return { imdb_id, rating, votes };
  }

  async fetchImdbRatings(imdb_ids: string[]) {
    const imdb_ratings = await this.imdbIdModel.find({ imdb_id: imdb_ids });
    if (imdb_ratings.length === imdb_ids.length) {
      const finalIds = {};
      imdb_ratings.forEach((id) => {
        finalIds[id.toJSON().imdb_id] = id.toJSON();
      });
      return finalIds;
    }
    const ids_to_fetch = [];
    imdb_ids.forEach((id) => {
      if (!imdb_ratings.find((i) => i.imdb_id === id)) {
        ids_to_fetch.push(id);
      }
    });
    const htmlPath = `${process.cwd()}/src/imdb.html`;
    const initialHtml = readFileSync(htmlPath, 'utf-8');
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: this.config.get('PUPPETEER_EXECUTABLE_PATH')
        ? this.config.get('PUPPETEER_EXECUTABLE_PATH')
        : undefined,
    });
    const fetched_imdb_ids = [];
    for (const imdb_id of ids_to_fetch) {
      const {
        imdb_id: newId,
        rating,
        votes,
      } = await this.fetchRating(imdb_id, browser, initialHtml);
      const imdb_rating_new = {
        imdb_id: newId,
        rating,
        votes,
      };
      fetched_imdb_ids.push(imdb_rating_new);
    }
    await browser.close();
    // TODO: maybe add exception to check if imdb_id present in db while fetching
    const update = await this.imdbIdModel.insertMany(fetched_imdb_ids);
    const imdb_ratings_updated = await this.imdbIdModel.find({
      imdb_id: imdb_ids,
    });
    const finalIds = {};
    imdb_ratings_updated.forEach((rating) => {
      finalIds[rating.toJSON().imdb_id] = rating.toJSON();
    });
    return finalIds;
  }
}

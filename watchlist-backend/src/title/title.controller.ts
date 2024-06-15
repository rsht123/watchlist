import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TitleService } from './title.service';

@Controller('title')
export class TitleController {
  constructor(private titleService: TitleService) {}

  @Get('/fetch')
  fetchTitle(
    @Query('media_type') media_type: string,
    @Query('media_id') media_id: string,
  ) {
    return this.titleService.fetchTitle(media_id, media_type);
  }

  @Get('/collection')
  fetchCollection(@Query('collection_id') collection_id: string) {
    return this.titleService.fetchCollection(collection_id);
  }

  @Get('/person')
  fetchPerson(@Query('person_id') person_id: string) {
    return this.titleService.fetchPerson(person_id);
  }

  @Get('/credit')
  fetchCreditInfo(@Query('credit_id') credit_id: string) {
    return this.titleService.fetchCreditInfo(credit_id);
  }

  @Post('/imdb_rating')
  fetchImdbRating(@Body('imdb_ids') imdb_ids: string[]) {
    return this.titleService.fetchImdbRatings(imdb_ids);
  }

  @Get('/info')
  fetchAdditionalInfp(
    @Query('media_id') media_id: string,
    @Query('media_type') media_type: string,
    @Query('info_type') info_type: string,
  ) {
    return this.titleService.fetchAdditionalInfo(
      media_id,
      media_type,
      info_type,
    );
  }

  @Get('/episode/credits')
  fetchEpisodeCredits(
    @Query('media_id') media_id: string,
    @Query('season_number') season_number: string,
    @Query('episode_numbrr') episode_number: string,
  ) {
    return this.titleService.fetchEpisodeInfo(
      media_id,
      season_number,
      episode_number,
    );
  }

  @Get('/collection')
  fetchColelctionInfo(@Query('collection_id') collection_id: string) {
    return this.titleService.fetchCollectionInfo(collection_id);
  }

  @Get('/season')
  fetchSeasonInfo(
    @Query('media_id') media_id: string,
    @Query('season_number') season_number: string,
  ) {
    return this.titleService.fetchSeasonInfo(media_id, season_number);
  }

  @Get('/episode')
  fetchEpisodeInfo(
    @Query('media_id') media_id: string,
    @Query('season_number') season_number: string,
    @Query('episode_number') episode_number: string,
  ) {
    return this.titleService.fetchEpisodeInfo(
      media_id,
      season_number,
      episode_number,
    );
  }
}

import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SearchResultsDto } from './dtos/search.dto';

@Controller('search')
@Serialize(SearchResultsDto)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/tmdb')
  search(
    @Query('type') type: string,
    @Query('query') query: string,
    @Query('page') page: string,
  ) {
    return this.searchService.search(type, query, page);
  }

  @Get('/trending')
  searchTrending(@Query('type') type: string, @Query('window') window: string) {
    return this.searchService.searchTrending(type, window);
  }

  @Get('/lists')
  searchLists(
    @Query('type') type: string,
    @Query('listType') listType: string,
    @Query('page') page: string,
  ) {
    return this.searchService.searchLists(type, listType, page);
  }

  @Get('/discover/:titleType')
  discover(@Param('titleType') titleType: string, @Query() queries: object) {
    return this.searchService.discoverTitles(titleType, queries);
  }

  @Get('/ids')
  searchIds(@Query() queryParams: object) {
    return this.searchService.searchIds(queryParams);
  }
}

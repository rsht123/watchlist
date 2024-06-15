import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.themoviedb.org/',
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService, ConfigService],
})
export class SearchModule {}

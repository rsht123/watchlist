import { Module } from '@nestjs/common';
import { TitleController } from './title.controller';
import { TitleService } from './title.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ImdbId, ImdbIdSchema } from './imdb_id.schema';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.themoviedb.org/',
    }),
    MongooseModule.forFeature([
      {
        name: ImdbId.name,
        schema: ImdbIdSchema,
        collection: 'imdb_ratings',
      },
    ]),
  ],
  controllers: [TitleController],
  providers: [TitleService, ConfigService],
})
export class TitleModule {}

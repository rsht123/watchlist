import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchModule } from './search/search.module';
import { AccountModule } from './account/account.module';
import { TitleModule } from './title/title.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get('MONGO_URI'),
        };
      },
    }),
    SearchModule,
    AccountModule,
    TitleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

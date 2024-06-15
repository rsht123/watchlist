import { Module, MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios/dist';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: 'users',
      },
    ]),
    HttpModule.register({
      baseURL: 'https://api.themoviedb.org/',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService, ConfigService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}

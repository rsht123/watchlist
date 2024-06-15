import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UsersService } from '../users/users.service';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.themoviedb.org/',
    }),
    UsersModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        collection: 'users',
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService, UsersService],
})
export class AccountModule {}

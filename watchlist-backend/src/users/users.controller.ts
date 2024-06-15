import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthUserDto } from './dtos/auth-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from './user.schema';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  fetchAllUsers() {
    return this.usersService.findAll();
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() userId: string) {
    return this.authService.refreshUser(userId);
  }

  @Post('/signin')
  signin(@Body() body: AuthUserDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('/signup')
  signup(@Body() body: AuthUserDto) {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('/update-profile')
  updateProfile(@Body() body: Partial<User>, @CurrentUser() userId: string) {
    console.log('body', body);
    return this.usersService.updateUser(body, userId);
  }

  @Get('/request-token')
  requestUserToken(@CurrentUser() userId: string) {
    return this.usersService.createRequestToken(userId);
  }

  @Get('/authorize-token')
  authorizeToken(@CurrentUser() userId: string) {
    return this.usersService.authorizeRequestToken(userId);
  }
}

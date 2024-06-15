import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get('/watchlist/:type')
  fetchWatchlist(
    @Param('type') type: string,
    @CurrentUser() userId: string,
    @Param('page') page: string,
  ) {
    return this.accountService.fetchWatchlist(type, userId, page);
  }

  @Get('/favorite/:type')
  fetchFavorite(@Param('type') type: string, @CurrentUser() userId: string) {
    return this.accountService.fetchFavorites(type, userId);
  }

  @Get('/lists')
  fetchAccountLists(
    @CurrentUser() userId: string,
    @Param('page') page: string,
  ) {
    console.log({ userId, page });
    return this.accountService.fetchAccountLists(userId, page);
  }

  @Get('/lists/:listId')
  fetchListDetails(
    @Param('listId') listId: string,
    @Query('page') page: string,
    @CurrentUser() userId: string,
  ) {
    console.log({ userId, listId, page });
    return this.accountService.fetchListDetails(listId, userId, page);
  }

  @Post('/lists/create')
  createUserList(
    @CurrentUser() userId: string,
    @Body('name') name: string,
    @Body('desc') desc: string,
  ) {
    return this.accountService.createList(userId, name, desc);
  }

  @Delete('/lists/delete')
  deleteUserList(
    @CurrentUser() userId: string,
    @Query('listId') listId: string,
  ) {
    console.log({ userId, listId });
    return this.accountService.deleteList(userId, listId);
  }
}

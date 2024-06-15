import { Controller, Get, Param, Query } from '@nestjs/common';
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
}

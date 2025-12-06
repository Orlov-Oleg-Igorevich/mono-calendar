import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from '../user.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountGetExistingUsers,
  AccountGetMailMatches,
  AccountGetProfile,
  CalendarGetUsersInfo,
} from '@mono-calendar/contracts';

@Controller(AccountGetExistingUsers.path)
export class UserQueryController {
  private readonly logger: Logger = new Logger(UserQueryController.name);
  constructor(private readonly userService: UserService) {}

  @RMQValidate()
  @RMQRoute(AccountGetProfile.topic)
  async getUser(
    @Body() { userId }: AccountGetProfile.Request,
  ): Promise<AccountGetProfile.Response> {
    return this.userService.getUser(userId);
  }

  @Post(AccountGetExistingUsers.topic)
  async checkUsersExist(
    @Body() { userIds }: AccountGetExistingUsers.Request,
  ): Promise<AccountGetExistingUsers.Response> {
    this.logger.log('Запрос дошёл до сервиса Account в роут checkUsersExist');
    return this.userService.checkUsersExist(userIds);
  }

  @RMQValidate()
  @RMQRoute(CalendarGetUsersInfo.topic)
  async getUsersView(
    @Body() { userIds }: CalendarGetUsersInfo.Request,
  ): Promise<CalendarGetUsersInfo.Response> {
    const users = await this.userService.getUsersView(userIds);
    return { users };
  }

  @RMQValidate()
  @RMQRoute(AccountGetMailMatches.topic)
  async getMailMatches(
    @Body() { emailPrefix }: AccountGetMailMatches.Request,
  ): Promise<AccountGetMailMatches.Response> {
    const users = await this.userService.getMailMatches(emailPrefix);
    return { users };
  }
}

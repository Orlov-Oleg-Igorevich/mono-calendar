import { Body, Controller } from '@nestjs/common';
import { UserService } from '../user.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountChangeProfile } from '@mono-calendar/contracts';

@Controller('user')
export class UserCommandController {
  constructor(private readonly userService: UserService) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async changeUser(
    @Body() { userId, name }: AccountChangeProfile.Request,
  ): Promise<AccountChangeProfile.Response> {
    return this.userService.updateUser(userId, { name });
  }
}

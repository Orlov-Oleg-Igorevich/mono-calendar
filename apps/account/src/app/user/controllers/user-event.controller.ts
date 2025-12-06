import { UploadAvatarEvent } from '@mono-calendar/contracts';
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import { UserService } from '../user.service';

@Controller()
export class UserEventController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly userService: UserService,
  ) {}

  @RMQValidate()
  @RMQRoute(UploadAvatarEvent.topic)
  async updateUserAvatar(
    @Body() { id, avatarUrl }: UploadAvatarEvent.Request,
  ): Promise<UploadAvatarEvent.Response> {
    await this.userService.updateUserAvatar(id, avatarUrl);
    return {};
  }
}

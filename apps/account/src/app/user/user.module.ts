import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserCommandController } from './controllers/user-command.controller';
import { UserQueryController } from './controllers/user-query.controller';
import { UserEventController } from './controllers/user-event.controller';

@Module({
  imports: [],
  providers: [UserRepository, UserService],
  controllers: [UserCommandController, UserQueryController, UserEventController],
  exports: [UserRepository],
})
export class UserModule {}

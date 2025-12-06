import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUser, IUserViewModel } from '@mono-calendar/interface';
import { RMQError } from 'nestjs-rmq';
import { USER_NOT_FOUND_ERROR, USER_UPDATED_ERROR } from './user.constans';
import { ERROR_TYPE } from 'nestjs-rmq/dist/constants';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getUser(userId: string): Promise<IUserViewModel> {
    const user = await this.userRepository.getUsersViewById([userId]);
    if (user.length === 0) {
      throw new RMQError(USER_NOT_FOUND_ERROR, ERROR_TYPE.RMQ);
    }
    return user[0];
  }

  async updateUser(
    userId: string,
    updateUserObject: Partial<IUserViewModel>,
  ): Promise<IUserViewModel> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new RMQError(USER_NOT_FOUND_ERROR, ERROR_TYPE.RMQ);
    }
    const userEntity = new UserEntity(user);
    userEntity.updateProfile(updateUserObject);
    const updatedUser = await this.userRepository.update(userEntity);
    if (!updatedUser) {
      throw new RMQError(USER_UPDATED_ERROR, ERROR_TYPE.RMQ);
    }
    const updatedEntity = new UserEntity(updatedUser);
    return updatedEntity.getPublicProfile();
  }

  async checkUsersExist(userIds: string[]): Promise<{ userIds: string[] }> {
    const users = await this.userRepository.findAllUserById(userIds);
    return { userIds: users.map((user) => user.id) };
  }

  async getUsersView(userIds: string[]): Promise<IUserViewModel[]> {
    return this.userRepository.getUsersViewById(userIds);
  }

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    await this.userRepository.updateUserAvatar(userId, avatarUrl);
  }

  async getMailMatches(emailPrefix: string): Promise<IUserViewModel[]> {
    return this.userRepository.findMailMatches(emailPrefix);
  }
}

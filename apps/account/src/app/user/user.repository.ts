import { Injectable } from '@nestjs/common';
import { User } from '../prisma/generated/prisma/client';
import { UserEntity } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import { IUserViewModel } from '@mono-calendar/interface';
import { ChangeProfileEvent } from '@mono-calendar/contracts';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: UserEntity): Promise<User> {
    return this.prismaService.getClient().user.create({ data: user });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prismaService.getClient().user.findUnique({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.getClient().user.findUnique({ where: { email } });
  }

  async update(user: UserEntity): Promise<User> {
    return this.prismaService.getClient().$transaction(async (tx) => {
      await this.prismaService.getClient().outboxEvent.create({
        data: {
          topic: ChangeProfileEvent.topic,
          payload: {
            userId: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          },
        },
      });
      return this.prismaService.getClient().user.update({ where: { id: user.id }, data: user });
    });
  }

  async delete(user: UserEntity): Promise<void> {
    await this.prismaService.getClient().user.delete({ where: { id: user.id } });
  }

  async findAllUserById(userIds: string[]): Promise<User[]> {
    return this.prismaService.getClient().user.findMany({
      where: { id: { in: userIds } },
    });
  }

  async getUsersViewById(userIds: string[]): Promise<IUserViewModel[]> {
    return this.prismaService.getClient().user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, avatarUrl: true, email: true },
    });
  }

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    await this.prismaService.getClient().user.updateMany({
      where: { id: userId },
      data: { avatarUrl },
    });
  }

  async findMailMatches(emailPrefix: string): Promise<IUserViewModel[]> {
    return this.prismaService.getClient().user.findMany({
      where: { email: { startsWith: emailPrefix, mode: 'insensitive' } },
      select: { id: true, email: true, avatarUrl: true, name: true },
    });
  }
}

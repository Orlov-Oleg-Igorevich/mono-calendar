import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Task, TaskCategory } from '../../prisma/generated/prisma/client';
import { ITaskViewModel, IUserViewModel } from '@mono-calendar/interface';

@Injectable()
export class TaskViewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertCalendarView(viewData: ITaskViewModel): Promise<void> {
    const { userId, taskId } = viewData;
    await this.prisma.getClient().calendarView.upsert({
      where: { userId_taskId: { userId, taskId } },
      update: viewData,
      create: viewData,
    });
  }

  async deleteCalendarView(userId: string, taskId: string): Promise<void> {
    await this.prisma.getClient().calendarView.delete({
      where: { userId_taskId: { userId, taskId } },
    });
  }

  async deleteAllCalendarViewsForTask(taskId: string): Promise<void> {
    await this.prisma.getClient().calendarView.deleteMany({
      where: { taskId },
    });
  }

  async upsertUserCash(
    userId: string,
    name: string,
    avatarUrl: string | null,
    email: string,
  ): Promise<void> {
    await this.prisma.getClient().userCash.upsert({
      where: { id: userId },
      update: { name, avatarUrl },
      create: { id: userId, name, avatarUrl, email },
    });
  }

  async ensureUserInCash(userId: string): Promise<void> {
    const exists = await this.prisma.getClient().userCash.findUnique({
      where: { id: userId },
    });
    if (!exists) {
      throw new Error('User not found in UserCash and no data provided');
    }
  }

  async getAuthorFromUserCash(authorId: string): Promise<IUserViewModel | null> {
    return this.prisma.getClient().userCash.findUnique({
      where: { id: authorId },
    });
  }

  async getFullTaskWithRelations(taskId: string): Promise<
    Task & {
      shares: { sharedWithUserId: string }[];
      categories: { category: { id: string; name: string; userId: string | null } }[];
    }
  > {
    return this.prisma.getClient().task.findUniqueOrThrow({
      where: { id: taskId },
      include: {
        shares: {
          select: { sharedWithUserId: true },
        },
        categories: {
          select: {
            category: {
              select: { id: true, name: true, userId: true },
            },
          },
          orderBy: { priority: 'asc' },
        },
      },
    });
  }

  async findAllCategoryTasks(categoryId: string, userId: string): Promise<TaskCategory[]> {
    return await this.prisma.getClient().taskCategory.findMany({
      where: { categoryId, task: { authorId: userId } },
    });
  }

  async findAllUserTasks(authorId: string): Promise<{ id: string }[]> {
    return this.prisma.getClient().task.findMany({
      where: { authorId },
      select: { id: true },
    });
  }

  async findAllCategoryTasksByViewModel(category1Id: string): Promise<{ taskId: string }[]> {
    return this.prisma.getClient().calendarView.findMany({
      where: { category1Id },
      select: { taskId: true },
    });
  }

  async getAllBusySlot(
    userId: string,
    startDateFrom: Date,
    startDateTo: Date,
  ): Promise<{ startDate: Date; endDate: Date | null }[]> {
    return this.prisma.getClient().calendarView.findMany({
      where: { userId, startDate: { gte: startDateFrom, lte: startDateTo } },
      select: { startDate: true, endDate: true },
    });
  }
}

// src/task-view/task-view.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { TaskViewRepository } from '../repositories/task-view.repo';
import { AccountClientService } from '../../account-client/account-client.service';
import { IUserViewModel } from '@mono-calendar/interface';

@Injectable()
export class TaskViewService {
  private readonly logger = new Logger(TaskViewService.name);

  constructor(
    private readonly taskViewRepository: TaskViewRepository,
    private readonly accountClient: AccountClientService,
  ) {}

  async handleTaskUpsert(taskId: string): Promise<void> {
    try {
      const task = await this.taskViewRepository.getFullTaskWithRelations(taskId);

      let author = await this.taskViewRepository.getAuthorFromUserCash(task.authorId);
      if (!author) {
        author = (await this.fetchAndCacheUser([task.authorId]))[0];
      }

      await this.taskViewRepository.upsertCalendarView({
        userId: task.authorId,
        taskId: task.id,
        authorId: task.authorId,
        isShared: false,
        title: task.title,
        address: task.address,
        startDate: task.startDate,
        endDate: task.endDate,
        color: task.color,
        category1Id: task.categories[0]?.category.id || null,
      });

      for (const share of task.shares) {
        const sharedUserId = share.sharedWithUserId;

        let user = await this.taskViewRepository.getAuthorFromUserCash(sharedUserId);
        if (!user) {
          user = (await this.fetchAndCacheUser([sharedUserId]))[0];
        }

        await this.taskViewRepository.upsertCalendarView({
          userId: sharedUserId,
          taskId: task.id,
          authorId: task.authorId,
          isShared: true,
          title: task.title,
          address: task.address,
          startDate: task.startDate,
          endDate: task.endDate,
          color: task.color,
          category1Id: task.categories[0]?.category.id || null,
        });
      }
    } catch (error) {
      this.logger.error(`Failed to handle task ${taskId}`);
      throw error;
    }
  }

  async handleTaskDelete(taskId: string): Promise<void> {
    await this.taskViewRepository.deleteAllCalendarViewsForTask(taskId);
  }

  async handleCategoryChanged(categoryId: string, userId: string): Promise<void> {
    const taskCategories = await this.taskViewRepository.findAllCategoryTasks(categoryId, userId);

    for (const tc of taskCategories) {
      await this.handleTaskUpsert(tc.taskId);
    }
  }

  async handleUserUpdated(
    userId: string,
    name: string,
    avatarUrl: string | null,
    email: string,
  ): Promise<void> {
    await this.taskViewRepository.upsertUserCash(userId, name, avatarUrl, email);
  }

  async handleCategoryDeleted(categoryId: string): Promise<void> {
    const tasks = await this.taskViewRepository.findAllCategoryTasksByViewModel(categoryId);

    for (const task of tasks) {
      await this.handleTaskUpsert(task.taskId);
    }
  }

  private async fetchAndCacheUser(userIds: string[]): Promise<IUserViewModel[]> {
    const usersData = await this.accountClient.getUsers(userIds);
    if (usersData.length !== userIds.length) {
      throw new Error('Не удалось обновить данные пользователей для UserHash');
    }
    for (const user of usersData) {
      await this.taskViewRepository.upsertUserCash(user.id, user.name, user.avatarUrl, user.email);
    }
    return usersData;
  }
}

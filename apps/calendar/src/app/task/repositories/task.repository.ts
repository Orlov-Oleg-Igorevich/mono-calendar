import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TaskEntity } from '../entities/task.entity';
import {
  ICategoryViewModel,
  IColorViewModel,
  ITask,
  ITaskViewModel,
  IUserViewModel,
} from '@mono-calendar/interface';
import { TASK_NOT_FOUND_ERROR } from '../constans/task-error.constans';
import { ChangeTaskEvent, CreateTaskEvent, DeleteTaskEvent } from '@mono-calendar/contracts';
import { join, sql } from '../../prisma/generated/prisma/internal/prismaNamespace';

@Injectable()
export class TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createTask(task: TaskEntity): Promise<ITask | null> {
    return this.prismaService.getClient().$transaction(async (tx) => {
      const newTask = await tx.task.create({ data: task.returnSelfFields() });
      await tx.taskCategory.createMany({
        data: task.categories.map((category) => ({
          categoryId: category.categoryId,
          taskId: newTask.id,
          priority: category.priority,
        })),
      });
      await tx.taskShare.createMany({
        data: task.shares.map((user) => ({
          sharedWithUserId: user.sharedWithUserId,
          taskId: newTask.id,
        })),
      });
      await tx.outboxEvent.create({
        data: { topic: CreateTaskEvent.topic, payload: { taskId: task.id } },
      });
      return tx.task.findUnique({
        where: { id: newTask.id },
        include: { categories: { orderBy: { priority: 'asc' } }, shares: true },
      });
    });
  }

  async updateTask(task: TaskEntity): Promise<ITask | null> {
    return await this.prismaService.getClient().$transaction(async (tx) => {
      const count = (
        await tx.task.updateMany({
          where: { id: task.id },
          data: task.returnSelfFields(),
        })
      ).count;
      if (count === 0) {
        throw new NotFoundException(TASK_NOT_FOUND_ERROR);
      }

      const categoryChanges = task.getCategoriesChanges();
      if (categoryChanges.toRemove.length > 0) {
        await tx.taskCategory.deleteMany({
          where: {
            taskId: task.id,
            categoryId: { in: categoryChanges.toRemove },
          },
        });
      }
      if (categoryChanges.toAdd.length > 0) {
        await tx.taskCategory.createMany({
          data: categoryChanges.toAdd.map((category) => ({
            taskId: task.id,
            categoryId: category.categoryId,
            priority: category.priority,
          })),
        });
      }
      if (categoryChanges.toPriorityChanges.length > 0) {
        await tx.$executeRaw`
          UPDATE "TaskCategory"
          SET "priority" = updates."priority"
          FROM (VALUES
            ${join(categoryChanges.toPriorityChanges.map((u) => sql`(${task.id}, ${u.categoryId}, ${u.priority})`))}
          ) AS updates("taskId", "categoryId", "priority")
          WHERE "TaskCategory"."taskId" = updates."taskId"
          AND "TaskCategory"."categoryId" = updates."categoryId"
        `;
        await tx.taskCategory.updateMany({
          data: categoryChanges.toPriorityChanges.map((category) => ({
            taskId: task.id,
            categoryId: category.categoryId,
            priority: category.priority,
          })),
        });
      }
      const shareChanges = task.getSharesChanges();
      if (shareChanges.toRemove.length > 0) {
        await tx.taskShare.deleteMany({
          where: {
            taskId: task.id,
            sharedWithUserId: { in: shareChanges.toRemove },
          },
        });
      }
      if (shareChanges.toAdd.length > 0) {
        await tx.taskShare.createMany({
          data: shareChanges.toAdd.map((share) => ({
            taskId: task.id,
            sharedWithUserId: share.sharedWithUserId,
          })),
        });
      }
      await tx.outboxEvent.create({
        data: { topic: ChangeTaskEvent.topic, payload: { taskId: task.id } },
      });

      return tx.task.findUnique({
        where: { id: task.id },
        include: { categories: { orderBy: { priority: 'asc' } }, shares: true },
      });
    });
  }

  async getTask(taskId: string): Promise<ITask | null> {
    const task = this.prismaService
      .getClient()
      .task.findUnique({ where: { id: taskId }, include: { categories: true, shares: true } });
    return task;
  }

  async deleteTask(userId: string, taskId: string): Promise<number> {
    return this.prismaService.getClient().$transaction(async (tx) => {
      await tx.outboxEvent.create({
        data: { topic: DeleteTaskEvent.topic, payload: { taskId } },
      });
      return (
        await tx.task.deleteMany({
          where: { id: taskId, authorId: userId },
        })
      ).count;
    });
  }

  async getCalendar(userId: string): Promise<{
    tasks: ITaskViewModel[];
    authors: IUserViewModel[];
    categories: (ICategoryViewModel & Pick<IColorViewModel, 'color' | 'userId'>)[];
  }> {
    const tasks = await this.prismaService.getClient().calendarView.findMany({
      where: { userId },
    });
    const authors = await this.prismaService.getClient().userCash.findMany({
      where: { id: { in: tasks.map((task) => task.authorId) } },
    });
    const categories = await this.prismaService.getClient().categoryColor.findMany({
      where: {
        userId,
        categoryId: {
          in: tasks
            .filter((task) => task.category1Id !== null)
            .map((task) => task.category1Id as string),
        },
      },
      select: { userId: true, color: true, category: { select: { id: true, name: true } } },
    });
    const returnCategories = categories.map((category) => ({
      color: category.color,
      userId: category.userId,
      ...category.category,
    }));
    return { tasks, authors, categories: returnCategories };
  }

  async getUsers(userIds: string[]): Promise<IUserViewModel[]> {
    return this.prismaService.getClient().userCash.findMany({
      where: { id: { in: userIds } },
    });
  }

  async getSystemCategories(): Promise<{ id: string; name: string }[]> {
    return this.prismaService.getClient().category.findMany({
      where: { isSystem: true },
      select: { name: true, id: true },
    });
  }
}

import {
  ChangeCategoryEvent,
  ChangeProfileEvent,
  ChangeTaskEvent,
  CreateTaskEvent,
  DeleteCategoryEvent,
  DeleteTaskEvent,
} from '@mono-calendar/contracts';
import { Body, Controller, Logger } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { TaskViewService } from '../services/task-view.service';

@Controller()
export class TaskEventController {
  private readonly logger: Logger = new Logger(TaskEventController.name);
  constructor(private readonly taskViewService: TaskViewService) {}

  @RMQRoute(CreateTaskEvent.topic)
  @RMQValidate()
  async createTask(@Body() { taskId }: CreateTaskEvent.Request): Promise<CreateTaskEvent.Response> {
    this.logger.log(`Сообщение дошло в сервис calendar в роут createTask`);
    await this.taskViewService.handleTaskUpsert(taskId);
    return {};
  }

  @RMQRoute(ChangeTaskEvent.topic)
  @RMQValidate()
  async changeTask(@Body() { taskId }: ChangeTaskEvent.Request): Promise<ChangeTaskEvent.Response> {
    this.logger.log(`Сообщение дошло в сервис calendar в роут changeTask`);
    await this.taskViewService.handleTaskUpsert(taskId);
    return {};
  }

  @RMQRoute(DeleteTaskEvent.topic)
  @RMQValidate()
  async deleteTask(@Body() { taskId }: DeleteTaskEvent.Request): Promise<DeleteTaskEvent.Response> {
    this.logger.log(`Сообщение дошло в сервис calendar в роут deleteTask`);
    await this.taskViewService.handleTaskDelete(taskId);
    return {};
  }

  @RMQRoute(ChangeCategoryEvent.topic)
  @RMQValidate()
  async changeCategory(
    @Body() { categoryId, userId }: ChangeCategoryEvent.Request,
  ): Promise<ChangeCategoryEvent.Response> {
    this.logger.log(`Сообщение дошло в сервис calendar в роут changeCategory`);
    await this.taskViewService.handleCategoryChanged(categoryId, userId);
    return {};
  }

  @RMQRoute(DeleteCategoryEvent.topic)
  @RMQValidate()
  async deleteCategory(
    @Body() { categoryId }: DeleteCategoryEvent.Request,
  ): Promise<DeleteCategoryEvent.Response> {
    this.logger.log(`Сообщение дошло в сервис calendar в роут deleteCategory`);
    await this.taskViewService.handleCategoryDeleted(categoryId);
    return {};
  }

  @RMQRoute(ChangeProfileEvent.topic)
  @RMQValidate()
  async changeUserProfile(
    @Body() { userId, name, avatarUrl, email }: ChangeProfileEvent.Request,
  ): Promise<ChangeProfileEvent.Response> {
    this.logger.log(`Сообщение дошло в сервис calendar в роут changeUserProfile`);
    await this.taskViewService.handleUserUpdated(userId, name, avatarUrl ?? null, email);
    return {};
  }
}

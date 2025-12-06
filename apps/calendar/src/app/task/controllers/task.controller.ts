import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  CalendarChangeTask,
  CalendarCreateTask,
  CalendarDeleteTask,
  CalendarGetCalendar,
  CalendarGetTask,
} from '@mono-calendar/contracts';
import { TaskCoreService } from '../services/task-core.service';
import { UserId } from '@mono-calendar/shared';

@Controller(CalendarCreateTask.path)
export class TaskController {
  constructor(private readonly taskCoreService: TaskCoreService) {}

  @Post(CalendarCreateTask.topic)
  async createTask(
    @UserId() userId: string,
    @Body() { taskFields }: CalendarCreateTask.Request,
  ): Promise<CalendarCreateTask.Response> {
    return this.taskCoreService.createTask(userId, taskFields);
  }

  @Patch(CalendarChangeTask.topic)
  async changeTask(
    @UserId() userId: string,
    @Param('id') taskId: string,
    @Body() { taskFields }: CalendarChangeTask.Request,
  ): Promise<CalendarChangeTask.Response> {
    return this.taskCoreService.updateTask(userId, taskId, taskFields);
  }

  @Get(CalendarGetTask.topic)
  async getTaskDetails(
    @UserId() userId: string,
    @Param('id') taskId: string,
  ): Promise<CalendarGetTask.Response> {
    return this.taskCoreService.getTask(taskId);
  }

  @Delete(CalendarDeleteTask.topic)
  async deleteTask(
    @UserId() userId: string,
    @Param('id') taskId: string,
  ): Promise<CalendarDeleteTask.Response> {
    await this.taskCoreService.deleteTask(userId, taskId);
    return {};
  }

  @Get(CalendarGetCalendar.topic)
  async getCalendar(@UserId() userId: string): Promise<CalendarGetCalendar.Response> {
    return this.taskCoreService.getCalendar(userId);
  }
}

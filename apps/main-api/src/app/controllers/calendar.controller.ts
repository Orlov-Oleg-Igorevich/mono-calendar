import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CalendarService } from '../services/calendar.service';
import {
  ChangeCategoryDto,
  ChangeTaskDto,
  CreateCategoryDto,
  CreateTaskDto,
  DeleteCategoryDto,
  DeleteTaskDto,
  GetCalendarDto,
  GetCategoriesDto,
  GetTaskDetailsDto,
} from '@mono-calendar/dto';
import { Request } from 'express';

@Controller(GetCalendarDto.path)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @UseGuards(JwtAuthGuard)
  @Get(GetCalendarDto.topic)
  async getCalendar(@Req() req: Request): Promise<GetCalendarDto.Response> {
    return this.calendarService.getCalendar(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(GetCategoriesDto.topic)
  async getCategories(@Req() req: Request): Promise<GetCategoriesDto.Response> {
    return this.calendarService.getCategories(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(CreateCategoryDto.topic)
  async createCategory(
    @Req() req: Request,
    @Body() dto: CreateCategoryDto.Request,
  ): Promise<CreateCategoryDto.Response> {
    return this.calendarService.createCategory(req.user.id, { categoryFields: dto });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(ChangeCategoryDto.topic)
  async updateCategory(
    @Req() req: Request,
    @Param('id') categoryId: string,
    @Body() dto: ChangeCategoryDto.Request,
  ): Promise<ChangeCategoryDto.Response> {
    return this.calendarService.updateCategory(req.user.id, categoryId, { categoryFields: dto });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(DeleteCategoryDto.topic)
  async deleteCategory(
    @Req() req: Request,
    @Param('id') categoryId: string,
  ): Promise<DeleteCategoryDto.Response> {
    return this.calendarService.deleteCategory(req.user.id, categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(GetTaskDetailsDto.topic)
  async getTask(
    @Req() req: Request,
    @Param('id') taskId: string,
  ): Promise<GetTaskDetailsDto.Response> {
    return this.calendarService.getTaskDetails(req.user.id, taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(CreateTaskDto.topic)
  async createTask(
    @Req() req: Request,
    @Body() dto: CreateTaskDto.Request,
  ): Promise<CreateTaskDto.Response> {
    return this.calendarService.createTask(req.user.id, { taskFields: dto });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(ChangeTaskDto.topic)
  async changeTask(
    @Req() req: Request,
    @Param('id') taskId: string,
    @Body() dto: ChangeTaskDto.Request,
  ): Promise<ChangeTaskDto.Response> {
    const task = await this.calendarService.updateTask(req.user.id, taskId, { taskFields: dto });
    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(DeleteTaskDto.topic)
  async deleteTask(
    @Req() req: Request,
    @Param('id') taskId: string,
  ): Promise<DeleteTaskDto.Response> {
    return this.calendarService.deleteTask(req.user.id, taskId);
  }
}

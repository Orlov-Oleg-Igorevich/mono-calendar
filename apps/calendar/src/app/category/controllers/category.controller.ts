import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryCoreService } from '../service/category-core.service';
import {
  CalendarChangeCategory,
  CalendarCreateCategory,
  CalendarDeleteCategory,
  CalendarGetCategories,
} from '@mono-calendar/contracts';
import { UserId } from '@mono-calendar/shared';

@Controller(CalendarChangeCategory.path)
export class CategoryController {
  constructor(private readonly categoryCoreService: CategoryCoreService) {}

  @Get(CalendarGetCategories.topic)
  async getCategories(@UserId() userId: string): Promise<CalendarGetCategories.Response> {
    const data = await this.categoryCoreService.getCategories(userId);
    return { categories: data };
  }

  @Post(CalendarCreateCategory.topic)
  async createCategory(
    @UserId() userId: string,
    @Body() { categoryFields }: CalendarCreateCategory.Request,
  ): Promise<CalendarCreateCategory.Response> {
    return this.categoryCoreService.createCategory(userId, categoryFields);
  }

  @Patch(CalendarChangeCategory.topic)
  async changeCategory(
    @UserId() userId: string,
    @Param('id') categoryId: string,
    @Body() { categoryFields }: CalendarChangeCategory.Request,
  ): Promise<CalendarChangeCategory.Response> {
    return this.categoryCoreService.updateCategory(userId, categoryId, categoryFields);
  }

  @Delete(CalendarDeleteCategory.topic)
  async deleteCategory(
    @UserId() userId: string,
    @Param('id') categoryId: string,
  ): Promise<CalendarDeleteCategory.Response> {
    await this.categoryCoreService.deleteCategory(userId, categoryId);
    return {};
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ICategory,
  ICategoryViewModel,
  IColorViewModel,
  ITaskCategory,
} from '@mono-calendar/interface';
import { ChangeCategoryEvent, DeleteCategoryEvent } from '@mono-calendar/contracts';
import { CATEGORY_NOT_FOUND_ERROR } from './constans';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findCategories(
    userId: string,
    categories: ITaskCategory[],
  ): Promise<Pick<ICategory, 'id'>[]> {
    return this.prismaService.getClient().category.findMany({
      where: { id: { in: categories.map((category) => category.categoryId) }, userId: userId },
      select: { id: true },
    });
  }

  async getAllUserCategory(
    userId: string,
  ): Promise<(ICategoryViewModel & Partial<Pick<IColorViewModel, 'color'>>)[]> {
    const categories = await this.prismaService.getClient().categoryColor.findMany({
      where: { userId },
      select: { category: { select: { id: true, name: true } }, color: true },
    });
    const returnCategories: (ICategoryViewModel & Partial<Pick<IColorViewModel, 'color'>>)[] =
      categories.map((category) => ({
        color: category.color,
        ...category.category,
      }));
    const defaultCategories = await this.prismaService.getClient().category.findMany({
      where: { id: { notIn: returnCategories.map((category) => category.id) }, isSystem: true },
      select: { id: true, name: true },
    });
    returnCategories.push(...defaultCategories);
    return returnCategories;
  }

  async createCategory(
    userId: string,
    data: Pick<ICategory, 'color' | 'name'>,
  ): Promise<ICategoryViewModel & { color: string }> {
    return this.prismaService.getClient().$transaction(async (tx) => {
      const newCategory = await tx.category.create({
        data: { userId, isSystem: false, name: data.name },
        select: { name: true, id: true },
      });
      const newColor = await tx.categoryColor.create({
        data: { userId, color: data.color, categoryId: newCategory.id },
        select: { color: true },
      });
      return { ...newCategory, ...newColor };
    });
  }

  async updateCategory(
    userId: string,
    categoryId: string,
    data: Pick<ICategory, 'color'>,
  ): Promise<ICategoryViewModel & { color: string }> {
    return this.prismaService.getClient().$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException(CATEGORY_NOT_FOUND_ERROR);
      }
      await tx.outboxEvent.create({
        data: { topic: ChangeCategoryEvent.topic, payload: { categoryId, userId } },
      });
      const updatedCategory = await tx.categoryColor.upsert({
        where: { userId_categoryId: { userId, categoryId } },
        update: data,
        create: { ...data, userId: userId, categoryId: categoryId },
        select: { userId: true, color: true, category: { select: { id: true, name: true } } },
      });
      return {
        color: updatedCategory.color,
        userId: updatedCategory.userId,
        ...updatedCategory.category,
      };
    });
  }

  async deleteCategory(userId: string, categoryId: string): Promise<number> {
    return this.prismaService.getClient().$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: categoryId, userId },
      });
      if (!category) {
        throw new BadRequestException(CATEGORY_NOT_FOUND_ERROR);
      }
      await tx.taskCategory.deleteMany({ where: { categoryId: categoryId } });
      await tx.categoryColor.deleteMany({ where: { categoryId: categoryId } });
      const result = await tx.category.deleteMany({ where: { id: categoryId, userId } });
      if (result.count === 0) {
        return 0;
      }
      await tx.outboxEvent.create({
        data: { topic: DeleteCategoryEvent.topic, payload: { categoryId } },
      });
      return 1;
    });
  }

  async getCategoryColorAndName(
    userId: string,
    categoryId: string,
  ): Promise<{ color: string; name: string } | null> {
    const category = await this.prismaService.getClient().category.findUnique({
      where: { id: categoryId },
      select: { name: true, color: { select: { color: true }, where: { userId } } },
    });
    if (category) {
      return {
        name: category.name,
        color: category.color[0].color,
      };
    }
    return category;
  }

  async getCategories(
    userId: string,
    categoryIds: string[],
  ): Promise<(ICategoryViewModel & Pick<IColorViewModel, 'color' | 'userId'>)[]> {
    const categories = await this.prismaService.getClient().categoryColor.findMany({
      where: { userId, categoryId: { in: categoryIds } },
      select: { userId: true, color: true, category: { select: { id: true, name: true } } },
    });
    return categories.map((category) => ({
      userId: category.userId,
      color: category.color,
      ...category.category,
    }));
  }
}

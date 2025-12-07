import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../category.repository';
import { ICategory, ICategoryViewModel, IColorViewModel } from '@mono-calendar/interface';
import { CATEGORY_NOT_FOUND_ERROR } from '../constans';

@Injectable()
export class CategoryCoreService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategories(
    userId: string,
  ): Promise<(ICategoryViewModel & Partial<Pick<IColorViewModel, 'color'>>)[]> {
    return this.categoryRepository.getAllUserCategory(userId);
  }

  async createCategory(
    userId: string,
    data: Pick<ICategory, 'color' | 'name'>,
  ): Promise<ICategoryViewModel & { color: string }> {
    return this.categoryRepository.createCategory(userId, data);
  }

  async deleteCategory(userId: string, categoryId: string): Promise<void> {
    const count = await this.categoryRepository.deleteCategory(userId, categoryId);
    if (count === 0) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR);
    }
  }

  // нужно добавить создание категории
  async updateCategory(
    userId: string,
    categoryId: string,
    data: Pick<ICategory, 'color'>,
  ): Promise<ICategoryViewModel & { color: string }> {
    const updatedCategories = await this.categoryRepository.updateCategory(
      userId,
      categoryId,
      data,
    );
    return updatedCategories;
  }
}

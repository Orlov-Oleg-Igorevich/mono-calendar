import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryCoreService } from './service/category-core.service';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryRepository, CategoryCoreService],
  exports: [CategoryCoreService, CategoryRepository],
})
export class CategoryModule {}

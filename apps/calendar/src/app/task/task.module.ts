import { Module } from '@nestjs/common';
import { TaskEventController } from './controllers/task-event.controller';
import { TaskController } from './controllers/task.controller';
import { TaskCoreService } from './services/task-core.service';
import { TaskViewService } from './services/task-view.service';
import { TaskViewRepository } from './repositories/task-view.repo';
import { TaskRepository } from './repositories/task.repository';
import { MLModule } from '../ML-client/ml.module';
import { AlgorithmModule } from '../algorithm-client/algorithm.module';
import { AccountClientModule } from '../account-client/account-client.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [MLModule, AlgorithmModule, AccountClientModule, CategoryModule],
  controllers: [TaskEventController, TaskController],
  providers: [TaskCoreService, TaskViewService, TaskViewRepository, TaskRepository],
})
export class TaskModule {}

import { CreateTaskDto } from '@mono-calendar/dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskEntity } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { AccountClientService } from '../../account-client/account-client.service';
import {
  ICategoryViewModel,
  IColorViewModel,
  ITask,
  ITaskCategory,
  ITaskViewModel,
  IUserViewModel,
} from '@mono-calendar/interface';
import {
  TASK_CATEGORY_IDS_INVALID_ERROR,
  TASK_NOT_FOUND_ERROR,
  TASK_SHARE_IDS_INVALID_ERROR,
  USER_NOT_HAVE_PERMISSION_CHANGE_TASK_ERROR,
} from '../constans/task-error.constans';
import { CategoryRepository } from '../../category/category.repository';
import { CalculateState, CalendarGetCalendar } from '@mono-calendar/contracts';
import { MLService } from '../../ML-client/ml.service';
import { AlgorithmService } from '../../algorithm-client/algorithm.service';
import { TaskViewRepository } from '../repositories/task-view.repo';

@Injectable()
export class TaskCoreService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskViewRepository: TaskViewRepository,
    private readonly accountClientService: AccountClientService,
    private readonly categoryRepository: CategoryRepository,
    private readonly mlService: MLService,
    private readonly algorithmService: AlgorithmService,
  ) {}

  async createTask(userId: string, taskFields: CreateTaskDto.Request): Promise<ITaskViewModel> {
    const taskEntity = TaskEntity.createFromDto(userId, taskFields);
    let calculateCategories: string[], calculateTime: number, onTheStreet: boolean;

    // Запускаем алгоритм Влада
    if (taskEntity.categories.length === 0) {
      const res = await this.mlService.calculateCategories(taskEntity.title);
      calculateCategories = res.categories;
      onTheStreet = res.onTheStreet;

      const systemCategories = await this.taskRepository.getSystemCategories();
      let count = 1;

      const categories: ITaskCategory[] = [];
      for (const category of calculateCategories) {
        const systemCategory = systemCategories.find(
          (systemCategory) => systemCategory.name === category,
        );
        if (systemCategory) {
          categories.push({
            priority: count,
            categoryId: systemCategory.id,
          });
          count += 1;
        }
      }

      taskEntity.setCategories(categories);

      const res2 = await this.mlService.calculateTime(taskEntity.title, calculateCategories);
      calculateTime = res2.timeInMinutes;
    }

    // Запускаем алгоритм Влада
    if (isNaN(taskEntity.startDate.getTime())) {
      const startDateFrom = new Date();
      const startDateTo = new Date();
      startDateFrom.setMonth(startDateFrom.getMonth() + 1);

      const slots = await this.taskViewRepository.getAllBusySlot(
        userId,
        startDateFrom,
        startDateTo,
      );
      const time = await this.algorithmService.calculateTime({
        onTheStreet: onTheStreet!,
        durationInMinutes: calculateTime!,
        busyTimes: slots,
      });
      if (!time || time.status === CalculateState.FAILED) {
        const date = new Date();
        date.setHours(date.getHours() + 24);
        date.setMinutes(0);
        taskEntity.startDate = date;
        taskEntity.endDate = null;
      } else {
        taskEntity.startDate = time.startData;
        taskEntity.endDate = time.endDate;
      }
    }

    if (taskEntity.shares) {
      await this.validateSubscribers(
        userId,
        taskEntity.shares.map((share) => share.sharedWithUserId),
      );
    }
    if (taskEntity.categories) {
      await this.validateCategories(userId, taskEntity.categories);
    }
    const task = await this.taskRepository.createTask(taskEntity);
    if (!task) {
      throw new BadRequestException(TASK_NOT_FOUND_ERROR);
    }
    const { shares, categories, description, ...returnValues } = task;

    return {
      ...returnValues,
      isShared: false,
      category1Id: task.categories[0]?.categoryId || null,
      userId: task.authorId,
      taskId: task.id,
    };
  }

  async validateSubscribers(userId: string, shareIds: string[]): Promise<boolean> {
    const existingShare = await this.accountClientService.checkUsersExist(userId, shareIds);
    if (existingShare.length !== shareIds.length) {
      const invalidIds = shareIds.filter(
        (id) => !existingShare.find((existingId) => existingId === id),
      );
      throw new BadRequestException({
        message: TASK_SHARE_IDS_INVALID_ERROR,
        ids: invalidIds,
      });
    }
    return true;
  }

  async validateCategories(userId: string, categories: ITaskCategory[]): Promise<boolean> {
    const existingCategories = await this.categoryRepository.findCategories(userId, categories);
    if (categories.length !== existingCategories.length) {
      const invalidIds = categories
        .map((c) => c.categoryId)
        .filter((id) => !existingCategories.find((cat) => cat.id === id));
      throw new BadRequestException({
        message: TASK_CATEGORY_IDS_INVALID_ERROR,
        ids: invalidIds,
      });
    }
    return true;
  }

  async updateTask(
    userId: string,
    taskId: string,
    updateData: Partial<ITask>,
  ): Promise<ITaskViewModel> {
    const existingTask = await this.taskRepository.getTask(taskId);
    if (!existingTask) {
      throw new NotFoundException(TASK_NOT_FOUND_ERROR);
    }
    const taskEntity = new TaskEntity(existingTask);
    if (taskEntity.authorId !== userId) {
      new ForbiddenException(USER_NOT_HAVE_PERMISSION_CHANGE_TASK_ERROR);
    }

    if (updateData.shares) {
      const subscriberIds = updateData.shares.map((s) => s.sharedWithUserId);
      await this.validateSubscribers(userId, subscriberIds);
    }

    if (updateData.categories) {
      await this.validateCategories(userId, updateData.categories);
    }

    taskEntity.update(updateData);
    const updatedTask = await this.taskRepository.updateTask(taskEntity);
    if (!updatedTask) {
      throw new NotFoundException(TASK_NOT_FOUND_ERROR);
    }
    const { shares, categories, description, ...returnValues } = updatedTask;
    return {
      ...returnValues,
      userId: userId,
      taskId: updatedTask.id,
      isShared: false,
      category1Id: updatedTask.categories[0]?.categoryId || null,
    };
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const count = await this.taskRepository.deleteTask(userId, taskId);
    if (count === 0) {
      throw new NotFoundException(TASK_NOT_FOUND_ERROR);
    }
    return;
  }

  async getTask(taskId: string): Promise<{
    task: ITask;
    users: IUserViewModel[];
    categories: (ICategoryViewModel & Pick<IColorViewModel, 'color' | 'userId'>)[];
  }> {
    const task = await this.taskRepository.getTask(taskId);
    if (!task) {
      throw new NotFoundException(TASK_NOT_FOUND_ERROR);
    }
    const userIds = task.shares.map((share) => share.sharedWithUserId);
    userIds.push(task.authorId);
    const users = await this.taskRepository.getUsers(userIds);
    const categoryIds = task.categories.map((category) => category.categoryId);
    const categories = await this.categoryRepository.getCategories(task.authorId, categoryIds);
    return {
      task,
      users,
      categories,
    };
  }

  async getCalendar(userId: string): Promise<CalendarGetCalendar.Response> {
    return this.taskRepository.getCalendar(userId);
  }
}

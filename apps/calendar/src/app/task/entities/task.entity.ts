import { CreateTaskDto } from '@mono-calendar/dto';
import { ITask, ITaskCategory, ITaskShare } from '@mono-calendar/interface';

// task.entity.ts
export class TaskEntity implements ITask {
  id: string;
  authorId: string;
  title: string;
  description: string | null;
  address: string | null;
  startDate: Date;
  endDate: Date | null;
  color: string | null;
  private _categories: ITaskCategory[];
  private _shares: ITaskShare[];
  private _originalCategories: ITaskCategory[] = []; //  исходные ID
  private _originalShares: string[] = []; //  исходные ID

  get categories(): ITaskCategory[] {
    return [...this._categories];
  }

  get shares(): ITaskShare[] {
    return [...this._shares];
  }

  static createFromDto(userId: string, dto: CreateTaskDto.Request): TaskEntity {
    const entity = new TaskEntity({
      id: crypto.randomUUID(),
      authorId: userId,
      title: dto.title,
      description: dto.description ?? null,
      address: dto.address ?? null,
      startDate: dto.startDate ?? new Date(''),
      endDate: dto.endDate ?? null,
      color: dto.color ?? null,
      categories: [],
      shares: [],
    });

    entity.setCategories(dto.categories || []);
    entity.setShares(dto.shares || []);
    return entity;
  }

  public constructor(task: ITask) {
    this.id = task.id;
    this.authorId = task.authorId;
    this.title = task.title;
    this.description = task.description;
    this.address = task.address;
    this.startDate = task.startDate;
    this.endDate = task.endDate;
    this.color = task.color;
    this._categories = task.categories;
    this._shares = task.shares;
    this._originalCategories = task.categories;
    this._originalShares = task.shares.map((share) => share.sharedWithUserId);
  }

  setCategories(categories: ITaskCategory[]): void {
    const uniqueCategories = new Map<string, ITaskCategory>();
    for (const cat of categories) {
      if (!uniqueCategories.has(cat.categoryId)) {
        uniqueCategories.set(cat.categoryId, cat);
      }
    }
    this._categories = Array.from(uniqueCategories.values());
  }

  setShares(shares: ITaskShare[]): void {
    const uniqueShares = new Map<string, ITaskShare>();
    for (const share of shares) {
      if (!uniqueShares.has(share.sharedWithUserId) && share.sharedWithUserId !== this.authorId) {
        uniqueShares.set(share.sharedWithUserId, share);
      }
    }
    this._shares = Array.from(uniqueShares.values());
  }

  update(partial: Partial<ITask>): TaskEntity {
    if (partial.title !== undefined) this.title = partial.title;
    if (partial.description !== undefined) this.description = partial.description;
    if (partial.address !== undefined) this.address = partial.address;
    if (partial.startDate !== undefined) this.startDate = partial.startDate;
    if (partial.endDate !== undefined) this.endDate = partial.endDate;
    if (partial.color !== undefined) this.color = partial.color;

    if (partial.categories) this.setCategories(partial.categories);
    if (partial.shares) this.setShares(partial.shares);

    return this;
  }

  /**
   * Получить изменение категорий на задачу, для синхронизации с бд
   */
  getCategoriesChanges(): {
    toAdd: ITaskCategory[];
    toRemove: string[];
    toPriorityChanges: ITaskCategory[];
  } {
    const toAdd = this._categories.filter(
      (cat) => !this._originalCategories.find((origCat) => origCat.categoryId === cat.categoryId),
    );
    const toRemoveTasks = this._originalCategories.filter(
      (origCat) => !this._categories.find((cat) => cat.categoryId === origCat.categoryId),
    );
    const toPriorityChanges = this._categories.filter((category) =>
      this._originalCategories.find(
        (originalCategory) =>
          category.categoryId === originalCategory.categoryId &&
          category.priority !== originalCategory.priority,
      ),
    );
    const toRemove = toRemoveTasks.map((toRemoveTask) => toRemoveTask.categoryId);
    return { toAdd, toRemove, toPriorityChanges };
  }

  /**
   * Получить изменение подписчиков на задачу, для синхронизации с бд
   */
  getSharesChanges(): {
    toAdd: ITaskShare[];
    toRemove: string[];
  } {
    const toAdd = this._shares.filter(
      (share) =>
        !this._originalShares.find((originalShareId) => originalShareId === share.sharedWithUserId),
    );
    const toRemove = this._originalShares.filter(
      (originalShareId) =>
        !this._shares.find((share) => share.sharedWithUserId === originalShareId),
    );
    return { toAdd, toRemove };
  }

  /**
   * Поля для записи в бд(без отношений)
   */
  returnSelfFields(): Omit<ITask, 'categories' | 'shares'> {
    return {
      id: this.id,
      authorId: this.authorId,
      title: this.title,
      description: this.description,
      address: this.address,
      startDate: this.startDate,
      endDate: this.endDate,
      color: this.color,
    };
  }
}

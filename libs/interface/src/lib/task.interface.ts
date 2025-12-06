export interface ITaskCategory {
  categoryId: string;
  priority: number;
}

export interface ITaskShare {
  sharedWithUserId: string;
}

export interface ITask {
  id: string;
  authorId: string;

  title: string;
  description: string | null;
  address: string | null;
  startDate: Date;
  endDate: Date | null;
  color: string | null;

  categories: ITaskCategory[];
  shares: ITaskShare[];
}

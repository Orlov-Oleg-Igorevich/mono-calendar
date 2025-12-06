export interface ITaskViewModel {
  userId: string;
  taskId: string;

  authorId: string;
  isShared: boolean;

  title: string;
  address: string | null;
  startDate: Date;
  endDate: Date | null;
  color: string | null;

  category1Id: string | null;
}

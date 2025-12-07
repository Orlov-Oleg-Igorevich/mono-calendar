import {
  ITask,
  ITaskCategory,
  ITaskShare,
  ITaskViewModel,
  RequestType,
} from '@mono-calendar/interface';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class TaskCategory implements ITaskCategory {
  @IsString()
  categoryId: string;

  @IsNumber()
  priority: number;
}

export class TaskShare implements ITaskShare {
  @IsString()
  sharedWithUserId: string;
}

export namespace CreateTaskDto {
  export const topic = '';
  export const path = 'calendar';
  export const requestType = RequestType.POST;

  export class Request implements Pick<ITask, 'title'>, Partial<ITask> {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @Transform(({ value }) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    })
    startDate?: Date;

    @IsOptional()
    @Transform(({ value }) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    })
    endDate?: Date;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(7)
    @Matches(/^#([0-9a-f]{6}|[0-9a-f]{3})$/)
    color?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TaskCategory)
    categories?: TaskCategory[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TaskShare)
    shares?: TaskShare[];

    @IsOptional()
    @IsString()
    additionalSettings?: string;
  }
  export class Response implements ITaskViewModel {
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
}

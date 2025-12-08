import {
  ITask,
  ITaskCategory,
  ITaskShare,
  ITaskViewModel,
  RequestType,
} from '@mono-calendar/interface';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ChangeTaskCategoriesFieldsDto implements ITaskCategory {
  @IsString()
  categoryId: string;

  @IsNumber()
  priority: number;
}

export class ChangeTaskSharesFieldsDto implements ITaskShare {
  @IsString()
  sharedWithUserId: string;
}

export namespace ChangeTaskDto {
  export const topic = ':id';
  export const path = 'calendar';
  export const requestType = RequestType.PATCH;

  export class Request implements Partial<ITask> {
    @IsOptional()
    @IsString()
    title?: string;

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
      if (value === new Date(0).toISOString()) {
        return null;
      }
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    })
    endDate?: Date | null;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(7)
    @Matches(/^#([0-9a-f]{6}|[0-9a-f]{3})$/)
    color?: string | null;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChangeTaskCategoriesFieldsDto)
    categories?: ChangeTaskCategoriesFieldsDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChangeTaskSharesFieldsDto)
    shares?: ChangeTaskSharesFieldsDto[];
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

import { IsDate, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum CalculateState {
  SUCCESS = 'success',
  FAILED = 'fail',
}

export namespace AlgorithmCalculateTime {
  export const topic = 'algorithm.calculate-time.command';

  export class Request {
    busyTimes: { startDate: Date; endDate: Date | null }[];
    durationInMinutes: number;
    onTheStreet: boolean;
  }
  export class Response {
    @Transform(({ value }) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    })
    @IsDate({ message: 'startDate must be a valid date' })
    startData: Date;

    @Transform(({ value }) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    })
    @IsDate({ message: 'endDate must be a valid date' })
    endDate: Date;

    @IsString()
    @IsEnum(CalculateState)
    status: string;
  }
}

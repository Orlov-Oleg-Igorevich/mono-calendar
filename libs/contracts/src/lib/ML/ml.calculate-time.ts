import { IsNumber } from 'class-validator';

export namespace MLCalculateTime {
  export const topic = 'ml.calculate-time.command';

  export class Request {
    userInput: string;

    categories: string[];
  }
  export class Response {
    @IsNumber()
    timeInMinutes: number;
  }
}

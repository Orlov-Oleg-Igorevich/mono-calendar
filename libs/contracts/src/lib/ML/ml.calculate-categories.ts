import { IsArray, IsBoolean, IsString } from 'class-validator';

export namespace MLCalculateCategories {
  export const topic = 'ml.calculate-categories.command';

  export class Request {
    userInput: string;
  }
  export class Response {
    @IsArray()
    @IsString({ each: true })
    categories: string[];

    @IsBoolean()
    onTheStreet: boolean;
  }
}

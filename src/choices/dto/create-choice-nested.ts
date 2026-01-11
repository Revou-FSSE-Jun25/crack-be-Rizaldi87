import { IsBoolean, IsString } from 'class-validator';

export class CreateChoiceNestedDto {
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { CreateChoiceNestedDto } from 'src/choices/dto/create-choice-nested';

export class CreateQuestionNestedDto {
  @IsString()
  questionText: string;

  @ValidateNested({ each: true })
  @Type(() => CreateChoiceNestedDto)
  choices: CreateChoiceNestedDto[];
}

import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { UpdateChoiceDtoNested } from 'src/choices/dto/update-choice-nested';

export class UpdateQuestionNestedDto {
  @IsString()
  questionText: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChoiceDtoNested)
  choices: UpdateChoiceDtoNested[];
}

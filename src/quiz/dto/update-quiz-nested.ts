import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { UpdateQuestionNestedDto } from 'src/questions/dto/update-question-nested';

export class UpdateQuizWithQuestionsDto {
  @IsString()
  title: string;

  @IsNumber()
  lessonId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionNestedDto)
  questions: UpdateQuestionNestedDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionNestedDto } from 'src/questions/dto/create-question-nested';
import { CreateQuestionDto } from 'src/questions/dto/create-question.dto';

export class CreateQuizWithQuestionDto {
  @ApiProperty({ example: 1, description: 'Lesson ID' })
  @IsNotEmpty()
  @IsNumber()
  lessonId: number;

  @ApiProperty({ example: 'Quiz 1', description: 'Quiz title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: [CreateQuestionNestedDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionNestedDto)
  questions: CreateQuestionNestedDto[];
}

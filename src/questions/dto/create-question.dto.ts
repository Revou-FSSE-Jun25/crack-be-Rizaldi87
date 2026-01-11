import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateChoiceDto } from 'src/choices/dto/create-choice.dto';

export class CreateQuestionDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  quizId: number;

  @ApiProperty({ example: 'what is verb?' })
  @IsNotEmpty()
  @IsString()
  questionText: string;

  @ApiProperty({ type: [CreateChoiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChoiceDto)
  choices: CreateChoiceDto[];
}

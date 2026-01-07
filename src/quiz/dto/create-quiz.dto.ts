import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuizDto {
  @ApiProperty({ example: 1, description: 'Lesson ID' })
  @IsNotEmpty()
  @IsNumber()
  lessonId: number;

  @ApiProperty({ example: 'Quiz 1', description: 'Quiz title' })
  @IsNotEmpty()
  @IsString()
  title: string;
}

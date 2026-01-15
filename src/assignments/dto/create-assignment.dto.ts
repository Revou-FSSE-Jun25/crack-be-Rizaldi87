import { IsInt, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
  @Type(() => Number)
  @IsInt()
  lessonId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  dueAt: string;

  @Type(() => Number)
  @IsInt()
  maxAttempts: number;
}

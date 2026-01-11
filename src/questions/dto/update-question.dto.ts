import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @ApiPropertyOptional({ example: 'What is Prisma?' })
  @IsOptional()
  @IsString()
  questionText?: string;
}

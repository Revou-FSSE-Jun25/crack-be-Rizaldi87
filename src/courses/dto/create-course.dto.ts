import { ApiProperty } from '@nestjs/swagger';
import { COURSESTATUS } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Learning English' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn English is good' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'published' })
  @IsOptional()
  @IsEnum(COURSESTATUS)
  status?: COURSESTATUS;
}

import { Type } from 'class-transformer';
import { IsInt, Min, Max } from 'class-validator';

export class UpdateScoreDto {
  @Type(() => Number) // 🔥 INI KUNCI
  @IsInt()
  @Min(0)
  @Max(100)
  score: number;
}

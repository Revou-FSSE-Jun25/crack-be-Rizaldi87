import { IsBoolean, IsString } from 'class-validator';

export class UpdateChoiceDtoNested {
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

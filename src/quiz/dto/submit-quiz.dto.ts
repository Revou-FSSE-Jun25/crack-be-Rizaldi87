import { IsArray, IsInt } from 'class-validator';

export class SubmitQuizAnswerDto {
  @IsInt()
  questionId: number;

  @IsInt()
  choiceId: number;
}

export class SubmitQuizDto {
  @IsArray()
  answers: SubmitQuizAnswerDto[];
}

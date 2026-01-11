import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizRepository } from './quiz.repository';
import { CreateQuizWithQuestionDto } from './dto/create-quizwithquiestions';

@Injectable()
export class QuizService {
  constructor(private readonly repo: QuizRepository) {}
  create(createQuizDto: CreateQuizDto) {
    return this.repo.create(createQuizDto);
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return this.repo.update(id, updateQuizDto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }

  countQuizzes() {
    return this.repo.countQuizzes();
  }

  createWithQuestions(createQuizDto: CreateQuizWithQuestionDto) {
    return this.repo.createWithQuestions(createQuizDto);
  }

  updateQuizWithQuestion(quizId: number, dto: any) {
    return this.repo.updateQuizWithQuestion(quizId, dto);
  }
}

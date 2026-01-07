import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizRepository } from './quiz.repository';

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
}

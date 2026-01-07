import { Injectable } from '@nestjs/common';
import { CreateLessonprogressDto } from './dto/create-lessonprogress.dto';
import { UpdateLessonprogressDto } from './dto/update-lessonprogress.dto';
import { LessonProgressRepository } from './lessonprogress.repository';

@Injectable()
export class LessonprogressService {
  constructor(private readonly repo: LessonProgressRepository) {}
  create(createLessonprogressDto: CreateLessonprogressDto) {
    return this.repo.create(createLessonprogressDto);
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  update(id: number, updateLessonprogressDto: UpdateLessonprogressDto) {
    return this.repo.update(id, updateLessonprogressDto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }
}

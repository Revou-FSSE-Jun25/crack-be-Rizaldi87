import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsRepository } from './lessons.repository';

@Injectable()
export class LessonsService {
  constructor(private readonly repo: LessonsRepository) {}
  create(createLessonDto: CreateLessonDto) {
    return this.repo.create(createLessonDto);
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    return this.repo.update(id, updateLessonDto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }

  findAllbyCourseId(courseId: number) {
    return this.repo.findAllbyCourseId(courseId);
  }

  countAllLessons() {
    return this.repo.countAllLessons();
  }
}

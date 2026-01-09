import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesRepository } from './courses.repository';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';

@Injectable()
export class CoursesService {
  constructor(
    private readonly repo: CoursesRepository,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}
  create(createCourseDto: CreateCourseDto) {
    return this.repo.create(createCourseDto);
  }

  findAllPublished() {
    return this.repo.findAllPublished();
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.repo.update(id, updateCourseDto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }

  enroll(userId: number, courseId: number) {
    return this.enrollmentsService.enroll(userId, courseId);
  }

  unEnroll(userId: number, courseId: number) {
    return this.enrollmentsService.unEnroll(userId, courseId);
  }

  countAllCourses() {
    return this.repo.countAllCourses();
  }
}

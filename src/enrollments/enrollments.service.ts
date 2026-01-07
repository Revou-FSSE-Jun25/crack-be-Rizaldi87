import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentsRepository } from './enrollments.repository';
import { UsersRepository } from 'src/users/users.repository';
import { CoursesRepository } from 'src/courses/courses.repository';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly repo: EnrollmentsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly coursesRepo: CoursesRepository,
  ) {}
  create(createEnrollmentDto: CreateEnrollmentDto) {
    //admin only
    return this.repo.create(createEnrollmentDto);
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.repo.update(id, updateEnrollmentDto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }

  async enroll(userId: number, courseId: number) {
    const user = await this.usersRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const course = await this.coursesRepo.findOne(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== 'PUBLISHED') {
      throw new BadRequestException('Course is not available for enrollment');
    }

    const existingEnrollment = await this.repo.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (existingEnrollment) {
      throw new NotFoundException('User already enrolled in the course');
    }

    return await this.repo.create({ userId, courseId });
  }

  async unEnroll(userId: number, courseId: number) {
    const enrollment = await this.repo.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return this.repo.remove(enrollment.id);
  }
}

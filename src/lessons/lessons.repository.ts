import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    return await this.prisma.lesson.create({ data: dto });
  }

  async findAll() {
    return await this.prisma.lesson.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.lesson.findUnique({ where: { id } });
  }

  async update(id: number, dto: UpdateLessonDto) {
    return await this.prisma.lesson.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return await this.prisma.lesson.delete({ where: { id } });
  }

  async findAllbyCourseId(courseId: number) {
    return await this.prisma.lesson.findMany({
      where: { courseId: Number(courseId) },
    });
  }

  async countAllLessons() {
    return await this.prisma.lesson.count();
  }
}

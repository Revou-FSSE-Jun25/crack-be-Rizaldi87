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
      orderBy: { order: 'asc' },
    });
  }

  async countAllLessons() {
    return await this.prisma.lesson.count();
  }

  // lesson.service.ts
  async reorderLessons(
    courseId: number,
    orders: { id: number; order: number }[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      // STEP 1: shift sementara
      await tx.lesson.updateMany({
        where: { courseId },
        data: {
          order: {
            increment: 1000,
          },
        },
      });

      // STEP 2: set order final
      for (const item of orders) {
        await tx.lesson.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
    });
  }
  countLessonsByCourseId(courseId: number) {
    return this.prisma.lesson.count({ where: { courseId } });
  }
}

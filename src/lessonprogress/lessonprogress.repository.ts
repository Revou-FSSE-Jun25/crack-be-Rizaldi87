import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.lessonProgress.findMany();
  }

  findOne(id: number) {
    return this.prisma.lessonProgress.findUnique({ where: { id } });
  }

  create(data) {
    return this.prisma.lessonProgress.create({ data });
  }

  update(id: number, data) {
    return this.prisma.lessonProgress.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.lessonProgress.delete({ where: { id } });
  }

  findByUserIdAndLessonId(userId: number, lessonId: number) {
    return this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
  }

  upsertLessonProgress(userId: number, lessonId: number) {
    return this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });
  }

  countCompletedByUserAndCourse(userId: number, courseId: number) {
    return this.prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          courseId,
        },
      },
    });
  }
}

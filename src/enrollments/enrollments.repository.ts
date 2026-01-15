import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data) {
    return this.prisma.enrollment.create({ data });
  }

  findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            image: true,
            description: true,
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.enrollment.findUnique({ where: { id } });
  }

  update(id: number, data) {
    return this.prisma.enrollment.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.enrollment.delete({ where: { id } });
  }

  findByUserIdAndCourseId(userId: number, courseId: number) {
    return this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                progresses: {
                  where: {
                    userId,
                  },
                  select: {
                    isCompleted: true,
                    completedAt: true,
                  },
                },
                quizzes: {
                  include: {
                    questions: {
                      include: {
                        choices: true,
                      },
                    },
                  },
                },
                assignments: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    dueAt: true,
                    maxAttempts: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findByUserId(userId: number) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            image: true,
            description: true,
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
    });
  }
  updateEnrollProgress(
    id: number,
    progress: number,
    completedLessons: number,
    totalLessons: number,
  ) {
    return this.prisma.enrollment.update({
      where: { id },
      data: {
        progress,
        status: completedLessons === totalLessons ? 'COMPLETED' : 'ONGOING',
        completedAt: completedLessons === totalLessons ? new Date() : null,
      },
    });
  }
}

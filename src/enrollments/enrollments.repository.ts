import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data) {
    return this.prisma.enrollment.create({ data });
  }

  findAll() {
    return this.prisma.enrollment.findMany();
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
      where: { userId_courseId: { userId, courseId } },
    });
  }
}

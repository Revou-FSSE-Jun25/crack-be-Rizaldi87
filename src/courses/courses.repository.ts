import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesRepository {
  // Repository methods will go here
  constructor(private readonly prisma: PrismaService) {}

  async create(data) {
    return await this.prisma.course.create({ data });
  }

  async findAll() {
    return await this.prisma.course.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.course.findUnique({ where: { id } });
  }

  async update(id: number, data) {
    return await this.prisma.course.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.course.delete({ where: { id } });
  }

  async findAllPublished() {
    return await this.prisma.course.findMany({
      where: {
        status: 'PUBLISHED',
      },
    });
  }
}

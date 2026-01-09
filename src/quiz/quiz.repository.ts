import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.quiz.findMany();
  }

  async findOne(id: number) {
    return this.prisma.quiz.findUnique({ where: { id } });
  }

  async create(data) {
    return this.prisma.quiz.create({ data });
  }

  async update(id: number, data) {
    return this.prisma.quiz.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.quiz.delete({ where: { id } });
  }

  async countQuizzes() {
    return this.prisma.quiz.count();
  }
}

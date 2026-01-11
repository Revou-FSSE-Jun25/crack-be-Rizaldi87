import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.question.findMany();
  }

  findOne(id: number) {
    return this.prisma.question.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.question.delete({ where: { id } });
  }

  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        questionText: dto.questionText,
        quiz: {
          connect: { id: dto.quizId },
        },
        choices: {
          create: dto.choices,
        },
      },
    });
  }

  update(id: number, dto: UpdateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data: {
        questionText: dto.questionText,
      },
    });
  }

  findAllByQuizId(quizId: number) {
    return this.prisma.question.findMany({ where: { quizId } });
  }
}

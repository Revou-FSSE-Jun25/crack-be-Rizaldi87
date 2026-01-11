import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizWithQuestionDto } from './dto/create-quizwithquiestions';
import { UpdateQuizWithQuestionsDto } from './dto/update-quiz-nested';

@Injectable()
export class QuizRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        lesson: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.quiz.findUnique({ where: { id } });
  }

  async create(dto: CreateQuizDto) {
    return this.prisma.quiz.create({ data: dto });
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

  async createWithQuestions(dto: CreateQuizWithQuestionDto) {
    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        lessonId: dto.lessonId,
        questions: {
          create: dto.questions.map((q) => ({
            questionText: q.questionText,
            choices: {
              create: q.choices.map((c) => ({
                text: c.text,
                isCorrect: c.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });
  }

  async updateQuizWithQuestion(
    quizId: number,
    dto: UpdateQuizWithQuestionsDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.quiz.update({
        where: { id: quizId },
        data: {
          title: dto.title,
          lessonId: dto.lessonId,
        },
      });

      await tx.choice.deleteMany({
        where: {
          question: {
            quizId,
          },
        },
      });

      await tx.question.deleteMany({
        where: {
          quizId,
        },
      });

      await tx.question.createMany({
        data: dto.questions.map((q) => ({
          questionText: q.questionText,
          quizId,
        })),
      });

      const questions = await tx.question.findMany({
        where: {
          quizId,
        },
        orderBy: { id: 'asc' },
      });

      const choiceData = dto.questions.flatMap((q, index) =>
        q.choices.map((c) => ({
          text: c.text,
          isCorrect: c.isCorrect,
          questionId: questions[index].id,
        })),
      );

      await tx.choice.createMany({
        data: choiceData,
      });

      return tx.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            include: {
              choices: true,
            },
          },
        },
      });
    });
  }
}

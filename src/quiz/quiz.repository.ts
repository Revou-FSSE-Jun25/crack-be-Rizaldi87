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

  async findQuizzesByCourseId(courseId: number) {
    return this.prisma.quiz.findMany({
      where: {
        lesson: {
          courseId,
        },
      },
      orderBy: {
        id: 'asc',
      },
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

  findQuizWithQuestions(quizId: number) {
    return this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: true,
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });
  }

  async submitQuizTransaction(data: {
    userId: number;
    quizId: number;
    lessonId: number;
    courseId: number;
    totalQuestions: number;
    score: number;
    answers: {
      questionId: number;
      choiceId: number;
      isCorrect: boolean;
    }[];
  }) {
    const {
      userId,
      quizId,
      lessonId,
      courseId,
      totalQuestions,
      score,
      answers,
    } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Simpan / update QuizAnswer
      for (const a of answers) {
        await tx.quizAnswer.upsert({
          where: {
            studentId_quizId_questionId: {
              studentId: userId,
              quizId,
              questionId: a.questionId,
            },
          },
          update: {
            choiceId: a.choiceId,
            isCorrect: a.isCorrect,
          },
          create: {
            studentId: userId,
            quizId,
            questionId: a.questionId,
            choiceId: a.choiceId,
            isCorrect: a.isCorrect,
          },
        });
      }

      // 2️⃣ Simpan QuizResult nanti di cek dipakai atau tidak
      const result = await tx.quizResult.upsert({
        where: {
          studentId_quizId: {
            studentId: userId,
            quizId,
          },
        },
        update: {
          score,
        },
        create: {
          studentId: userId,
          quizId,
          score,
        },
      });

      // 3️⃣ Mark LessonProgress completed
      await tx.lessonProgress.upsert({
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

      // 4️⃣ Hitung ulang progress course
      const totalLessons = await tx.lesson.count({
        where: { courseId },
      });

      const completedLessons = await tx.lessonProgress.count({
        where: {
          userId,
          isCompleted: true,
          lesson: { courseId },
        },
      });

      const progress =
        totalLessons === 0
          ? 0
          : Number(((completedLessons / totalLessons) * 100).toFixed(2));

      const enrollment = await tx.enrollment.update({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        data: {
          progress,
          status: progress === 100 ? 'COMPLETED' : 'ONGOING',
          completedAt: progress === 100 ? new Date() : null,
        },
      });

      return {
        score,
        totalQuestions,
        progress,
        enrollmentStatus: enrollment.status,
      };
    });
  }
}

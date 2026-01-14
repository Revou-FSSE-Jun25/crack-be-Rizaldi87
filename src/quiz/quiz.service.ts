import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizRepository } from './quiz.repository';
import { CreateQuizWithQuestionDto } from './dto/create-quizwithquiestions';

@Injectable()
export class QuizService {
  constructor(private readonly repo: QuizRepository) {}
  create(createQuizDto: CreateQuizDto) {
    return this.repo.create(createQuizDto);
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  update(id: number, updateQuizDto: UpdateQuizDto) {
    return this.repo.update(id, updateQuizDto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }

  countQuizzes() {
    return this.repo.countQuizzes();
  }

  createWithQuestions(createQuizDto: CreateQuizWithQuestionDto) {
    return this.repo.createWithQuestions(createQuizDto);
  }

  updateQuizWithQuestion(quizId: number, dto: any) {
    return this.repo.updateQuizWithQuestion(quizId, dto);
  }

  findAllByCourseId(courseId: number) {
    return this.repo.findQuizzesByCourseId(courseId);
  }

  async submitQuiz(
    userId: number,
    quizId: number,
    answers: { questionId: number; choiceId: number }[],
  ) {
    if (!answers || answers.length === 0) {
      throw new BadRequestException('Answers cannot be empty');
    }

    const quiz = await this.repo.findQuizWithQuestions(quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');

    // Validasi jumlah jawaban
    if (answers.length !== quiz.questions.length) {
      throw new BadRequestException('All questions must be answered');
    }

    // Map correct answers
    let score = 0;
    const evaluatedAnswers = answers.map((a) => {
      const question = quiz.questions.find((q) => q.id === a.questionId);
      if (!question) {
        throw new BadRequestException('Invalid question');
      }

      const choice = question.choices.find((c) => c.id === a.choiceId);
      if (!choice) {
        throw new BadRequestException('Invalid choice');
      }

      if (choice.isCorrect) score++;

      return {
        questionId: a.questionId,
        choiceId: a.choiceId,
        isCorrect: choice.isCorrect,
      };
    });

    return this.repo.submitQuizTransaction({
      userId,
      quizId,
      lessonId: quiz.lessonId,
      courseId: quiz.lesson.courseId,
      totalQuestions: quiz.questions.length,
      score,
      answers: evaluatedAnswers,
    });
  }
}

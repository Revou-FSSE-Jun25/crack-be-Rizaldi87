import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionsModule } from './questions/questions.module';
import { ChoicesModule } from './choices/choices.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { LessonprogressModule } from './lessonprogress/lessonprogress.module';
import { QuizresultsModule } from './quizresults/quizresults.module';
import { QuizanswersModule } from './quizanswers/quizanswers.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AssignmentsubmissionsModule } from './assignmentsubmissions/assignmentsubmissions.module';

@Module({
  imports: [
    PrismaModule,
    CoursesModule,
    AuthModule,
    UsersModule,
    LessonsModule,
    QuizModule,
    QuestionsModule,
    ChoicesModule,
    EnrollmentsModule,
    LessonprogressModule,
    QuizresultsModule,
    QuizanswersModule,
    AssignmentsModule,
    AssignmentsubmissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

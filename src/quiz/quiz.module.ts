import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuizRepository } from './quiz.repository';

@Module({
  imports: [PrismaModule],
  controllers: [QuizController],
  providers: [QuizService, QuizRepository],
})
export class QuizModule {}

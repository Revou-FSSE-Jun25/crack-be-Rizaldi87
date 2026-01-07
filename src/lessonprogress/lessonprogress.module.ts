import { Module } from '@nestjs/common';
import { LessonprogressService } from './lessonprogress.service';
import { LessonprogressController } from './lessonprogress.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LessonProgressRepository } from './lessonprogress.repository';

@Module({
  imports: [PrismaModule],
  controllers: [LessonprogressController],
  providers: [LessonprogressService, LessonProgressRepository],
})
export class LessonprogressModule {}

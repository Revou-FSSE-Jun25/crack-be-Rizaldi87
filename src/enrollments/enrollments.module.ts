import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EnrollmentsRepository } from './enrollments.repository';
import { UsersModule } from 'src/users/users.module';
import { CoursesModule } from 'src/courses/courses.module';
import { UsersRepository } from 'src/users/users.repository';
import { CoursesRepository } from 'src/courses/courses.repository';

@Module({
  imports: [PrismaModule, UsersModule, forwardRef(() => CoursesModule)],
  controllers: [EnrollmentsController],
  providers: [
    EnrollmentsService,
    EnrollmentsRepository,
    UsersRepository,
    CoursesRepository,
  ],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}

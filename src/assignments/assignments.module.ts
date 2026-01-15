import { BadRequestException, Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AssignmentsRepository } from './assignments.repository';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { AssignmentsubmissionsRepository } from 'src/assignmentsubmissions/assignmentsubmissions.repository';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/assignments',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}-${randomUUID()}${ext}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(
            new BadRequestException('Only pdf files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, //5MB max,
      },
    }),
    PrismaModule,
  ],
  controllers: [AssignmentsController],
  providers: [
    AssignmentsService,
    AssignmentsRepository,
    AssignmentsubmissionsRepository,
  ],
})
export class AssignmentsModule {}

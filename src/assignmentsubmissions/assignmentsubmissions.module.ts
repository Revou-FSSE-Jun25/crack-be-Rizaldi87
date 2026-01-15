import { Module } from '@nestjs/common';
import { AssignmentsubmissionsService } from './assignmentsubmissions.service';
import { AssignmentsubmissionsController } from './assignmentsubmissions.controller';
import { AssignmentsubmissionsRepository } from './assignmentsubmissions.repository';

@Module({
  controllers: [AssignmentsubmissionsController],
  providers: [AssignmentsubmissionsService, AssignmentsubmissionsRepository],
})
export class AssignmentsubmissionsModule {}

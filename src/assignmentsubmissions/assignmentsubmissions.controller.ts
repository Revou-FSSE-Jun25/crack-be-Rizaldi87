import { Controller, Get, UseGuards } from '@nestjs/common';
import { AssignmentsubmissionsService } from './assignmentsubmissions.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignmentsubmissions')
export class AssignmentsubmissionsController {
  constructor(
    private readonly assignmentsubmissionsService: AssignmentsubmissionsService,
  ) {}

  @Get()
  findAll() {
    return this.assignmentsubmissionsService.findAll();
  }
}

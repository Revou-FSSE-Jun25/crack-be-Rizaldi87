import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsubmissionsService } from './assignmentsubmissions.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateScoreDto } from './dto/update-score.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class AssignmentsubmissionsController {
  constructor(
    private readonly assignmentsubmissionsService: AssignmentsubmissionsService,
  ) {}

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.assignmentsubmissionsService.findAll();
  }

  @Roles('ADMIN')
  @Patch(':id/score')
  updateScore(
    @Param('id', ParseIntPipe) id: number,
    @Body('score') score: number,
  ) {
    return this.assignmentsubmissionsService.updateScore(id, score);
  }

  @Roles('STUDENT')
  @Get('student/')
  findByStudentId(@Req() req) {
    return this.assignmentsubmissionsService.findByStudentId(req.user.id);
  }

  @Roles('STUDENT')
  @Get('student/many')
  findManyByStudentId(@Req() req) {
    return this.assignmentsubmissionsService.findmanyByStudentId(req.user.id);
  }
}

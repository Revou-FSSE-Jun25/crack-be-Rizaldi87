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
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class AssignmentsubmissionsController {
  constructor(
    private readonly assignmentsubmissionsService: AssignmentsubmissionsService,
  ) {}

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all submissions' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Get()
  findAll() {
    return this.assignmentsubmissionsService.findAll();
  }

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update score' })
  @ApiCreatedResponse({ description: 'Score updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Patch(':id/score')
  updateScore(
    @Param('id', ParseIntPipe) id: number,
    @Body('score') score: number,
  ) {
    return this.assignmentsubmissionsService.updateScore(id, score);
  }

  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get submissions by student id' })
  @ApiOkResponse({ description: 'Submission found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Get('student/')
  findByStudentId(@Req() req) {
    return this.assignmentsubmissionsService.findByStudentId(req.user.id);
  }

  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get submissions by student id' })
  @ApiOkResponse({ description: 'Submissions found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Get('student/many')
  findManyByStudentId(@Req() req) {
    return this.assignmentsubmissionsService.findmanyByStudentId(req.user.id);
  }
}

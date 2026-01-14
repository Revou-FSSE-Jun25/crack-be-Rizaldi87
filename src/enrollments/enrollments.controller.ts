import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

// @ApiExcludeController()
@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Roles('ADMIN')
  @Post()
  @ApiOperation({
    summary: 'Create enrollment manually ',
    description: 'Create enrollment by specifying userId and courseId manually',
  })
  @ApiBody({ type: CreateEnrollmentDto })
  @ApiResponse({ status: 201, description: 'Enrollment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Roles('ADMIN')
  @Get()
  @ApiOperation({
    summary: 'Get all enrollments (admin only) ',
  })
  @ApiResponse({ status: 200, description: 'List of enrollments' })
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  @ApiOperation({
    summary: 'Get enrollment detail by ID ',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Enrollment detail' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({
    summary: 'Update enrollment by ID ',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateEnrollmentDto })
  @ApiResponse({ status: 200, description: 'Enrollment updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete enrollment by ID ',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Enrollment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }

  @Roles('STUDENT')
  @Get('course/:courseId')
  @ApiOperation({
    summary: 'Get enrollment by userId and courseId ',
  })
  // @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'courseId', type: Number })
  @ApiResponse({ status: 200, description: 'Enrollment detail' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  findByUserIdAndCourseId(
    @Req() req,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentsService.findByUserIdAndCourseId(
      req.user.userId,
      courseId,
    );
  }

  @Roles('STUDENT')
  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get all enrollments by userId ',
  })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'List of enrollments' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.enrollmentsService.findByUserId(userId);
  }

  @Roles('STUDENT')
  @Post('lessons/:lessonId/complete')
  @ApiOperation({ summary: 'Complete lesson and update enrollment progress' })
  @ApiParam({ name: 'lessonId', type: Number })
  completeLesson(
    @Req() req,
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ) {
    return this.enrollmentsService.completeLesson(req.user.userId, lessonId);
  }

  @Roles('STUDENT')
  @Get('course/:courseId/check')
  checkEnrollment(
    @Req() req,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.enrollmentsService.checkEnrollment(req.user.userId, courseId);
  }

  @Roles('STUDENT')
  @Post('course/:courseId/enroll')
  @ApiOperation({ summary: 'Enroll in a course' })
  @ApiParam({ name: 'courseId', type: Number })
  enroll(@Req() req, @Param('courseId', ParseIntPipe) courseId: number) {
    return this.enrollmentsService.enroll(req.user.userId, courseId);
  }
}

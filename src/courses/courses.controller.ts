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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ================= PUBLIC =================

  @Get('published')
  @ApiOperation({ summary: 'Get all published courses' })
  @ApiResponse({ status: 200, description: 'List of published courses' })
  findAllPublished() {
    return this.coursesService.findAllPublished();
  }

  // ================= ADMIN =================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new course (ADMIN only)' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses (admin view)' })
  @ApiResponse({ status: 200, description: 'List of all courses' })
  findAll() {
    return this.coursesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get('count')
  @ApiOperation({ summary: 'Get total number of courses' })
  @ApiResponse({ status: 200, description: 'Total number of courses' })
  countAllCourses() {
    return this.coursesService.countAllCourses();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get course detail by ID (ADMIN only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Course detail' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update course by ID (ADMIN only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ status: 200, description: 'Course updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete course by ID (ADMIN only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Course deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }

  // ================= USER =================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  @Post(':courseId/enroll')
  @ApiOperation({ summary: 'Enroll user to a course' })
  @ApiParam({ name: 'courseId', type: Number })
  @ApiResponse({ status: 201, description: 'Successfully enrolled' })
  @ApiResponse({ status: 404, description: 'Course or user not found' })
  enroll(@Param('courseId', ParseIntPipe) courseId: number, @Req() req) {
    return this.coursesService.enroll(req.user.id, courseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  @ApiBearerAuth()
  @Delete(':courseId/unenroll')
  @ApiOperation({ summary: 'Unenroll user from a course' })
  @ApiParam({ name: 'courseId', type: Number })
  @ApiResponse({ status: 200, description: 'Successfully unenrolled' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  unEnroll(@Param('courseId', ParseIntPipe) courseId: number, @Req() req) {
    return this.coursesService.unEnroll(req.user.id, courseId);
  }
}

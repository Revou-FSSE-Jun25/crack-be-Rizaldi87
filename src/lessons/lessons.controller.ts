import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new lesson (ADMIN only)' })
  @ApiCreatedResponse({ description: 'Lesson successfully created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiOkResponse({ description: 'List of lessons' })
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get('count')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get total number of lessons' })
  @ApiOkResponse({ description: 'Total number of lessons' })
  countAllLessons() {
    return this.lessonsService.countAllLessons();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by ID' })
  @ApiOkResponse({ description: 'Lesson detail' })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update lesson (ADMIN only)' })
  @ApiOkResponse({ description: 'Lesson successfully updated' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete lesson (ADMIN only)' })
  @ApiOkResponse({ description: 'Lesson successfully deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.remove(id);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get lessons by course ID' })
  @ApiOkResponse({ description: 'Lessons for specific course' })
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.lessonsService.findAllbyCourseId(courseId);
  }
}

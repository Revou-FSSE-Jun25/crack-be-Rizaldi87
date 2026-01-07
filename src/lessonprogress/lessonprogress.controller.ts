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
} from '@nestjs/common';
import { LessonprogressService } from './lessonprogress.service';
import { CreateLessonprogressDto } from './dto/create-lessonprogress.dto';
import { UpdateLessonprogressDto } from './dto/update-lessonprogress.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('progress')
export class LessonprogressController {
  constructor(private readonly lessonprogressService: LessonprogressService) {}

  @Post()
  @ApiOperation({ summary: 'Create lesson progress' })
  @ApiBody({ type: CreateLessonprogressDto })
  @ApiResponse({ status: 201, description: 'Lesson progress created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createLessonprogressDto: CreateLessonprogressDto) {
    return this.lessonprogressService.create(createLessonprogressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lesson progress data' })
  @ApiResponse({ status: 200, description: 'List of lesson progress' })
  findAll() {
    return this.lessonprogressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson progress by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lesson progress found' })
  @ApiResponse({ status: 404, description: 'Lesson progress not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonprogressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lesson progress' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateLessonprogressDto })
  @ApiResponse({ status: 200, description: 'Lesson progress updated' })
  @ApiResponse({ status: 404, description: 'Lesson progress not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonprogressDto: UpdateLessonprogressDto,
  ) {
    return this.lessonprogressService.update(id, updateLessonprogressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lesson progress' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Lesson progress deleted' })
  @ApiResponse({ status: 404, description: 'Lesson progress not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lessonprogressService.remove(id);
  }
}

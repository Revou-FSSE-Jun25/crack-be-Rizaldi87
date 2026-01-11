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
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateQuizWithQuestionDto } from './dto/create-quizwithquiestions';

@ApiTags('Quiz')
@ApiBearerAuth() // 🔐 JWT
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Roles('ADMIN')
  @Post()
  @ApiOperation({ summary: 'Create new quiz (ADMIN only)' })
  @ApiCreatedResponse({ description: 'Quiz successfully created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden (not ADMIN)' })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiOkResponse({ description: 'List of quizzes' })
  findAll() {
    return this.quizService.findAll();
  }

  @Get('count')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get total number of quizzes' })
  @ApiOkResponse({ description: 'Total number of quizzes' })
  countQuizzes() {
    return this.quizService.countQuizzes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiOkResponse({ description: 'Quiz detail' })
  @ApiNotFoundResponse({ description: 'Quiz not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ summary: 'Update quiz by ID (ADMIN only)' })
  @ApiOkResponse({ description: 'Quiz successfully updated' })
  @ApiForbiddenResponse({ description: 'Forbidden (not ADMIN)' })
  @ApiNotFoundResponse({ description: 'Quiz not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizService.update(id, updateQuizDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete quiz by ID (ADMIN only)' })
  @ApiOkResponse({ description: 'Quiz successfully deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden (not ADMIN)' })
  @ApiNotFoundResponse({ description: 'Quiz not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.remove(id);
  }

  @Roles('ADMIN')
  @Post('/with-questions')
  @ApiOperation({ summary: 'Create new quiz with questions (ADMIN only)' })
  @ApiCreatedResponse({ description: 'Quiz successfully created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden (not ADMIN)' })
  createWithQuestions(@Body() createQuizDto: CreateQuizWithQuestionDto) {
    return this.quizService.createWithQuestions(createQuizDto);
  }

  @Roles('ADMIN')
  @Patch('/with-questions/:id')
  @ApiOperation({ summary: 'Update quiz with questions by ID (ADMIN only)' })
  @ApiOkResponse({ description: 'Quiz successfully updated' })
  @ApiForbiddenResponse({ description: 'Forbidden (not ADMIN)' })
  @ApiNotFoundResponse({ description: 'Quiz not found' })
  updateQuizWithQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    return this.quizService.updateQuizWithQuestion(id, dto);
  }
}

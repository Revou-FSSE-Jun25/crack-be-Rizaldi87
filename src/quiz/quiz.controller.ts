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

@ApiTags('Quiz')
@ApiBearerAuth() // 🔐 JWT
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Roles('admin')
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

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiOkResponse({ description: 'Quiz detail' })
  @ApiNotFoundResponse({ description: 'Quiz not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.findOne(id);
  }

  @Roles('admin')
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

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete quiz by ID (ADMIN only)' })
  @ApiOkResponse({ description: 'Quiz successfully deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden (not ADMIN)' })
  @ApiNotFoundResponse({ description: 'Quiz not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizService.remove(id);
  }
}

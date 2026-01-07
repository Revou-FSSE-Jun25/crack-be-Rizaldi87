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
import { QuizresultsService } from './quizresults.service';
import { CreateQuizresultDto } from './dto/create-quizresult.dto';
import { UpdateQuizresultDto } from './dto/update-quizresult.dto';
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

@ApiTags('Quiz Results (Admin Only)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('results')
export class QuizresultsController {
  constructor(private readonly quizresultsService: QuizresultsService) {}

  @Post()
  @ApiOperation({ summary: 'Create quiz result' })
  @ApiBody({ type: CreateQuizresultDto })
  @ApiResponse({ status: 201, description: 'Quiz result created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createQuizresultDto: CreateQuizresultDto) {
    return this.quizresultsService.create(createQuizresultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quiz results' })
  @ApiResponse({ status: 200, description: 'List of quiz results' })
  findAll() {
    return this.quizresultsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz result by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Quiz result found' })
  @ApiResponse({ status: 404, description: 'Quiz result not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.quizresultsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update quiz result' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateQuizresultDto })
  @ApiResponse({ status: 200, description: 'Quiz result updated' })
  @ApiResponse({ status: 404, description: 'Quiz result not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizresultDto: UpdateQuizresultDto,
  ) {
    return this.quizresultsService.update(id, updateQuizresultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete quiz result' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Quiz result deleted' })
  @ApiResponse({ status: 404, description: 'Quiz result not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.quizresultsService.remove(id);
  }
}

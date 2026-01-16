import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import {
  ApiAcceptedResponse,
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { SubmitAssignmentDto } from './dto/submissions.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create assignment' })
  @ApiAcceptedResponse({ description: 'Assignment created' })
  @ApiCreatedResponse({ description: 'Assignment created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Post()
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiCreatedResponse({ description: 'Assignments found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get assignment by id' })
  @ApiAcceptedResponse({ description: 'Assignment found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(+id);
  }

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update assignment by id' })
  @ApiAcceptedResponse({ description: 'Assignment updated' })
  @ApiCreatedResponse({ description: 'Assignment updated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(+id, updateAssignmentDto);
  }

  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete assignment by id' })
  @ApiAcceptedResponse({ description: 'Assignment deleted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(+id);
  }

  @Roles('STUDENT')
  @ApiOperation({ summary: 'Submit assignment' })
  @ApiAcceptedResponse({ description: 'Assignment submitted' })
  @ApiCreatedResponse({ description: 'Assignment submitted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBadGatewayResponse({ description: 'Bad gateway' })
  @Post(':id/submit')
  @UseInterceptors(FileInterceptor('file'))
  submitAssignment(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitAssignmentDto,
  ) {
    console.log('FILE =>', file);
    console.log('BODY =>', dto);

    return this.assignmentsService.submitAssignment(req.user.userId, +id, {
      content: dto.content,
      fileUrl: file ? file.filename : null,
    });
  }
}

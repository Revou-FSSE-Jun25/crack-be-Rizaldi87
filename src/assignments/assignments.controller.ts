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
import { ApiTags } from '@nestjs/swagger';
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
  @Post()
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(+id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(+id, updateAssignmentDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(+id);
  }

  @Roles('STUDENT')
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

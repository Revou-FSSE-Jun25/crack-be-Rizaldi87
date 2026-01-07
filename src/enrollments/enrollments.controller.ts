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
  ApiExcludeController,
} from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create enrollment manually (ADMIN only)',
    description: 'Create enrollment by specifying userId and courseId manually',
  })
  @ApiBody({ type: CreateEnrollmentDto })
  @ApiResponse({ status: 201, description: 'Enrollment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all enrollments (ADMIN only)',
  })
  @ApiResponse({ status: 200, description: 'List of enrollments' })
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get enrollment detail by ID (ADMIN only)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Enrollment detail' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update enrollment by ID (ADMIN only)',
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

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete enrollment by ID (ADMIN only)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Enrollment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}

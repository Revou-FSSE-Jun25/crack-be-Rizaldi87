import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentsRepository } from './assignments.repository';
import { AssignmentsubmissionsRepository } from 'src/assignmentsubmissions/assignmentsubmissions.repository';

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly repo: AssignmentsRepository,
    private readonly submissionsRepo: AssignmentsubmissionsRepository,
  ) {}
  create(createAssignmentDto: CreateAssignmentDto) {
    return this.repo.create(createAssignmentDto);
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return this.repo.update(id, updateAssignmentDto);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }

  async submitAssignment(studentId: number, assignmentId: number, dto: any) {
    const assignment = await this.repo.findOneWithSubmissions(
      assignmentId,
      studentId,
    );

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // deadline check
    if (assignment.dueAt && new Date() > assignment.dueAt) {
      throw new BadRequestException('Assignment is due');
    }

    // attempt terakhir student
    const lastAttempt = assignment.submissions[0]?.attempt ?? 0;

    if (assignment.maxAttempts && lastAttempt + 1 > assignment.maxAttempts) {
      throw new BadRequestException('Max attempts reached');
    }

    return this.submissionsRepo.create({
      assignmentId, // ✅ KIRIM ID, BUKAN OBJECT
      studentId,
      attempt: lastAttempt + 1,
      content: dto.content,
      fileUrl: dto.fileUrl,
    });
  }
}

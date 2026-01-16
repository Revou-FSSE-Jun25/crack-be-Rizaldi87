import { Injectable } from '@nestjs/common';
import { AssignmentsubmissionsRepository } from './assignmentsubmissions.repository';
import { UpdateScoreDto } from './dto/update-score.dto';

@Injectable()
export class AssignmentsubmissionsService {
  constructor(private readonly repo: AssignmentsubmissionsRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  updateScore(id: number, score: number) {
    return this.repo.updateScore(id, score);
  }

  findByStudentId(studentId: number) {
    return this.repo.findByStudentId(studentId);
  }

  findmanyByStudentId(studentId: number) {
    return this.repo.findMaynyByStudentId(studentId);
  }
}

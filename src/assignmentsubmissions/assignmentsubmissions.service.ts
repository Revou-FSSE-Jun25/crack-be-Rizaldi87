import { Injectable } from '@nestjs/common';
import { AssignmentsubmissionsRepository } from './assignmentsubmissions.repository';

@Injectable()
export class AssignmentsubmissionsService {
  constructor(private readonly repo: AssignmentsubmissionsRepository) {}

  findAll() {
    return this.repo.findAll();
  }
}

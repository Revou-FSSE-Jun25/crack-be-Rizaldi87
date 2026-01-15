import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsubmissionsService } from './assignmentsubmissions.service';

describe('AssignmentsubmissionsService', () => {
  let service: AssignmentsubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignmentsubmissionsService],
    }).compile();

    service = module.get<AssignmentsubmissionsService>(AssignmentsubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

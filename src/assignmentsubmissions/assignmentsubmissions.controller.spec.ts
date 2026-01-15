import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsubmissionsController } from './assignmentsubmissions.controller';
import { AssignmentsubmissionsService } from './assignmentsubmissions.service';

describe('AssignmentsubmissionsController', () => {
  let controller: AssignmentsubmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsubmissionsController],
      providers: [AssignmentsubmissionsService],
    }).compile();

    controller = module.get<AssignmentsubmissionsController>(AssignmentsubmissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

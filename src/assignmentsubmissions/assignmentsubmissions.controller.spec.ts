import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsubmissionsController } from './assignmentsubmissions.controller';
import { AssignmentsubmissionsService } from './assignmentsubmissions.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { MockGuard } from 'src/auth/guards/mock.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BadRequestException } from '@nestjs/common';

describe('AssignmentsubmissionsController', () => {
  let controller: AssignmentsubmissionsController;
  let service: AssignmentsubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsubmissionsController],
      providers: [
        AssignmentsubmissionsService,
        {
          provide: AssignmentsubmissionsService,
          useValue: {
            findAll: jest.fn(),
            updateScore: jest.fn(),
            findByStudentId: jest.fn(),
            findmanyByStudentId: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockGuard)
      .overrideGuard(RolesGuard)
      .useClass(MockGuard)
      .compile();

    controller = module.get<AssignmentsubmissionsController>(
      AssignmentsubmissionsController,
    );
    service = module.get<AssignmentsubmissionsService>(
      AssignmentsubmissionsService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all assignment submissions', async () => {
    const mockSubmissions = [{ id: 1 }, { id: 2 }];
    jest.spyOn(service, 'findAll').mockResolvedValue(mockSubmissions);

    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockSubmissions);
  });

  it('should return empty array when no submissions found', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([]);

    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should update score of an assignment submission', async () => {
    const mockId = 1;
    const mockScore = 95;
    const mockUpdatedSubmission = { id: mockId, score: mockScore };
    jest.spyOn(service, 'updateScore').mockResolvedValue(mockUpdatedSubmission);

    const result = await controller.updateScore(mockId, mockScore);
    expect(service.updateScore).toHaveBeenCalledWith(mockId, mockScore);
    expect(result).toEqual(mockUpdatedSubmission);
  });

  it('should return error when updating score for non-existent submission', async () => {
    service.updateScore = jest
      .fn()
      .mockRejectedValue(new BadRequestException());

    const mockId = 999;
    const mockScore = 85;
    await expect(controller.updateScore(mockId, mockScore)).rejects.toThrow(
      BadRequestException,
    );
    expect(service.updateScore).toHaveBeenCalledWith(mockId, mockScore);
  });

  it('should return latest submission by student id', async () => {
    const submission = {
      id: 10,
      score: 85,
      attempt: 3,
      assignmentId: 7,
    };

    service.findByStudentId.mockResolvedValue(submission as any);

    const req = { user: { id: 123 } };

    const result = await controller.findByStudentId(req);

    expect(service.findByStudentId).toHaveBeenCalledWith(123);
    expect(result).toEqual(submission);
  });

  it('should return empty array when no submissions found for student ID', async () => {
    service.findByStudentId.mockResolvedValue([]);

    const req = { user: { id: 123 } };
    const result = await controller.findByStudentId(req);

    expect(service.findByStudentId).toHaveBeenCalledWith(123);
    expect(result).toEqual([]);
  });

  it('should find many submissions by student ID', async () => {
    const submissions = [{ id: 1 }, { id: 2 }];
    service.findmanyByStudentId.mockResolvedValue(submissions as any);

    const req = { user: { id: 123 } };
    const result = await controller.findManyByStudentId(req);

    expect(service.findmanyByStudentId).toHaveBeenCalledWith(123);
    expect(result).toEqual(submissions);
  });

  it('should return empty array when no many submissions found for student ID', async () => {
    service.findmanyByStudentId.mockResolvedValue([]);

    const req = { user: { id: 123 } };
    const result = await controller.findManyByStudentId(req);

    expect(service.findmanyByStudentId).toHaveBeenCalledWith(123);
    expect(result).toEqual([]);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsubmissionsService } from './assignmentsubmissions.service';
import { AssignmentsubmissionsRepository } from './assignmentsubmissions.repository';
import { BadRequestException } from '@nestjs/common';

describe('AssignmentsubmissionsService', () => {
  let service: AssignmentsubmissionsService;
  let repo: AssignmentsubmissionsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentsubmissionsService,
        {
          provide: AssignmentsubmissionsRepository,
          useValue: {
            findAll: jest.fn(),
            updateScore: jest.fn(),
            findByStudentId: jest.fn(),
            findMaynyByStudentId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AssignmentsubmissionsService>(
      AssignmentsubmissionsService,
    );
    repo = module.get<AssignmentsubmissionsRepository>(
      AssignmentsubmissionsRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all assignment submissions', async () => {
    const mockSubmissions = [{ id: 1 }, { id: 2 }];
    jest.spyOn(repo, 'findAll').mockResolvedValue(mockSubmissions);

    const result = await service.findAll();
    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockSubmissions);
  });

  it('should return empty array when no submissions found', async () => {
    jest.spyOn(repo, 'findAll').mockResolvedValue([]);

    const result = await service.findAll();
    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should update score of an assignment submission', async () => {
    const mockId = 1;
    const mockScore = 95;
    const mockUpdatedSubmission = { id: mockId, score: mockScore };
    jest.spyOn(repo, 'updateScore').mockResolvedValue(mockUpdatedSubmission);

    const result = await service.updateScore(mockId, mockScore);
    expect(repo.updateScore).toHaveBeenCalledWith(mockId, mockScore);
    expect(result).toEqual(mockUpdatedSubmission);
  });

  it('should return error when updating score for non-existent submission', async () => {
    repo.updateScore = jest.fn().mockRejectedValue(new BadRequestException());

    const mockId = 999;
    const mockScore = 85;
    await expect(service.updateScore(mockId, mockScore)).rejects.toThrow(
      BadRequestException,
    );
    expect(repo.updateScore).toHaveBeenCalledWith(mockId, mockScore);
  });

  it('should find submissions by student ID', async () => {
    const mockStudentId = 10;
    const mockSubmissions = [{ id: 1, studentId: mockStudentId }];
    jest.spyOn(repo, 'findByStudentId').mockResolvedValue(mockSubmissions);

    const result = await service.findByStudentId(mockStudentId);
    expect(repo.findByStudentId).toHaveBeenCalledWith(mockStudentId);
    expect(result).toEqual(mockSubmissions);
  });

  it('should return empty array when no submissions found for student ID', async () => {
    const mockStudentId = 10;
    jest.spyOn(repo, 'findByStudentId').mockResolvedValue([]);

    const result = await service.findByStudentId(mockStudentId);
    expect(repo.findByStudentId).toHaveBeenCalledWith(mockStudentId);
    expect(result).toEqual([]);
  });

  it('should find many submissions by student ID', async () => {
    const mockStudentId = 10;
    const mockSubmissions = [{ id: 1, studentId: mockStudentId }];
    jest.spyOn(repo, 'findMaynyByStudentId').mockResolvedValue(mockSubmissions);

    const result = await service.findmanyByStudentId(mockStudentId);
    expect(repo.findMaynyByStudentId).toHaveBeenCalledWith(mockStudentId);
    expect(result).toEqual(mockSubmissions);
  });

  it('should return empty array when no many submissions found for student ID', async () => {
    const mockStudentId = 10;
    jest.spyOn(repo, 'findMaynyByStudentId').mockResolvedValue([]);

    const result = await service.findmanyByStudentId(mockStudentId);
    expect(repo.findMaynyByStudentId).toHaveBeenCalledWith(mockStudentId);
    expect(result).toEqual([]);
  });
});

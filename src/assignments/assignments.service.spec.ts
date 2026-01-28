import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsService } from './assignments.service';
import { AssignmentsRepository } from './assignments.repository';
import { AssignmentsubmissionsRepository } from 'src/assignmentsubmissions/assignmentsubmissions.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AssignmentsService', () => {
  let service: AssignmentsService;
  let repo: jest.Mocked<AssignmentsRepository>;
  let submissionsRepo: jest.Mocked<AssignmentsubmissionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentsService,
        {
          provide: AssignmentsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            findOneWithSubmissions: jest.fn(),
          },
        },
        {
          provide: AssignmentsubmissionsRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AssignmentsService>(AssignmentsService);
    repo = module.get(AssignmentsRepository);
    submissionsRepo = module.get(AssignmentsubmissionsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create assignment', async () => {
    const dto = { title: 'Test' } as any;
    repo.create.mockResolvedValue(dto);

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should find all assignments', async () => {
    repo.findAll.mockResolvedValue([]);
    const result = await service.findAll();

    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should throw NotFoundException if assignment not found', async () => {
    repo.findOneWithSubmissions.mockResolvedValue(null);

    await expect(
      service.submitAssignment(1, 1, { content: 'test' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw error if assignment is due', async () => {
    repo.findOneWithSubmissions.mockResolvedValue({
      id: 1,
      dueAt: new Date(Date.now() - 1000),
      submissions: [],
    } as any);

    await expect(
      service.submitAssignment(1, 1, { content: 'test' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if max attempts reached', async () => {
    repo.findOneWithSubmissions.mockResolvedValue({
      id: 1,
      maxAttempts: 1,
      submissions: [{ attempt: 1 }],
    } as any);

    await expect(
      service.submitAssignment(1, 1, { content: 'test' }),
    ).rejects.toThrow('Max attempts reached');
  });

  it('should throw error if assignment already graded', async () => {
    repo.findOneWithSubmissions.mockResolvedValue({
      id: 1,
      submissions: [{ attempt: 1, score: 80 }],
    } as any);

    await expect(
      service.submitAssignment(1, 1, { content: 'test' }),
    ).rejects.toThrow('Assignment already graded');
  });

  it('should submit assignment successfully', async () => {
    repo.findOneWithSubmissions.mockResolvedValue({
      id: 1,
      maxAttempts: 3,
      submissions: [{ attempt: 1, score: 0 }],
    } as any);

    submissionsRepo.create.mockResolvedValue({ id: 99 } as any);

    const result = await service.submitAssignment(1, 1, {
      content: 'answer',
      fileUrl: 'file.pdf',
    });

    expect(submissionsRepo.create).toHaveBeenCalledWith({
      assignmentId: 1,
      studentId: 1,
      attempt: 2,
      content: 'answer',
      fileUrl: 'file.pdf',
    });

    expect(result).toEqual({ id: 99 });
  });

  it('should submit assignment on first attempt when no submissions exist', async () => {
    repo.findOneWithSubmissions.mockResolvedValue({
      id: 1,
      submissions: [],
    } as any);

    submissionsRepo.create.mockResolvedValue({ id: 1 } as any);

    const result = await service.submitAssignment(1, 1, {
      content: 'first answer',
    });

    expect(submissionsRepo.create).toHaveBeenCalledWith({
      assignmentId: 1,
      studentId: 1,
      attempt: 1,
      content: 'first answer',
      fileUrl: undefined,
    });

    expect(result).toEqual({ id: 1 });
  });

  it('should submit assignment when dueAt is not set', async () => {
    repo.findOneWithSubmissions.mockResolvedValue({
      id: 1,
      dueAt: undefined,
      submissions: [],
    } as any);

    submissionsRepo.create.mockResolvedValue({ id: 2 } as any);

    const result = await service.submitAssignment(1, 1, {
      content: 'answer',
    });

    expect(result).toEqual({ id: 2 });
  });

  it('should allow submission when maxAttempts is not defined', async () => {
    repo.findOneWithSubmissions.mockResolvedValue({
      id: 1,
      maxAttempts: undefined,
      submissions: [{ attempt: 1, score: 0 }],
    } as any);

    submissionsRepo.create.mockResolvedValue({ id: 3 } as any);

    const result = await service.submitAssignment(1, 1, {
      content: 'answer',
    });

    expect(result).toEqual({ id: 3 });
  });

  it('should remove assignment', async () => {
    repo.remove.mockResolvedValue({ id: 1 } as any);
    const result = await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('should update assignment', async () => {
    const dto = { title: 'Updated' } as any;
    repo.update.mockResolvedValue({ id: 1, ...dto } as any);

    const result = await service.update(1, dto);

    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(result.id).toBe(1);
  });

  it('should find one assignment', async () => {
    const assignment = { id: 1, title: 'Test' } as any;
    repo.findOne.mockResolvedValue(assignment);
    const result = await service.findOne(1);

    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(assignment);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesService } from './choices.service';
import { ChoicesRepository } from './choices.repository';
import { BadRequestException } from '@nestjs/common';

describe('ChoicesService', () => {
  let service: ChoicesService;
  let repo: jest.Mocked<ChoicesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChoicesService,
        {
          provide: ChoicesRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAllByQuestionId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChoicesService>(ChoicesService);
    repo = module.get<ChoicesRepository>(ChoicesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a choice', async () => {
    const dto = { text: 'Choice 1', questionId: 1 };
    const result = { id: 1, ...dto };
    repo.create.mockResolvedValue(result);

    const created = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(created).toEqual(result);
  });

  it('should throw bad request error when creating choice with invalid data', async () => {
    const dto = { text: '', questionId: 1 }; // Invalid data
    repo.create.mockRejectedValue(new BadRequestException());
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });

  it('should find all choices', async () => {
    const result = [{ id: 1, text: 'Choice 1', questionId: 1 }];
    repo.findAll.mockResolvedValue(result);

    const found = await service.findAll();
    expect(repo.findAll).toHaveBeenCalled();
    expect(found).toEqual(result);
  });

  it('should return empty array when no choices found', async () => {
    repo.findAll.mockResolvedValue([]);

    const found = await service.findAll();
    expect(repo.findAll).toHaveBeenCalled();
    expect(found).toEqual([]);
  });

  it('should find one choice by id', async () => {
    const result = { id: 1, text: 'Choice 1', questionId: 1 };
    repo.findOne.mockResolvedValue(result);

    const found = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(found).toEqual(result);
  });

  it('should return null when choice not found by id', async () => {
    repo.findOne.mockResolvedValue(null);

    const found = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(found).toBeNull();
  });

  it('should update a choice', async () => {
    const dto = { text: 'Updated Choice' };
    const result = { id: 1, text: 'Updated Choice', questionId: 1 };
    repo.update.mockResolvedValue(result);

    const updated = await service.update(1, dto);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(updated).toEqual(result);
  });

  it('should throw bad request error when updating choice with invalid data', async () => {
    const dto = { text: '' }; // Invalid data
    repo.update.mockRejectedValue(new BadRequestException());
    await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
  });

  it('should remove a choice', async () => {
    const result = { id: 1, text: 'Choice 1', questionId: 1 };
    repo.remove.mockResolvedValue(result);

    const removed = await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(1);
    expect(removed).toEqual(result);
  });

  it('should find all choices by question id', async () => {
    const result = [{ id: 1, text: 'Choice 1', questionId: 1 }];
    repo.findAllByQuestionId.mockResolvedValue(result);

    const found = await service.findAllByQuestionId(1);
    expect(repo.findAllByQuestionId).toHaveBeenCalledWith(1);
    expect(found).toEqual(result);
  });

  it('should return empty array when no choices found by question id', async () => {
    repo.findAllByQuestionId.mockResolvedValue([]);

    const found = await service.findAllByQuestionId(1);
    expect(repo.findAllByQuestionId).toHaveBeenCalledWith(1);
    expect(found).toEqual([]);
  });
});

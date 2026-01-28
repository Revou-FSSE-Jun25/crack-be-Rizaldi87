import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesController } from './choices.controller';
import { ChoicesService } from './choices.service';

describe('ChoicesController', () => {
  let controller: ChoicesController;

  const mockChoicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAllByQuestionId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChoicesController],
      providers: [
        ChoicesService,
        { provide: ChoicesService, useValue: mockChoicesService },
      ],
    }).compile();

    controller = module.get<ChoicesController>(ChoicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a choice', async () => {
    const dto = { text: 'Choice 1', questionId: 1 };
    const result = { id: 1, ...dto };
    mockChoicesService.create.mockResolvedValue(result);

    const created = await controller.create(dto);
    expect(mockChoicesService.create).toHaveBeenCalledWith(dto);
    expect(created).toEqual(result);
  });

  it('should find all choices', async () => {
    const result = [{ id: 1, text: 'Choice 1', questionId: 1 }];
    mockChoicesService.findAll.mockResolvedValue(result);

    const found = await controller.findAll();
    expect(mockChoicesService.findAll).toHaveBeenCalled();
    expect(found).toEqual(result);
  });

  it('should find one choice by id', async () => {
    const result = { id: 1, text: 'Choice 1', questionId: 1 };
    mockChoicesService.findOne.mockResolvedValue(result);

    const found = await controller.findOne('1');
    expect(mockChoicesService.findOne).toHaveBeenCalledWith(1);
    expect(found).toEqual(result);
  });

  it('should update a choice', async () => {
    const dto = { text: 'Updated Choice' };
    const result = { id: 1, text: 'Updated Choice', questionId: 1 };
    mockChoicesService.update.mockResolvedValue(result);

    const updated = await controller.update('1', dto);
    expect(mockChoicesService.update).toHaveBeenCalledWith(1, dto);
    expect(updated).toEqual(result);
  });

  it('should remove a choice', async () => {
    const result = { id: 1, text: 'Choice 1', questionId: 1 };
    mockChoicesService.remove.mockResolvedValue(result);

    const removed = await controller.remove('1');
    expect(mockChoicesService.remove).toHaveBeenCalledWith(1);
    expect(removed).toEqual(result);
  });

  it('should find all choices by question id', async () => {
    const result = [
      { id: 1, text: 'Choice 1', questionId: 1 },
      { id: 2, text: 'Choice 2', questionId: 1 },
    ];
    mockChoicesService.findAllByQuestionId.mockResolvedValue(result);

    const found = await controller.findAllByQuestionId(1);
    expect(mockChoicesService.findAllByQuestionId).toHaveBeenCalledWith(1);
    expect(found).toEqual(result);
  });
});

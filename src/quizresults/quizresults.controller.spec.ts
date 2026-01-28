import { Test, TestingModule } from '@nestjs/testing';
import { QuizresultsController } from './quizresults.controller';
import { QuizresultsService } from './quizresults.service';

describe('QuizresultsController', () => {
  let controller: QuizresultsController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizresultsController],
      providers: [
        QuizresultsService,
        { provide: QuizresultsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<QuizresultsController>(QuizresultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a quiz result', async () => {
    const dto = { userId: 1, quizId: 1, score: 90 };
    mockService.create.mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should find all quiz results', async () => {
    mockService.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(mockService.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should find one quiz result', async () => {
    const quizResult = { id: 1, userId: 1, quizId: 1, score: 90 };
    mockService.findOne.mockResolvedValue(quizResult);

    const result = await controller.findOne(1);

    expect(mockService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(quizResult);
  });

  it('should update a quiz result', async () => {
    const dto = { score: 95 };
    const updatedResult = { id: 1, userId: 1, quizId: 1, score: 95 };
    mockService.update.mockResolvedValue(updatedResult);

    const result = await controller.update(1, dto);

    expect(mockService.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(updatedResult);
  });

  it('should remove a quiz result', async () => {
    const removedResult = { id: 1, userId: 1, quizId: 1, score: 90 };
    mockService.remove.mockResolvedValue(removedResult);

    const result = await controller.remove(1);
    expect(mockService.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(removedResult);
  });
});

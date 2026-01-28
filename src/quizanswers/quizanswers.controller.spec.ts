import { Test, TestingModule } from '@nestjs/testing';
import { QuizanswersController } from './quizanswers.controller';
import { QuizanswersService } from './quizanswers.service';

describe('QuizanswersController', () => {
  let controller: QuizanswersController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizanswersController],
      providers: [
        QuizanswersService,
        { provide: QuizanswersService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<QuizanswersController>(QuizanswersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a quiz answer', async () => {
    const dto = {
      /* fill with appropriate properties */
    };
    mockService.create.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should find all quiz answers', async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    mockService.findAll.mockResolvedValue(mockData);
    const result = await controller.findAll();
    expect(result).toEqual(mockData);
    expect(mockService.findAll).toHaveBeenCalled();
  });
  it('should find one quiz answer by id', async () => {
    const mockData = { id: 1 };
    mockService.findOne.mockResolvedValue(mockData);
    const result = await controller.findOne(1);
    expect(result).toEqual(mockData);
    expect(mockService.findOne).toHaveBeenCalledWith(1);
  });
  it('should update a quiz answer', async () => {
    const dto = {
      /* fill with appropriate properties */
    };
    mockService.update.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.update(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mockService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a quiz answer', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    const result = await controller.remove(1);
    expect(result).toEqual({ deleted: true });
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});

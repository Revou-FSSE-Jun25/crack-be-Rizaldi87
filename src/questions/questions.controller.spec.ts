import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  const mockQuestionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAllByQuizId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        QuestionsService,
        {
          provide: QuestionsService,
          useValue: mockQuestionsService,
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a question', async () => {
    const dto = { title: 'Sample Question' };
    mockQuestionsService.create.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.create(dto);
    expect(mockQuestionsService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should find all questions', async () => {
    const result = [{ id: 1, title: 'Sample Question' }];
    mockQuestionsService.findAll.mockResolvedValue(result);
    const found = await controller.findAll();
    expect(mockQuestionsService.findAll).toHaveBeenCalled();
    expect(found).toEqual(result);
  });
  it('should find one question by id', async () => {
    const result = { id: 1, title: 'Sample Question' };
    mockQuestionsService.findOne.mockResolvedValue(result);
    const found = await controller.findOne('1');
    expect(mockQuestionsService.findOne).toHaveBeenCalledWith(1);
    expect(found).toEqual(result);
  });
  it('should update a question', async () => {
    const dto = { title: 'Updated Question' };
    mockQuestionsService.update.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.update('1', dto);
    expect(mockQuestionsService.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should remove a question', async () => {
    mockQuestionsService.remove.mockResolvedValue({ deleted: true });
    const result = await controller.remove('1');
    expect(mockQuestionsService.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });
  it('should find all questions by quiz id', async () => {
    const result = [{ id: 1, title: 'Sample Question', quizId: 1 }];
    mockQuestionsService.findAllByQuizId.mockResolvedValue(result);
    const found = await controller.findAllByQuizId(1);
    expect(mockQuestionsService.findAllByQuizId).toHaveBeenCalledWith(1);
    expect(found).toEqual(result);
  });
});

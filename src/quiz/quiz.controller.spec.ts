import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

describe('QuizController', () => {
  let controller: QuizController;
  let service: jest.Mocked<QuizService>;

  const mockQuizService = {
    create: jest.fn(),
    findAll: jest.fn(),
    countQuizzes: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createWithQuestions: jest.fn(),
    updateQuizWithQuestion: jest.fn(),
    findAllByCourseId: jest.fn(),
    submitQuiz: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: QuizService,
          useValue: mockQuizService,
        },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
    service = module.get(QuizService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ================= ADMIN =================

  it('should create quiz', async () => {
    const dto = { title: 'Quiz 1', lessonId: 1 };
    service.create.mockResolvedValue(dto as any);

    const result = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should get all quizzes', async () => {
    service.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should count quizzes', async () => {
    service.countQuizzes.mockResolvedValue(5);

    const result = await controller.countQuizzes();

    expect(service.countQuizzes).toHaveBeenCalled();
    expect(result).toBe(5);
  });

  it('should get quiz by id', async () => {
    service.findOne.mockResolvedValue({ id: 1 } as any);

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result.id).toBe(1);
  });

  it('should update quiz', async () => {
    const dto = { title: 'Updated Quiz' };
    service.update.mockResolvedValue({ id: 1, ...dto } as any);

    const result = await controller.update(1, dto as any);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result.title).toBe('Updated Quiz');
  });

  it('should remove quiz', async () => {
    service.remove.mockResolvedValue({ id: 1 } as any);

    const result = await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result.id).toBe(1);
  });

  it('should create quiz with questions', async () => {
    const dto = { title: 'Quiz', questions: [] };
    service.createWithQuestions.mockResolvedValue(dto as any);

    const result = await controller.createWithQuestions(dto as any);

    expect(service.createWithQuestions).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should update quiz with questions', async () => {
    const dto = { title: 'Updated Quiz' };
    service.updateQuizWithQuestion.mockResolvedValue(dto as any);

    const result = await controller.updateQuizWithQuestion(1, dto);

    expect(service.updateQuizWithQuestion).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(dto);
  });

  it('should get quizzes by courseId', async () => {
    service.findAllByCourseId.mockResolvedValue([]);

    const result = await controller.findAllByCourseId(1);

    expect(service.findAllByCourseId).toHaveBeenCalledWith(1);
    expect(result).toEqual([]);
  });

  // ================= STUDENT =================

  it('should submit quiz', async () => {
    const req = {
      user: { userId: 99 },
    };

    const dto = {
      answers: [{ questionId: 1, choiceId: 1 }],
    };

    service.submitQuiz.mockResolvedValue({ score: 1 } as any);

    const result = await controller.submitQuiz(1, dto as any, req);

    expect(service.submitQuiz).toHaveBeenCalledWith(99, 1, dto.answers);

    expect(result.score).toBe(1);
  });
});

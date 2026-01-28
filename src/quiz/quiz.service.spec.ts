import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { QuizRepository } from './quiz.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('QuizService', () => {
  let service: QuizService;
  let repo: jest.Mocked<QuizRepository>;

  const mockQuizRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    countQuizzes: jest.fn(),
    createWithQuestions: jest.fn(),
    updateQuizWithQuestion: jest.fn(),
    findQuizzesByCourseId: jest.fn(),
    findQuizWithQuestions: jest.fn(),
    submitQuizTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: QuizRepository,
          useValue: mockQuizRepository,
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
    repo = module.get(QuizRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ================= BASIC CRUD =================

  it('should create quiz', async () => {
    const dto = { title: 'Quiz 1', lessonId: 1 };
    repo.create.mockResolvedValue(dto as any);

    const result = await service.create(dto as any);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should find all quizzes', async () => {
    repo.findAll.mockResolvedValue([]);

    const result = await service.findAll();

    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should find quiz by id', async () => {
    repo.findOne.mockResolvedValue({ id: 1 } as any);

    const result = await service.findOne(1);

    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(result.id).toBe(1);
  });

  it('should update quiz', async () => {
    const dto = { title: 'Updated Quiz' };
    repo.update.mockResolvedValue({ id: 1, ...dto } as any);

    const result = await service.update(1, dto as any);

    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(result.title).toBe('Updated Quiz');
  });

  it('should remove quiz', async () => {
    repo.remove.mockResolvedValue({ id: 1 } as any);

    const result = await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(1);
    expect(result.id).toBe(1);
  });

  it('should count quizzes', async () => {
    repo.countQuizzes.mockResolvedValue(10);

    const result = await service.countQuizzes();

    expect(result).toBe(10);
  });

  // ================= CUSTOM METHODS =================

  it('should create quiz with questions', async () => {
    const dto = { title: 'Quiz', questions: [] };
    repo.createWithQuestions.mockResolvedValue(dto as any);

    const result = await service.createWithQuestions(dto as any);

    expect(repo.createWithQuestions).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should update quiz with questions', async () => {
    const dto = { title: 'Updated Quiz' };
    repo.updateQuizWithQuestion.mockResolvedValue(dto as any);

    const result = await service.updateQuizWithQuestion(1, dto);

    expect(repo.updateQuizWithQuestion).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(dto);
  });

  it('should find quizzes by courseId', async () => {
    repo.findQuizzesByCourseId.mockResolvedValue([]);

    const result = await service.findAllByCourseId(1);

    expect(repo.findQuizzesByCourseId).toHaveBeenCalledWith(1);
    expect(result).toEqual([]);
  });

  // ================= SUBMIT QUIZ =================

  it('should throw error if answers empty', async () => {
    await expect(service.submitQuiz(1, 1, [])).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw error if quiz not found', async () => {
    repo.findQuizWithQuestions.mockResolvedValue(null);

    await expect(
      service.submitQuiz(1, 1, [{ questionId: 1, choiceId: 1 }]),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw error if not all questions answered', async () => {
    repo.findQuizWithQuestions.mockResolvedValue({
      id: 1,
      lessonId: 1,
      lesson: { courseId: 1 },
      questions: [
        { id: 1, choices: [] },
        { id: 2, choices: [] },
      ],
    } as any);

    await expect(
      service.submitQuiz(1, 1, [{ questionId: 1, choiceId: 1 }]),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if invalid question', async () => {
    repo.findQuizWithQuestions.mockResolvedValue({
      id: 1,
      lessonId: 1,
      lesson: { courseId: 1 },
      questions: [{ id: 99, choices: [] }],
    } as any);

    await expect(
      service.submitQuiz(1, 1, [{ questionId: 1, choiceId: 1 }]),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if invalid choice', async () => {
    repo.findQuizWithQuestions.mockResolvedValue({
      id: 1,
      lessonId: 1,
      lesson: { courseId: 1 },
      questions: [
        {
          id: 1,
          choices: [{ id: 2, isCorrect: false }],
        },
      ],
    } as any);

    await expect(
      service.submitQuiz(1, 1, [{ questionId: 1, choiceId: 1 }]),
    ).rejects.toThrow(BadRequestException);
  });

  it('should submit quiz successfully and calculate score', async () => {
    repo.findQuizWithQuestions.mockResolvedValue({
      id: 1,
      lessonId: 10,
      lesson: { courseId: 99 },
      questions: [
        {
          id: 1,
          choices: [
            { id: 1, isCorrect: true },
            { id: 2, isCorrect: false },
          ],
        },
      ],
    } as any);

    repo.submitQuizTransaction.mockResolvedValue({
      score: 1,
    } as any);

    const result = await service.submitQuiz(1, 1, [
      { questionId: 1, choiceId: 1 },
    ]);

    expect(repo.submitQuizTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 1,
        quizId: 1,
        score: 1,
        totalQuestions: 1,
      }),
    );

    expect(result.score).toBe(1);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { QuizresultsService } from './quizresults.service';
import { QuizresultsRepository } from './quizresults.repository';

describe('QuizresultsService', () => {
  let service: QuizresultsService;
  let repo: jest.Mocked<QuizresultsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizresultsService,
        {
          provide: QuizresultsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(QuizresultsService);
    repo = module.get(QuizresultsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a quiz result', async () => {
    const dto = { userId: 1, quizId: 1, score: 90 };

    repo.create.mockResolvedValue(dto as any);

    const result = await service.create(dto);

    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should find all quiz results', async () => {
    repo.findAll.mockResolvedValue([]);

    const result = await service.findAll();

    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should find one quiz result', async () => {
    repo.findOne.mockResolvedValue({ id: 1 } as any);

    const result = await service.findOne(1);

    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(result.id).toBe(1);
  });

  it('should update a quiz result', async () => {
    const dto = { score: 95 };

    repo.update.mockResolvedValue({ id: 1, ...dto } as any);

    const result = await service.update(1, dto);

    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(result.score).toBe(95);
  });

  it('should remove a quiz result', async () => {
    repo.remove.mockResolvedValue({ id: 1 } as any);

    const result = await service.remove(1);

    expect(repo.remove).toHaveBeenCalledWith(1);
    expect(result.id).toBe(1);
  });
});

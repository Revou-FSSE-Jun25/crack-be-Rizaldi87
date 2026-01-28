import { Test, TestingModule } from '@nestjs/testing';
import { QuizanswersService } from './quizanswers.service';
import { QuizanswersRepository } from './quizanswers.repository';

describe('QuizanswersService', () => {
  let service: QuizanswersService;
  let repo: jest.Mocked<QuizanswersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizanswersService,
        {
          provide: QuizanswersRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuizanswersService>(QuizanswersService);
    repo = module.get(QuizanswersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a quiz answer', async () => {
    const dto = {
      /* fill with appropriate properties */
    };
    repo.create.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(repo.create).toHaveBeenCalledWith(dto);
  });

  it('should find all quiz answers', async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    repo.findAll.mockResolvedValue(mockData);
    const result = await service.findAll();
    expect(result).toEqual(mockData);
    expect(repo.findAll).toHaveBeenCalled();
  });

  it('should find one quiz answer by id', async () => {
    const mockData = { id: 1 };
    repo.findOne.mockResolvedValue(mockData);
    const result = await service.findOne(1);
    expect(result).toEqual(mockData);
    expect(repo.findOne).toHaveBeenCalledWith(1);
  });
  it('should update a quiz answer', async () => {
    const dto = {
      /* fill with appropriate properties */
    };
    repo.update.mockResolvedValue({ id: 1, ...dto });
    const result = await service.update(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(repo.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a quiz answer', async () => {
    repo.remove.mockResolvedValue({ affected: 1 });
    const result = await service.remove(1);
    expect(result).toEqual({ affected: 1 });
    expect(repo.remove).toHaveBeenCalledWith(1);
  });
});

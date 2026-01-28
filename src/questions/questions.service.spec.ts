import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { QuestionsRepository } from './questions.repository';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let repo: jest.Mocked<QuestionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: QuestionsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAllByQuizId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    repo = module.get(QuestionsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a question', async () => {
    const dto = { title: 'Sample Question' };
    repo.create.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should find all questions', async () => {
    const result = [{ id: 1, title: 'Sample Question' }];
    repo.findAll.mockResolvedValue(result);
    const found = await service.findAll();
    expect(repo.findAll).toHaveBeenCalled();
    expect(found).toEqual(result);
  });

  it('should find one question by id', async () => {
    const result = { id: 1, title: 'Sample Question' };
    repo.findOne.mockResolvedValue(result);
    const found = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(found).toEqual(result);
  });

  it('should update a question', async () => {
    const dto = { title: 'Updated Question' };
    repo.update.mockResolvedValue({ id: 1, ...dto });
    const result = await service.update(1, dto);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should remove a question', async () => {
    repo.remove.mockResolvedValue(undefined);
    const result = await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });
  it('should find all questions by quiz id', async () => {
    const result = [{ id: 1, title: 'Sample Question', quizId: 1 }];
    repo.findAllByQuizId.mockResolvedValue(result);
    const found = await service.findAllByQuizId(1);
    expect(repo.findAllByQuizId).toHaveBeenCalledWith(1);
    expect(found).toEqual(result);
  });
});

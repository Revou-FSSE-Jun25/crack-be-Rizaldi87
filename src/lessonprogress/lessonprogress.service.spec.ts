import { Test, TestingModule } from '@nestjs/testing';
import { LessonprogressService } from './lessonprogress.service';
import { LessonProgressRepository } from './lessonprogress.repository';

describe('LessonprogressService', () => {
  let service: LessonprogressService;
  let repo: jest.Mocked<LessonProgressRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonprogressService,
        {
          provide: LessonProgressRepository,
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

    service = module.get<LessonprogressService>(LessonprogressService);
    repo = module.get(LessonProgressRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a lesson progress', async () => {
    const dto = { lessonId: 1, userId: 1, progress: 50 };
    repo.create.mockResolvedValue({ id: 1, ...dto });
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should find all lesson progresses', async () => {
    const mockData = [{ id: 1, lessonId: 1, userId: 1, progress: 50 }];
    repo.findAll.mockResolvedValue(mockData);
    const result = await service.findAll();
    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should find one lesson progress by id', async () => {
    const mockData = { id: 1, lessonId: 1, userId: 1, progress: 50 };
    repo.findOne.mockResolvedValue(mockData);
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockData);
  });

  it('should update a lesson progress', async () => {
    const dto = { progress: 75 };
    const mockData = { id: 1, lessonId: 1, userId: 1, progress: 75 };
    repo.update.mockResolvedValue(mockData);
    const result = await service.update(1, dto);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(mockData);
  });

  it('should remove a lesson progress', async () => {
    repo.remove.mockResolvedValue(undefined);
    const result = await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });
});

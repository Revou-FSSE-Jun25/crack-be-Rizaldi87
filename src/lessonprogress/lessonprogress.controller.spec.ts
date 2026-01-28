import { Test, TestingModule } from '@nestjs/testing';
import { LessonprogressController } from './lessonprogress.controller';
import { LessonprogressService } from './lessonprogress.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('LessonprogressController', () => {
  let controller: LessonprogressController;
  let service: jest.Mocked<LessonprogressService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonprogressController],
      providers: [
        LessonprogressService,
        {
          provide: LessonprogressService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<LessonprogressController>(LessonprogressController);
    service = module.get(LessonprogressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a lesson progress', async () => {
    const dto = { lessonId: 1, userId: 1, progress: 50 };
    service.create.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should find all lesson progresses', async () => {
    const mockData = [{ id: 1, lessonId: 1, userId: 1, progress: 50 }];
    service.findAll.mockResolvedValue(mockData);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('should find one lesson progress by id', async () => {
    const mockData = { id: 1, lessonId: 1, userId: 1, progress: 50 };
    service.findOne.mockResolvedValue(mockData);
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockData);
  });

  it('should update a lesson progress', async () => {
    const dto = { progress: 75 };
    const mockData = { id: 1, lessonId: 1, userId: 1, progress: 75 };
    service.update.mockResolvedValue(mockData);
    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(mockData);
  });

  it('should remove a lesson progress', async () => {
    service.remove.mockResolvedValue(undefined);
    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toBeUndefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

describe('LessonsController', () => {
  let controller: LessonsController;
  const mockLessonsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAllbyCourseId: jest.fn(),
    countAllLessons: jest.fn(),
    reorderLessons: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsController],
      providers: [
        LessonsService,
        {
          provide: LessonsService,
          useValue: mockLessonsService,
        },
      ],
    }).compile();

    controller = module.get<LessonsController>(LessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method of service', async () => {
    const dto = { title: 'Lesson 1', courseId: 1, order: 1 };
    await controller.create(dto);
    expect(mockLessonsService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAllbyCourseId method of service', async () => {
    const courseId = 1;
    await controller.findByCourse(courseId);
    expect(mockLessonsService.findAllbyCourseId).toHaveBeenCalledWith(courseId);
  });

  it('should call reorderLessons method of service', async () => {
    const courseId = 1;
    const body = {
      orders: [
        { id: 1, order: 2 },
        { id: 2, order: 1 },
      ],
    };
    await controller.reorderLessons(courseId, body);
    expect(mockLessonsService.reorderLessons).toHaveBeenCalledWith(
      courseId,
      body.orders,
    );
  });
  it('should call remove method of service', async () => {
    const lessonId = 1;
    await controller.remove(lessonId);
    expect(mockLessonsService.remove).toHaveBeenCalledWith(lessonId);
  });

  it('should call findAll method of service', async () => {
    await controller.findAll();
    expect(mockLessonsService.findAll).toHaveBeenCalled();
  });

  it('should call findOne method of service', async () => {
    const lessonId = 1;
    await controller.findOne(lessonId);
    expect(mockLessonsService.findOne).toHaveBeenCalledWith(lessonId);
  });

  it('should call update method of service', async () => {
    const lessonId = 1;
    const dto = { title: 'Lesson 1' };
    await controller.update(lessonId, dto);
    expect(mockLessonsService.update).toHaveBeenCalledWith(lessonId, dto);
  });

  it('should call countAllLessons method of service', async () => {
    await controller.countAllLessons();
    expect(mockLessonsService.countAllLessons).toHaveBeenCalled();
  });
});

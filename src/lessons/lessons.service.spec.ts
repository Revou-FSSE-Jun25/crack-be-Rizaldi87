import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { LessonsRepository } from './lessons.repository';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('LessonsService', () => {
  let service: LessonsService;
  const mockLessonsRepository = {
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
      providers: [
        LessonsService,
        {
          provide: LessonsRepository,
          useValue: mockLessonsRepository,
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call create method of repository', async () => {
    const dto = { title: 'Lesson 1', courseId: 1, order: 1 };
    await service.create(dto);
    expect(mockLessonsRepository.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAllbyCourseId method of repository', async () => {
    const courseId = 1;
    await service.findAllbyCourseId(courseId);
    expect(mockLessonsRepository.findAllbyCourseId).toHaveBeenCalledWith(
      courseId,
    );
  });

  it('should call reorderLessons method of repository', async () => {
    const courseId = 1;
    const orders = [2, 1, 3];
    await service.reorderLessons(courseId, orders);
    expect(mockLessonsRepository.reorderLessons).toHaveBeenCalledWith(
      courseId,
      orders,
    );
  });

  it('should call remove method of repository', async () => {
    const lessonId = 1;
    await service.remove(lessonId);
    expect(mockLessonsRepository.remove).toHaveBeenCalledWith(lessonId);
  });

  it('should call findAll method of repository', async () => {
    await service.findAll();
    expect(mockLessonsRepository.findAll).toHaveBeenCalled();
  });

  it('should call findOne method of repository', async () => {
    const lessonId = 1;
    await service.findOne(lessonId);
    expect(mockLessonsRepository.findOne).toHaveBeenCalledWith(lessonId);
  });

  it('should call update method of repository', async () => {
    const lessonId = 1;
    const dto = { title: 'Lesson 1' };
    await service.update(lessonId, dto);
    expect(mockLessonsRepository.update).toHaveBeenCalledWith(lessonId, dto);
  });

  it('should call countAllLessons method of repository', async () => {
    await service.countAllLessons();
    expect(mockLessonsRepository.countAllLessons).toHaveBeenCalled();
  });

  it('should throw ConflictException when Prisma P2002 error occurs', async () => {
    const dto = { title: 'Lesson 1', courseId: 1, order: 1 };

    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '5.0.0',
      },
    );

    mockLessonsRepository.create.mockRejectedValue(prismaError);

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);

    expect(mockLessonsRepository.create).toHaveBeenCalledWith(dto);
  });
});

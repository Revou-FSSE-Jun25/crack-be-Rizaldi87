import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { MockGuard } from 'src/auth/guards/mock.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCoursesService = {
    findAllPublished: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    countAllCourses: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    enroll: jest.fn(),
    unEnroll: jest.fn(),
    updateImage: jest.fn(),
    findOnePublishedWithLessons: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(MockGuard)
      .overrideGuard(RolesGuard)
      .useValue(MockGuard)
      .compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return published courses', async () => {
    const data = [{ id: 1, title: 'Course A' }];
    service.findAllPublished.mockResolvedValue(data);

    const result = await controller.findAllPublished();

    expect(result).toEqual(data);
    expect(service.findAllPublished).toHaveBeenCalled();
  });

  it('should create course with image', async () => {
    const file = { filename: 'img.png' } as Express.Multer.File;
    const dto = { title: 'NestJS', description: 'Course' } as any;

    service.create.mockResolvedValue({ id: 1 });

    const result = await controller.create(file, dto);

    expect(service.create).toHaveBeenCalledWith({
      ...dto,
      image: 'img.png',
    });
  });

  it('should get all courses', async () => {
    const data = [
      { id: 1, title: 'Course A' },
      { id: 2, title: 'Course B' },
    ];
    service.findAll.mockResolvedValue(data);

    const result = await controller.findAll();

    expect(result).toEqual(data);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should count all courses', async () => {
    service.countAllCourses.mockResolvedValue(5);

    const result = await controller.countAllCourses();

    expect(result).toBe(5);
    expect(service.countAllCourses).toHaveBeenCalled();
  });

  it('should find one course by id', async () => {
    const data = { id: 1, title: 'Course A' };
    service.findOne.mockResolvedValue(data);

    const result = await controller.findOne(1);

    expect(result).toEqual(data);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update course', async () => {
    const dto = { title: 'NestJS', description: 'Course' } as any;

    service.update.mockResolvedValue({ id: 1 });

    const result = await controller.update(1, dto);

    expect(result).toEqual({ id: 1 });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove course', async () => {
    service.remove.mockResolvedValue({ id: 1 });

    const result = await controller.remove(1);

    expect(result).toEqual({ id: 1 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should enroll user to course', async () => {
    service.enroll.mockResolvedValue({ success: true });

    const req = { user: { id: 1 } };

    const result = await controller.enroll(10, req);

    expect(service.enroll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual({ success: true });
  });

  it('should upload course image', async () => {
    const file = { filename: 'new.png' } as Express.Multer.File;

    service.updateImage.mockResolvedValue({ id: 1, image: 'new.png' });

    const result = await controller.uploadCourseImage(1, file);

    expect(service.updateImage).toHaveBeenCalledWith(1, 'new.png');
  });

  it('should unenroll user from course', async () => {
    service.unEnroll.mockResolvedValue({ success: true });

    const req = { user: { id: 1 } };

    const result = await controller.unEnroll(10, req);

    expect(service.unEnroll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual({ success: true });
  });
  it('should return published course with lessons', async () => {
    const data = { id: 1, title: 'Course A', lessons: [] };
    service.findOnePublishedWithLessons.mockResolvedValue(data);

    const result = await controller.findOnePublishedWithLessons(1);

    expect(service.findOnePublishedWithLessons).toHaveBeenCalledWith(1);
    expect(result).toEqual(data);
  });
  it('should create course without image', async () => {
    const dto = { title: 'NestJS', description: 'Course' } as any;
    service.create.mockResolvedValue({ id: 1 });

    const result = await controller.create(undefined, dto);

    expect(service.create).toHaveBeenCalledWith({
      ...dto,
      image: undefined,
    });
  });
});

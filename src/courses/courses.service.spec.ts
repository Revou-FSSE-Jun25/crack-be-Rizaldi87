import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { CoursesRepository } from './courses.repository';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';
import { NotFoundException } from '@nestjs/common';
import { unlink } from 'fs';

jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');

  return {
    ...actualFs,
    unlink: jest.fn(),
  };
});

describe('CoursesService', () => {
  let service: CoursesService;

  const mockCoursesRepo = {
    create: jest.fn(),
    findAllPublished: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    countAllCourses: jest.fn(),
    findOnePublishedWithLessons: jest.fn(),
  };

  const mockEnrollmentsService = {
    enroll: jest.fn(),
    unEnroll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: CoursesRepository,
          useValue: mockCoursesRepo,
        },
        {
          provide: EnrollmentsService,
          useValue: mockEnrollmentsService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create course', async () => {
    const dto = { title: 'NestJS', description: 'Backend' };
    mockCoursesRepo.create.mockResolvedValue(dto);

    const result = await service.create(dto as any);

    expect(mockCoursesRepo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should find all published courses', async () => {
    const courses = [{ id: 1, title: 'Course 1', status: 'PUBLISHED' }];
    mockCoursesRepo.findAllPublished.mockResolvedValue(courses);

    const result = await service.findAllPublished();

    expect(mockCoursesRepo.findAllPublished).toHaveBeenCalled();
    expect(result).toEqual(courses);
  });

  it('should find all courses', async () => {
    const courses = [
      { id: 1, title: 'Course 1' },
      { id: 2, title: 'Course 2' },
    ];
    mockCoursesRepo.findAll.mockResolvedValue(courses);

    const result = await service.findAll();

    expect(mockCoursesRepo.findAll).toHaveBeenCalled();
    expect(result).toEqual(courses);
  });

  it('should find one course by id', async () => {
    const course = { id: 1, title: 'Course 1' };
    mockCoursesRepo.findOne.mockResolvedValue(course);

    const result = await service.findOne(1);

    expect(mockCoursesRepo.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(course);
  });

  it('should update course', async () => {
    const dto = { title: 'Updated Course' };
    const updatedCourse = { id: 1, ...dto };
    mockCoursesRepo.update.mockResolvedValue(updatedCourse);

    const result = await service.update(1, dto);

    expect(mockCoursesRepo.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(updatedCourse);
  });

  it('should remove course', async () => {
    const deletedCourse = { id: 1, title: 'Course 1' };
    mockCoursesRepo.remove.mockResolvedValue(deletedCourse);

    const result = await service.remove(1);

    expect(mockCoursesRepo.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(deletedCourse);
  });

  it('should count all courses', async () => {
    mockCoursesRepo.countAllCourses.mockResolvedValue(10);

    const result = await service.countAllCourses();

    expect(mockCoursesRepo.countAllCourses).toHaveBeenCalled();
    expect(result).toBe(10);
  });

  it('should find one published course with lessons', async () => {
    const course = { id: 1, title: 'Course 1' };
    mockCoursesRepo.findOnePublishedWithLessons.mockResolvedValue(course);

    const result = await service.findOnePublishedWithLessons(1);

    expect(mockCoursesRepo.findOnePublishedWithLessons).toHaveBeenCalledWith(1);
    expect(result).toEqual(course);
  });

  it('should enroll user to course', async () => {
    mockEnrollmentsService.enroll.mockResolvedValue({ success: true });

    const result = await service.enroll(1, 10);

    expect(mockEnrollmentsService.enroll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual({ success: true });
  });

  it('should throw NotFoundException if course not found', async () => {
    mockCoursesRepo.findOne.mockResolvedValue(null);

    await expect(service.updateImage(1, 'img.png')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update image and delete old image', async () => {
    mockCoursesRepo.findOne.mockResolvedValue({
      id: 1,
      image: 'old.png',
    });

    mockCoursesRepo.update.mockResolvedValue({
      id: 1,
      image: 'new.png',
    });

    const result = await service.updateImage(1, 'new.png');

    expect(unlink).toHaveBeenCalledWith(
      'uploads/images/old.png',
      expect.any(Function),
    );

    expect(mockCoursesRepo.update).toHaveBeenCalledWith(1, {
      image: 'new.png',
    });

    expect(result.image).toBe('new.png');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsRepository } from './enrollments.repository';
import { UsersRepository } from 'src/users/users.repository';
import { CoursesRepository } from 'src/courses/courses.repository';
import { LessonsRepository } from 'src/lessons/lessons.repository';
import { LessonProgressRepository } from 'src/lessonprogress/lessonprogress.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  const mockEnrollmentsRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByUserId: jest.fn(),
    findByUserIdAndCourseId: jest.fn(),
    updateEnrollProgress: jest.fn(),
  };

  const mockUsersRepo = {
    findById: jest.fn(),
  };

  const mockCoursesRepo = {
    findOne: jest.fn(),
  };

  const mockLessonsRepo = {
    findOne: jest.fn(),
    countLessonsByCourseId: jest.fn(),
  };

  const mockLessonProgressRepo = {
    upsertLessonProgress: jest.fn(),
    countCompletedByUserAndCourse: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: EnrollmentsRepository, useValue: mockEnrollmentsRepo },
        { provide: UsersRepository, useValue: mockUsersRepo },
        { provide: CoursesRepository, useValue: mockCoursesRepo },
        { provide: LessonsRepository, useValue: mockLessonsRepo },
        { provide: LessonProgressRepository, useValue: mockLessonProgressRepo },
      ],
    }).compile();

    service = module.get(EnrollmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create enrollment', async () => {
    const dto = {
      userId: 1,
      courseId: 10,
    };

    const createdEnrollment = {
      id: 100,
      userId: 1,
      courseId: 10,
    };

    mockEnrollmentsRepo.create.mockResolvedValue(createdEnrollment);

    const result = await service.create(dto);

    expect(mockEnrollmentsRepo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(createdEnrollment);
  });

  it('should find all enrollments', async () => {
    const enrollments = [{ id: 1, userId: 1, courseId: 10 }];
    mockEnrollmentsRepo.findAll.mockResolvedValue(enrollments);

    const result = await service.findAll();

    expect(mockEnrollmentsRepo.findAll).toHaveBeenCalled();
    expect(result).toEqual(enrollments);
  });

  it('should find enrollment by id', async () => {
    const enrollment = { id: 1, userId: 1, courseId: 10 };
    mockEnrollmentsRepo.findOne.mockResolvedValue(enrollment);

    const result = await service.findOne(1);

    expect(mockEnrollmentsRepo.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(enrollment);
  });

  it('should update enrollment', async () => {
    const dto = { courseId: 20 };
    const updatedEnrollment = { id: 1, userId: 1, courseId: 20 };
    mockEnrollmentsRepo.update.mockResolvedValue(updatedEnrollment);

    const result = await service.update(1, dto);

    expect(mockEnrollmentsRepo.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(updatedEnrollment);
  });

  it('should remove enrollment', async () => {
    const deletedEnrollment = { id: 1, userId: 1, courseId: 10 };
    mockEnrollmentsRepo.remove.mockResolvedValue(deletedEnrollment);

    const result = await service.remove(1);

    expect(mockEnrollmentsRepo.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(deletedEnrollment);
  });
  it('should find enrollment by userId', async () => {
    mockEnrollmentsRepo.findByUserId.mockResolvedValue([]);

    const result = await service.findByUserId(1);

    expect(result).toEqual([]);
  });

  it('should check enrollment (true)', async () => {
    mockEnrollmentsRepo.findByUserIdAndCourseId.mockResolvedValue({ id: 1 });

    const result = await service.checkEnrollment(1, 10);

    expect(result).toBe(true);
  });

  it('should check enrollment (false)', async () => {
    mockEnrollmentsRepo.findByUserIdAndCourseId.mockResolvedValue(null);

    const result = await service.checkEnrollment(1, 10);

    expect(result).toBe(false);
  });

  // ================= ENROLL =================

  it('should enroll user to published course', async () => {
    mockUsersRepo.findById.mockResolvedValue({ id: 1 });
    mockCoursesRepo.findOne.mockResolvedValue({ id: 10, status: 'PUBLISHED' });
    mockEnrollmentsRepo.findByUserIdAndCourseId.mockResolvedValue(null);
    mockEnrollmentsRepo.create.mockResolvedValue({ id: 100 });

    const result = await service.enroll(1, 10);

    expect(result).toEqual({ id: 100 });
  });

  it('should throw if user not found', async () => {
    mockUsersRepo.findById.mockResolvedValue(null);

    await expect(service.enroll(1, 10)).rejects.toThrow(NotFoundException);
  });

  it('should throw if course not found', async () => {
    mockUsersRepo.findById.mockResolvedValue({ id: 1 });
    mockCoursesRepo.findOne.mockResolvedValue(null);

    await expect(service.enroll(1, 10)).rejects.toThrow(NotFoundException);
  });

  it('should throw if course not published', async () => {
    mockUsersRepo.findById.mockResolvedValue({ id: 1 });
    mockCoursesRepo.findOne.mockResolvedValue({ status: 'DRAFT' });

    await expect(service.enroll(1, 10)).rejects.toThrow(BadRequestException);
  });

  it('should throw if already enrolled', async () => {
    mockUsersRepo.findById.mockResolvedValue({ id: 1 });
    mockCoursesRepo.findOne.mockResolvedValue({ status: 'PUBLISHED' });
    mockEnrollmentsRepo.findByUserIdAndCourseId.mockResolvedValue({ id: 5 });

    await expect(service.enroll(1, 10)).rejects.toThrow(NotFoundException);
  });

  // ================= UNENROLL =================

  it('should unenroll user', async () => {
    mockEnrollmentsRepo.findByUserIdAndCourseId.mockResolvedValue({ id: 1 });
    mockEnrollmentsRepo.remove.mockResolvedValue(true);

    const result = await service.unEnroll(1, 10);

    expect(result).toBe(true);
  });

  it('should throw if enrollment not found', async () => {
    mockEnrollmentsRepo.findByUserIdAndCourseId.mockResolvedValue(null);

    await expect(service.unEnroll(1, 10)).rejects.toThrow(NotFoundException);
  });

  // ================= COMPLETE LESSON =================

  it('should complete lesson and update progress', async () => {
    mockLessonsRepo.findOne.mockResolvedValue({ id: 1, courseId: 10 });
    mockEnrollmentsRepo.findByUserIdAndCourseId.mockResolvedValue({ id: 50 });
    mockLessonsRepo.countLessonsByCourseId.mockResolvedValue(4);
    mockLessonProgressRepo.countCompletedByUserAndCourse.mockResolvedValue(2);
    mockEnrollmentsRepo.updateEnrollProgress.mockResolvedValue({
      progress: 50,
    });

    const result = await service.completeLesson(1, 1);

    expect(result.progress).toBe(50);
  });

  it('should throw if lesson not found', async () => {
    mockLessonsRepo.findOne.mockResolvedValue(null);

    await expect(service.completeLesson(1, 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if user not enrolled in course', async () => {
    mockLessonsRepo.findOne.mockResolvedValue({ id: 1, courseId: 10 });
    mockEnrollmentsRepo.findByUserIdAndCourseId.mockResolvedValue(null);

    await expect(service.completeLesson(1, 1)).rejects.toThrow(
      ForbiddenException,
    );
  });
});

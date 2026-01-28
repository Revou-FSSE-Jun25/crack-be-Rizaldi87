import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('EnrollmentsController', () => {
  let controller: EnrollmentsController;
  let service: EnrollmentsService;

  const mockEnrollmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByUserId: jest.fn(),
    findByUserIdAndCourseId: jest.fn(),
    completeLesson: jest.fn(),
    checkEnrollment: jest.fn(),
    enroll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentsController],
      providers: [
        {
          provide: EnrollmentsService,
          useValue: mockEnrollmentsService,
        },
      ],
    })
      // 🔥 bypass auth & role guard
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EnrollmentsController);
    service = module.get(EnrollmentsService);

    jest.clearAllMocks();
  });

  // ================= ADMIN =================

  it('should create enrollment (ADMIN)', async () => {
    const dto = { userId: 1, courseId: 10 };
    mockEnrollmentsService.create.mockResolvedValue(dto);

    const result = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should find all enrollments (ADMIN)', async () => {
    mockEnrollmentsService.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should find enrollment by id (ADMIN)', async () => {
    mockEnrollmentsService.findOne.mockResolvedValue({ id: 1 });

    const result = await controller.findOne(1);

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('should update enrollment (ADMIN)', async () => {
    mockEnrollmentsService.update.mockResolvedValue({ id: 1 });

    const result = await controller.update(1, { progress: 50 } as any);

    expect(service.update).toHaveBeenCalledWith(1, { progress: 50 });
    expect(result).toEqual({ id: 1 });
  });

  it('should remove enrollment (ADMIN)', async () => {
    mockEnrollmentsService.remove.mockResolvedValue(true);

    const result = await controller.remove(1);

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toBe(true);
  });

  // ================= STUDENT =================

  it('should get enrollment by userId & courseId (STUDENT)', async () => {
    const req = { user: { userId: 99 } };
    mockEnrollmentsService.findByUserIdAndCourseId.mockResolvedValue({
      id: 1,
    });

    const result = await controller.findByUserIdAndCourseId(req as any, 10);

    expect(service.findByUserIdAndCourseId).toHaveBeenCalledWith(99, 10);
    expect(result).toEqual({ id: 1 });
  });

  it('should get enrollments by userId (STUDENT)', async () => {
    mockEnrollmentsService.findByUserId.mockResolvedValue([]);

    const result = await controller.findByUserId(5);

    expect(service.findByUserId).toHaveBeenCalledWith(5);
    expect(result).toEqual([]);
  });

  it('should complete lesson (STUDENT)', async () => {
    const req = { user: { userId: 7 } };
    mockEnrollmentsService.completeLesson.mockResolvedValue({
      progress: 50,
    });

    const result = await controller.completeLesson(req as any, 3);

    expect(service.completeLesson).toHaveBeenCalledWith(7, 3);
    expect(result.progress).toBe(50);
  });

  it('should check enrollment (STUDENT)', async () => {
    const req = { user: { userId: 7 } };
    mockEnrollmentsService.checkEnrollment.mockResolvedValue(true);

    const result = await controller.checkEnrollment(req as any, 10);

    expect(service.checkEnrollment).toHaveBeenCalledWith(7, 10);
    expect(result).toBe(true);
  });

  it('should enroll course (STUDENT)', async () => {
    const req = { user: { userId: 7 } };
    mockEnrollmentsService.enroll.mockResolvedValue({ id: 123 });

    const result = await controller.enroll(req as any, 10);

    expect(service.enroll).toHaveBeenCalledWith(7, 10);
    expect(result).toEqual({ id: 123 });
  });
});

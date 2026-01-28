import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { MockGuard } from 'src/auth/guards/mock.guard';
import { BadRequestException } from '@nestjs/common';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;
  let service: AssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [
        {
          provide: AssignmentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            submitAssignment: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockGuard)
      .overrideGuard(RolesGuard)
      .useClass(MockGuard)
      .compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
    service = module.get<AssignmentsService>(AssignmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create assignment', async () => {
    const dto = { title: 'Test' } as any;
    service.create.mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should return all assignments', async () => {
    service.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return assignment by id', async () => {
    service.findOne.mockResolvedValue({ id: 1 } as any);

    const result = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('should update assignment', async () => {
    const dto = { title: 'Updated' } as any;
    service.update.mockResolvedValue({ id: 1, ...dto } as any);

    const result = await controller.update('1', dto);

    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result.id).toBe(1);
  });

  it('should remove assignment', async () => {
    service.remove.mockResolvedValue({ success: true } as any);

    const result = await controller.remove('1');

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ success: true });
  });

  it('should submit assignment', async () => {
    service.submitAssignment.mockResolvedValue({ id: 99 } as any);

    const file = { filename: 'file.pdf' } as Express.Multer.File;
    const req = { user: { userId: 1 } };

    const result = await controller.submitAssignment(file, req, 1, {
      content: 'answer',
    } as any);

    expect(service.submitAssignment).toHaveBeenCalledWith(1, 1, {
      content: 'answer',
      fileUrl: 'file.pdf',
    });

    expect(result).toEqual({ id: 99 });
  });

  it('should submit assignment without file', async () => {
    service.submitAssignment.mockResolvedValue({ id: 100 } as any);

    const req = { user: { userId: 1 } };

    const result = await controller.submitAssignment(undefined as any, req, 1, {
      content: 'answer',
    } as any);

    expect(service.submitAssignment).toHaveBeenCalledWith(1, 1, {
      content: 'answer',
      fileUrl: null, // 👈 PENTING: null, bukan undefined
    });

    expect(result).toEqual({ id: 100 });
  });

  it('should propagate error from service', async () => {
    service.submitAssignment.mockRejectedValue(
      new BadRequestException('Assignment is due'),
    );

    const req = { user: { userId: 1 } };

    await expect(
      controller.submitAssignment(undefined as any, req, 1, {
        content: 'answer',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });
});

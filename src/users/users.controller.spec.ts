import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = {
      name: 'John Doe',
      email: 'd0c9g@example.com',
      password: 'password123',
    };
    mockService.create.mockResolvedValue(dto);
    const result = await controller.create(dto);
    expect(result).toEqual(dto);
  });

  it('should find all users', async () => {
    const result = [
      {
        id: 1,
        name: 'John Doe',
        email: 'd0c9g@example.com',
        password: 'password123',
      },
    ];
    mockService.findAll.mockResolvedValue(result);
    const users = await controller.findAll();
    expect(users).toEqual(result);
  });

  it('should find one user by id', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'd0c9g@example.com',
      password: 'password123',
    };
    mockService.findOne.mockResolvedValue(user);
    const result = await controller.findOne(1);
    expect(result).toEqual(user);
  });
  it('should update a user by id', async () => {
    const updateDto = {
      name: 'Jane Doe',
    };
    const updatedUser = {
      id: 1,
      name: 'Jane Doe',
      email: 'd0c9g@example.com',
      password: 'password123',
    };
    mockService.update.mockResolvedValue(updatedUser);
    const result = await controller.update(1, updateDto);
    expect(result).toEqual(updatedUser);
  });
  it('should remove a user by id', async () => {
    mockService.remove.mockResolvedValue(undefined);
    const result = await controller.remove(1);
    expect(result).toBeUndefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<UsersRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = {
      name: 'John Doe',
      email: 'd0c9g@example.com',
      password: 'password123',
    };
    repo.create.mockResolvedValue(dto);
    const result = await service.create(dto);
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
    repo.findAll.mockResolvedValue(result);
    const users = await service.findAll();
    expect(users).toEqual(result);
  });

  it('should find one user by id', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'd0c9g@example.com',
      password: 'password123',
    };
    repo.findById.mockResolvedValue(user);
    const result = await service.findOne(1);
    expect(result).toEqual(user);
  });

  it('should update a user', async () => {
    const dto = { name: 'Jane Doe' };
    const updatedUser = {
      id: 1,
      name: 'Jane Doe',
      email: 'd0c9g@example.com',
      password: 'password123',
    };
    repo.update.mockResolvedValue(updatedUser);
    const result = await service.update(1, dto);
    expect(result).toEqual(updatedUser);
  });

  it('should remove a user', async () => {
    repo.delete.mockResolvedValue(undefined);
    const result = await service.remove(1);
    expect(result).toBeUndefined();
  });

  it('should count users by role', async () => {
    const role = 'USER';
    repo.countByRole = jest.fn().mockResolvedValue(5);
    const count = await service.countByRole(role as any);
    expect(count).toBe(5);
  });
});

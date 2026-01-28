import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersRepo: jest.Mocked<UsersRepository>;
  let prisma: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            refreshToken: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersRepo = module.get(UsersRepository);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('should register user', async () => {
    const dto = { email: 'a@test.com' } as any;
    usersRepo.create.mockResolvedValue(dto);

    const result = await service.register(dto);

    expect(usersRepo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should throw if user not found', async () => {
    usersRepo.findByEmail.mockResolvedValue(null);

    await expect(service.login('test@mail.com', '123')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw error if password invalid', async () => {
    usersRepo.findByEmail.mockResolvedValue({ password: 'hashed' } as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('test@mail.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should login successfully', async () => {
    const user = {
      id: 1,
      name: 'Rizaldi',
      email: 'test@mail.com',
      role: 'STUDENT',
      password: 'hashed',
    };

    usersRepo.findByEmail.mockResolvedValue(user as any);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-refresh');
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await service.login(user.email, 'password');

    expect(jwtService.sign).toHaveBeenCalledTimes(2);
    expect(prisma.refreshToken.create).toHaveBeenCalled();
    expect(result).toEqual({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    });
  });

  it('should revoke refresh token', async () => {
    prisma.refreshToken.findMany.mockResolvedValue([
      { id: 1, token: 'hashed' },
    ] as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.revokeRefreshToken('token');

    expect(prisma.refreshToken.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { revoked: true },
    });

    expect(result.message).toBe('Logout successful');
  });

  it('should throw if refresh token invalid', async () => {
    prisma.refreshToken.findMany.mockResolvedValue([]);
    await expect(service.revokeRefreshToken('invalid')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should refresh access token', async () => {
    prisma.refreshToken.findFirst.mockResolvedValue({
      userId: 1,
      token: 'hashed',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    usersRepo.findById.mockResolvedValue({
      id: 1,
      name: 'User',
      email: 'u@mail.com',
      role: 'STUDENT',
    } as any);

    jwtService.sign.mockReturnValue('new-access');

    const result = await service.refresh('refresh-token');

    expect(result.access_token).toBe('new-access');
  });

  it('should throw if refresh token invalid', async () => {
    prisma.refreshToken.findFirst.mockResolvedValue(null);

    await expect(service.refresh('invalid')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw if refresh token does not match any stored token', async () => {
    prisma.refreshToken.findMany.mockResolvedValue([
      { id: 1, token: 'hashed-1' },
      { id: 2, token: 'hashed-2' },
    ] as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.revokeRefreshToken('invalid-token')).rejects.toThrow(
      UnauthorizedException,
    );

    expect(prisma.refreshToken.update).not.toHaveBeenCalled();
  });

  it('should throw if refresh token does not match hash', async () => {
    prisma.refreshToken.findFirst.mockResolvedValue({
      userId: 1,
      token: 'hashed',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.refresh('invalid-token')).rejects.toThrow(
      UnauthorizedException,
    );
  });
  it('should throw if user not found during refresh', async () => {
    prisma.refreshToken.findFirst.mockResolvedValue({
      userId: 99,
      token: 'hashed',
    } as any);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    usersRepo.findById.mockResolvedValue(null);

    await expect(service.refresh('refresh-token')).rejects.toThrow(
      NotFoundException,
    );
  });
});

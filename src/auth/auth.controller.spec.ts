import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    revokeRefreshToken: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should call authService.register', async () => {
    mockAuthService.register.mockResolvedValue({ id: 1 });

    const result = await controller.register({} as any);

    expect(result).toEqual({ id: 1 });
  });

  it('should throw bad request if register fails', async () => {
    mockAuthService.register.mockRejectedValue(new BadRequestException());
    await expect(controller.register({} as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should login user', async () => {
    mockAuthService.login.mockResolvedValue({
      access_token: 'a',
      refresh_token: 'b',
    });

    const result = await controller.login(
      { email: 'a', password: 'b' } as any,
      {} as any,
    );

    expect(result.access_token).toBeDefined();
  });

  it('should throw bad request if login fails', async () => {
    mockAuthService.login.mockRejectedValue(new BadRequestException());
    await expect(
      controller.login({ email: 'a', password: 'b' } as any, {} as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should logout user', async () => {
    mockAuthService.revokeRefreshToken.mockResolvedValue({
      message: 'Logout successful',
    });

    const result = await controller.logout('refresh-token');

    expect(result.message).toBe('Logout successful');
  });

  it('should throw bad request if logout fails', async () => {
    mockAuthService.revokeRefreshToken.mockRejectedValue(
      new BadRequestException(),
    );
    await expect(controller.logout('refresh-token')).rejects.toThrow(
      BadRequestException,
    );
  });
});

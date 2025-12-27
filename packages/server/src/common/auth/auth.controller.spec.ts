import { faker } from '@faker-js/faker';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Request, Response } from 'express';
import { Mocked } from 'vitest';
import { createMockUser } from '../../resources/users/entities/__mocks__/user.entity.mock';
import { createMockConfigService } from '../config/__mocks__/config.service.mock';
import { EnvSchemaType } from '../config/env';
import { mockAuthService } from './__mocks__/auth.service.mock';
import {
  createMockAccessToken,
  createMockExpressUser,
} from './__mocks__/auth.type.mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { createMockRegisterInput } from './dto/__mocks__/register.input.mock';
import * as refreshJwtStrategy from './strategies/refresh-jwt/refresh-jwt.strategy';

describe('AuthController', async () => {
  const mockEnv: Partial<EnvSchemaType> = {
    BASE_PATH: faker.string.alphanumeric({ length: 10 }),
  };

  const mockConfigService = createMockConfigService(mockEnv);
  const spyRefreshJwtFromRequest = vi.spyOn(
    refreshJwtStrategy,
    'refreshJwtFromRequest',
  );

  let controller: AuthController;
  let authService: Mocked<AuthService>;
  let configService: Mocked<ConfigService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    authService = module.get(AuthService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register', async () => {
    const user = await createMockUser();
    const input = await createMockRegisterInput();
    authService.register.mockResolvedValueOnce(user);

    const res = await controller.register(input);
    expect(authService.register).toHaveBeenCalledWith(input);
    expect(res).toBe(user);
  });

  it('should register guest', async () => {
    await expect(controller.guest()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should login', async () => {
    const expressUser = createMockExpressUser();
    const req = {
      user: expressUser,
    } as unknown as Request;
    const mockCookie = vi.fn();
    const res = {
      cookie: mockCookie,
    } as unknown as Response;
    const ipAddress = faker.internet.ip();
    const userAgent = faker.internet.userAgent();
    const accessToken = createMockAccessToken();
    authService.login.mockResolvedValue(accessToken);

    const response = await controller.login(req, res, ipAddress, userAgent);
    expect(authService.login).toHaveBeenCalledWith(req.user, {
      ipAddress,
      userAgent,
    });
    expect(res.cookie).toHaveBeenCalledWith(
      'access_token',
      accessToken.access_token,
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: `/${mockEnv.BASE_PATH}`,
        maxAge: expect.any(Number),
      }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'refresh_token',
      accessToken.refresh_token,
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: `/${mockEnv.BASE_PATH}`,
        maxAge: expect.any(Number),
      }),
    );
    expect(response).toBe(accessToken);
  });

  it('should refresh', async () => {
    const expressUser = createMockExpressUser();
    const req = {
      user: expressUser,
    } as unknown as Request;
    const mockCookie = vi.fn();
    const res = {
      cookie: mockCookie,
    } as unknown as Response;
    const ipAddress = faker.internet.ip();
    const userAgent = faker.internet.userAgent();
    const accessToken = createMockAccessToken();
    spyRefreshJwtFromRequest.mockReturnValueOnce(accessToken.refresh_token!);
    authService.refresh.mockResolvedValue(accessToken);

    const response = await controller.refresh(req, res, ipAddress, userAgent);
    expect(authService.refresh).toHaveBeenCalledWith(
      req.user,
      accessToken.refresh_token!,
      {
        ipAddress,
        userAgent,
      },
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'access_token',
      accessToken.access_token,
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: `/${mockEnv.BASE_PATH}`,
        maxAge: expect.any(Number),
      }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'refresh_token',
      accessToken.refresh_token,
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: `/${mockEnv.BASE_PATH}`,
        maxAge: expect.any(Number),
      }),
    );
    expect(response).toBe(accessToken);
  });

  it('should return user info', async () => {
    const user = await createMockUser();
    const expressUser = createMockExpressUser();
    const req = {
      user: expressUser,
    } as unknown as Request;
    authService.userinfo.mockResolvedValue(user);
    const res = await controller.userinfo(req);
    expect(res).toBe(user);
  });
});

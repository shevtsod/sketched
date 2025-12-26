import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { Mock, Mocked } from 'vitest';
import { createMockConfigService } from '../../../config/__mocks__/config.service.mock';
import { EnvSchemaType } from '../../../config/env';
import { mockAuthService } from '../../__mocks__/auth.service.mock';
import { createMockExpressUser } from '../../__mocks__/auth.type.mock';
import { AuthService } from '../../auth.service';
import {
  refreshJwtFromRequest,
  RefreshJwtStrategy,
} from './refresh-jwt.strategy';

vi.mock('passport-jwt');

vi.mock('../jwt/jwt.util', () => ({
  jwtFromRequest: vi.fn(() => vi.fn()),
}));

describe('RefreshJwtStrategy', () => {
  const mockEnv: Partial<EnvSchemaType> = {
    SECRET: faker.string.alphanumeric({ length: 10 }),
  };

  const mockConfigService = createMockConfigService(mockEnv);
  let mockRefreshJwtFromRequest: Mock<typeof refreshJwtFromRequest>;

  let strategy: RefreshJwtStrategy;
  let configService: Mocked<ConfigService>;
  let authService: Mocked<AuthService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefreshJwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get(RefreshJwtStrategy);
    configService = module.get(ConfigService);
    authService = module.get(AuthService);
    mockRefreshJwtFromRequest = refreshJwtFromRequest as Mock<
      typeof refreshJwtFromRequest
    >;
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should create a Strategy instance', () => {
    expect(Strategy).toHaveBeenCalledWith(
      expect.objectContaining({
        secretOrKey: Buffer.from(mockEnv.SECRET!),
      }),
      expect.any(Function),
    );
  });

  it('should return user when payload is valid', async () => {
    const req = {} as Request;
    const token = faker.string.alphanumeric({ length: 10 });
    const mockExpressUser = createMockExpressUser();
    mockRefreshJwtFromRequest.mockReturnValueOnce(token);
    authService.validateRefreshJwt.mockResolvedValue(mockExpressUser);
    const res = await strategy.validate(req);
    expect(refreshJwtFromRequest).toHaveBeenCalledWith(req);
    expect(authService.validateRefreshJwt).toHaveBeenCalledWith(token);
    expect(res).toEqual(mockExpressUser);
  });

  it('should throw UnauthorizedException when request has no token', async () => {
    const req = {} as Request;
    mockRefreshJwtFromRequest.mockReturnValueOnce(null);
    await expect(strategy.validate(req)).rejects.toThrow(UnauthorizedException);
    expect(refreshJwtFromRequest).toHaveBeenCalledWith(req);
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    const req = {} as Request;
    const token = faker.string.alphanumeric({ length: 10 });
    mockRefreshJwtFromRequest.mockReturnValueOnce(token);
    authService.validateRefreshJwt.mockResolvedValue(null);
    await expect(strategy.validate(req)).rejects.toThrow(UnauthorizedException);
    expect(refreshJwtFromRequest).toHaveBeenCalledWith(req);
  });
});

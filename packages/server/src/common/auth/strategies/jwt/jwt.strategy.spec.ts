import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Strategy } from 'passport-jwt';
import { Mocked } from 'vitest';
import { createMockConfigService } from '../../../config/__mocks__/config.service.mock';
import { EnvSchemaType } from '../../../config/env';
import { mockAuthService } from '../../__mocks__/auth.service.mock';
import {
  createMockExpressUser,
  createMockJwtPayload,
} from '../../__mocks__/auth.type.mock';
import { AuthService } from '../../auth.service';
import { JwtStrategy } from './jwt.strategy';

vi.mock('passport-jwt');

describe('JwtStrategy', () => {
  const mockEnv: Partial<EnvSchemaType> = {
    SECRET: faker.string.alphanumeric({ length: 10 }),
  };

  const mockConfigService = createMockConfigService(mockEnv);

  let strategy: JwtStrategy;
  let configService: Mocked<ConfigService>;
  let authService: Mocked<AuthService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
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

    strategy = module.get(JwtStrategy);
    configService = module.get(ConfigService);
    authService = module.get(AuthService);
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
    const payload = createMockJwtPayload();
    const mockExpressUser = createMockExpressUser();
    authService.validateJwt.mockResolvedValue(mockExpressUser);
    const res = await strategy.validate(payload);
    expect(authService.validateJwt).toHaveBeenCalledWith(payload);
    expect(res).toEqual(mockExpressUser);
  });

  it('should throw UnauthorizedException when payload is invalid', async () => {
    const payload = createMockJwtPayload();
    authService.validateJwt.mockResolvedValue(null);
    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(authService.validateJwt).toHaveBeenCalledWith(payload);
  });
});

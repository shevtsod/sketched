import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { generate } from 'generate-password';
import { Mocked } from 'vitest';
import { createMockAccount } from '../../../../resources/accounts/entities/__mocks__/account.entity.mock';
import { createMockUser } from '../../../../resources/users/entities/__mocks__/user.entity.mock';
import { mockAuthService } from '../../__mocks__/auth.service.mock';
import { createMockExpressUser } from '../../__mocks__/auth.type.mock';
import { AuthService } from '../../auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: Mocked<AuthService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get(LocalStrategy);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user when credentials are valid', async () => {
    const mockExpressUser = createMockExpressUser();
    const password = generate({
      length: 16,
      numbers: true,
      symbols: true,
      strict: true,
    });
    authService.validateLocal.mockResolvedValue(mockExpressUser);
    const res = await strategy.validate(mockExpressUser.username, password);
    expect(authService.validateLocal).toHaveBeenCalledWith(
      mockExpressUser.username,
      password,
    );
    expect(res).toEqual(mockExpressUser);
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    const mockUser = await createMockUser();
    const mockAccount = await createMockAccount();
    authService.validateLocal.mockResolvedValue(null);
    await expect(
      strategy.validate(mockUser.username, mockAccount.password!),
    ).rejects.toThrow(UnauthorizedException);
    expect(authService.validateLocal).toHaveBeenCalledWith(
      mockUser.username,
      mockAccount.password!,
    );
  });
});

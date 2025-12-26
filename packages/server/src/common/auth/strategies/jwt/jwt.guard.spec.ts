import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Mocked } from 'vitest';
import { IS_PUBLIC_KEY } from '../public/public.decorator';
import { JwtGuard } from './jwt.guard';

const spyCanActivate = vi.spyOn(AuthGuard('jwt').prototype, 'canActivate');

const mockReflector = {
  getAllAndOverride: vi.fn(),
};

describe('JwtGuard', () => {
  let guard: JwtGuard;
  let reflector: Mocked<Reflector>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get(JwtGuard);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should convert to GqlExecutionContext', () => {
    const req = {};
    vi.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => ({ req }),
    } as GqlExecutionContext);
    const context = {} as ExecutionContext;
    const res = guard.getRequest(context);
    expect(GqlExecutionContext.create).toHaveBeenCalledWith(context);
    expect(res).toBe(req);
  });

  it('canActivate should return true for public routes', async () => {
    const mockContext = {
      getHandler: () => {},
      getClass: () => {},
    } as ExecutionContext;
    reflector.getAllAndOverride.mockReturnValueOnce(true);
    const res = await guard.canActivate(mockContext);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      mockContext.getHandler(),
      mockContext.getClass(),
    ]);
    expect(spyCanActivate).not.toHaveBeenCalled();
    expect(res).toBe(true);
  });

  it('canActivate should call super.canActivate for protected routes', async () => {
    const mockContext = {
      getHandler: () => {},
      getClass: () => {},
    } as ExecutionContext;
    spyCanActivate.mockReturnValueOnce(true);
    const res = await guard.canActivate(mockContext);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      mockContext.getHandler(),
      mockContext.getClass(),
    ]);
    expect(spyCanActivate).toHaveBeenCalledWith(mockContext);
    expect(res).toBe(true);
  });
});

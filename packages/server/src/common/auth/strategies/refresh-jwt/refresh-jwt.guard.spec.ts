import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshJwtGuard } from './refresh-jwt.guard';

const spyCanActivate = vi.spyOn(
  AuthGuard('refresh-jwt').prototype,
  'canActivate',
);

describe('RefreshJwtGuard', () => {
  let guard: RefreshJwtGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshJwtGuard],
    }).compile();

    guard = module.get(RefreshJwtGuard);
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

  it('canActivate should call super.canActivate', async () => {
    const mockContext = {} as ExecutionContext;
    spyCanActivate.mockReturnValueOnce(true);
    const res = await guard.canActivate(mockContext);
    expect(spyCanActivate).toHaveBeenCalled();
    expect(res).toBe(true);
  });
});

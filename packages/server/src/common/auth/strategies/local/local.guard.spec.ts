import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalGuard } from './local.guard';

const spyCanActivate = vi.spyOn(AuthGuard('local').prototype, 'canActivate');

describe('LocalGuard', () => {
  let guard: LocalGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalGuard],
    }).compile();

    guard = module.get(LocalGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('canActivate should call super.canActivate', async () => {
    const mockContext = {} as ExecutionContext;
    spyCanActivate.mockReturnValueOnce(true);
    const res = await guard.canActivate(mockContext);
    expect(spyCanActivate).toHaveBeenCalled();
    expect(res).toBe(true);
  });
});

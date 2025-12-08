import { AppModule } from './app.module';
import { CliModule } from './cli/cli.module';
import { createLogger } from './common/config/logger';

vi.mock('./common/config/logger.js');

describe('AppModule', () => {
  it('should register', () => {
    const module = AppModule.register();

    expect(module).toBeDefined();
    // does not import CliModule
    expect(module.imports?.find((p) => p === CliModule)).not.toBeDefined();
    // uses asynchronous logger
    expect(createLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        sync: false,
      }),
    );
  });

  it('should register with cli', () => {
    const module = AppModule.register({ cli: true });

    expect(module).toBeDefined();
    // imports CliModule
    expect(module.imports?.find((p) => p === CliModule)).toBeDefined();
    // uses synchronous logger
    expect(createLogger).toHaveBeenCalledWith(
      expect.objectContaining({
        sync: true,
      }),
    );
  });
});

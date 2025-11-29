import { AppModule } from './app.module';
import { CliModule } from './cli/cli.module';
import { createLogger } from './config/logger';

jest.mock('./config/logger');

describe('AppModule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers', () => {
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

  it('registers with cli', () => {
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

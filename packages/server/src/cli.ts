import { CommandFactory } from 'nest-commander';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { env } from './common/config/env';

async function bootstrap() {
  // https://docs.nestjs.com/recipes/nest-commander
  const app = await CommandFactory.createWithoutRunning(
    AppModule.register({ cli: true }),
  );

  // NOTE: some customizations in main.ts not supported for CommandFactory app

  // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.enableShutdownHooks();

  //https://github.com/iamolegga/nestjs-pino
  const logger = app.get(Logger);
  app.useLogger(logger);

  logger.log({
    msg: 'Sketched Server CLI',
    environment: env.NODE_ENV,
    version: env.VERSION,
  });

  await CommandFactory.runApplication(app);
}

void bootstrap();

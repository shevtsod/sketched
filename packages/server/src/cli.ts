import { CommandFactory } from 'nest-commander';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  // https://docs.nestjs.com/recipes/nest-commander
  const app = await CommandFactory.createWithoutRunning(
    AppModule.register({ cli: true }),
  );

  // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.enableShutdownHooks();

  //https://github.com/iamolegga/nestjs-pino
  const logger = app.get(Logger);
  app.useLogger(logger);

  logger.log(`Sketched Server ${env.VERSION} (${env.NODE_ENV}) CLI`);

  await CommandFactory.runApplication(app);
}

void bootstrap();

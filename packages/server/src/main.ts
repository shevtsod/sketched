import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  // https://docs.nestjs.com/first-steps
  const app = await NestFactory.create(AppModule.register(), {
    bufferLogs: true,
  });

  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix(env.BASE_PATH);

  // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.enableShutdownHooks();

  //https://github.com/iamolegga/nestjs-pino
  const logger = app.get(Logger);
  app.useLogger(logger);

  await app.listen(env.PORT);

  const url = new URL(`http://${env.HOST}:${env.PORT}/${env.BASE_PATH}`);
  logger.log(
    `Sketched Server ${env.VERSION} (${env.NODE_ENV}) listening at ${url}`,
  );
}

void bootstrap();

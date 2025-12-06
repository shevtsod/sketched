import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { env } from './common/config/env';

async function bootstrap() {
  // https://docs.nestjs.com/first-steps
  const app = await NestFactory.create(AppModule.register(), {
    bufferLogs: true,
  });

  // https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(
    new ValidationPipe({
      // transform objects to DTO instances
      transform: true,
    }),
  );

  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix(env.BASE_PATH);

  // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.enableShutdownHooks();

  //https://github.com/iamolegga/nestjs-pino
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(env.PORT);

  const url = new URL(`http://${env.HOST}:${env.PORT}/${env.BASE_PATH}`);

  logger.log({
    msg: 'Sketched Server',
    environment: env.NODE_ENV,
    version: env.VERSION,
    url,
    graphqlUrl: `${url}/graphql`,
  });
}

void bootstrap();

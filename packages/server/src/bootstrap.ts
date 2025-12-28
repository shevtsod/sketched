import {
  ClassSerializerInterceptor,
  INestApplication,
  INestApplicationContext,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { CommandFactory } from 'nest-commander';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { env } from './common/config/env';

/**
 * Bootstraps a NestJS app by setting global options and registering
 * interceptors, pipes, etc.
 *
 * @param app NestJS app
 * @returns bootstrapped NestJS app
 */
export async function bootstrap(app?: INestApplication) {
  // https://docs.nestjs.com/first-steps
  if (!app) {
    app = await NestFactory.create(AppModule.register(), { bufferLogs: true });
  }

  // https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(
    new ValidationPipe({
      // transform objects to DTO instances
      transform: true,
      // remove properties without validators
      whitelist: true,
    }),
  );

  // https://docs.nestjs.com/techniques/serialization#serialization
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix(env.BASE_PATH);

  // https://docs.nestjs.com/techniques/versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.enableShutdownHooks();

  //https://github.com/iamolegga/nestjs-pino
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // https://docs.nestjs.com/techniques/cookies
  app.use(cookieParser());

  // get original IP behind reverse proxy
  // https://expressjs.com/en/guide/behind-proxies.html
  (app as NestExpressApplication).set('trust proxy', true);

  return app;
}

/**
 * Bootstraps a NestJS app by setting global options and registering
 * interceptors, pipes, etc.
 *
 * @param app NestJS app
 * @returns bootstrapped NestJS app
 */
export async function bootstrapCli(app?: INestApplicationContext) {
  // https://docs.nestjs.com/recipes/nest-commander
  if (!app) {
    app = await CommandFactory.createWithoutRunning(
      AppModule.register({ cli: true }),
    );
  }

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

  return app;
}

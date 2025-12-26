import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { env } from './common/config/env';

async function bootstrap() {
  // https://docs.nestjs.com/first-steps
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(),
    {
      bufferLogs: true,
    },
  );

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
  app.set('trust proxy', true);

  await app.listen(env.PORT);

  const url = new URL(`http://${env.HOST}:${env.PORT}/${env.BASE_PATH}`);

  logger.log({
    msg: 'Sketched Server',
    environment: env.NODE_ENV,
    version: env.VERSION,
    url,
    graphqlUrl: `${url}graphql`,
  });
}

void bootstrap();

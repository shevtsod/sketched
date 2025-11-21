import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.enableShutdownHooks();

  //https://github.com/iamolegga/nestjs-pino
  app.useLogger(app.get(Logger));

  await app.listen(env.PORT);
}

void bootstrap();

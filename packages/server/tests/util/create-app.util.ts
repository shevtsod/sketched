import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { bootstrap } from '../../src/bootstrap';

export async function createApp(): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule.register()],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await bootstrap(app);
  return app.init();
}

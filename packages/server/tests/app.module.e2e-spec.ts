import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createApp } from './util/create-app.util';

describe('(e2e) AppModule', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createApp();
  });

  it('GET /', async () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });
});

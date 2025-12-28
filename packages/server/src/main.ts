import { Logger } from 'nestjs-pino';
import { bootstrap } from './bootstrap';
import { env } from './common/config/env';

async function run() {
  const app = await bootstrap();
  const logger = app.get(Logger);
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

void run();

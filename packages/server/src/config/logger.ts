import pino from 'pino';
import { pinoHttp } from 'pino-http';
import { env } from './env';

const { LOG_LEVEL, NODE_ENV } = env;

// https://github.com/pinojs/pino/blob/main/docs/transports.md
const transports: pino.TransportSingleOptions[] = [];

// https://github.com/pinojs/pino-pretty
if (NODE_ENV === 'development') {
  transports.push({
    target: 'pino-pretty',
    options: { colorize: true },
  });
}

// https://github.com/pinojs/pino
export const logger = pino({
  level: LOG_LEVEL,
  transport: {
    targets: transports,
  },
});

// https://github.com/pinojs/pino-http
export const httpLogger = pinoHttp({
  logger,
});

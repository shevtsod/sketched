import { IncomingMessage, ServerResponse } from 'http';
import pino from 'pino';
import { Options, pinoHttp } from 'pino-http';
import pinoPretty from 'pino-pretty';
import { env } from './env';

const { LOG_LEVEL, NODE_ENV } = env;

interface LoggerOptions {
  sync?: boolean;
}

/**
 * Creates a new logger instance with the given option overrides
 *
 * @returns logger instance
 */
export function createLogger(options?: LoggerOptions) {
  const streams: pino.StreamEntry[] = [];

  // https://github.com/pinojs/pino-pretty
  streams.push({
    level: LOG_LEVEL,
    stream:
      NODE_ENV === 'development'
        ? pinoPretty({
            colorize: true,
            ...options,
          })
        : pino.destination({
            ...options,
          }),
  });

  // https://github.com/pinojs/pino
  return pino(
    {
      level: LOG_LEVEL,
      ...options,
    },
    pino.multistream(streams),
  );
}

/**
 * Creates a new HTTP logger instance with the given option overrides
 *
 * @returns logger instance
 */
export function createHttpLogger(
  opts?: Options<IncomingMessage, ServerResponse<IncomingMessage>, never>,
  stream?: pino.DestinationStream,
) {
  // https://github.com/pinojs/pino-http
  return pinoHttp(opts, stream);
}

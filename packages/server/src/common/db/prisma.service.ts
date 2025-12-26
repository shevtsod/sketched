import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { PrismaClient } from './generated/prisma/client';

// https://www.prisma.io/docs/guides/nestjs
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @InjectPinoLogger(PrismaService.name)
    private readonly logger: PinoLogger,
    private readonly config: ConfigService,
  ) {
    const adapter = new PrismaPg({
      connectionString: config.get<string>('DATABASE_URL'),
    });

    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });

    // https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/
    this.$on('query' as never, (event) => this.logger.debug({ event }));
    this.$on('info' as never, (event) => this.logger.info({ event }));
    this.$on('warn' as never, (event) => this.logger.warn({ event }));
    this.$on('error' as never, (event) => this.logger.error({ event }));
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

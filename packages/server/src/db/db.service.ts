import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DbType, drizzleConfig } from '../config/db';

@Injectable()
export class DbService implements OnModuleDestroy {
  private pool: Pool;
  readonly db: DbType;

  constructor(private readonly configService: ConfigService) {
    // https://github.com/brianc/node-postgres
    this.pool = new Pool({
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      database: configService.get<string>('DB_NAME'),
      user: configService.get<string>('DB_USER'),
      password: configService.get<string>('DB_PASSWORD'),
      ssl: !['development', 'test'].includes(
        configService.get<string>('NODE_ENV')!,
      ),
    });

    this.db = drizzle(this.pool, drizzleConfig);
  }

  async onModuleDestroy() {
    // Close database connection
    await this.pool.end();
  }
}

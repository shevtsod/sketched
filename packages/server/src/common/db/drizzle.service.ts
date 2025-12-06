import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DrizzleConfig } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from '.';

// https://orm.drizzle.team/docs/connect-overview
const config: DrizzleConfig<typeof schema> = {
  schema,
  casing: 'snake_case',
};

@Injectable()
export class DrizzleService {
  private readonly pool: Pool;
  readonly db: NodePgDatabase<typeof schema>;

  constructor(private readonly configService: ConfigService) {
    // https://github.com/brianc/node-postgres
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      database: this.configService.get<string>('DB_NAME'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      ssl: !this.configService.get<boolean>('isDevOrTest')!,
    });

    this.db = drizzle(this.pool, config);
  }

  // https://docs.nestjs.com/fundamentals/lifecycle-events
  async onModuleDestroy() {
    // Close database connection
    await this.pool.end();
  }
}

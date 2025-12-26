import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './common/auth/auth.module';
import { JwtGuard } from './common/auth/strategies/jwt/jwt.guard';
import { CliModule } from './common/cli/cli.module';
import { getEnv } from './common/config/env';
import { createHttpLogger, createLogger } from './common/config/logger';
import { GraphQLModule } from './common/graphql/graphql.module';
import { ResourcesModule } from './resources/resources.module';

export interface AppModuleOptions {
  /** Whether the app is running in CLI mode (should CLI commands be registered) */
  cli: boolean;
}

@Module({})
export class AppModule {
  // https://docs.nestjs.com/fundamentals/dynamic-modules
  static register(
    { cli = false }: AppModuleOptions = { cli: false },
  ): DynamicModule {
    const dynamicImports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];

    // Register CLI commands
    // https://docs.nestjs.com/recipes/nest-commander
    if (cli) dynamicImports.push(CliModule);

    return {
      module: AppModule,
      imports: [
        // https://docs.nestjs.com/techniques/configuration
        ConfigModule.forRoot({ validate: getEnv }),
        // https://docs.nestjs.com/techniques/logger
        LoggerModule.forRoot({
          pinoHttp: createHttpLogger({
            // use synchronous logger in CLI (so prompts appear in order)
            logger: createLogger({ sync: cli }),
          }),
        }),
        // Authentication
        AuthModule,
        // GraphQL API
        // https://docs.nestjs.com/graphql/quick-start
        GraphQLModule,
        // Application resources (users, etc.)
        ResourcesModule,
        // Conditionally-imported modules
        ...dynamicImports,
      ],
      providers: [
        // add JwtAuthGuard globally
        // https://docs.nestjs.com/recipes/passport
        {
          provide: APP_GUARD,
          useClass: JwtGuard,
        },
      ],
    };
  }
}

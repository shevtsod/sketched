import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { CliModule } from './cli/cli.module';
import { getEnv } from './config/env';
import { createHttpLogger, createLogger } from './config/logger';
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
        // https://docs.nestjs.com/graphql/quick-start
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
          driver: ApolloDriver,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            playground: false,
            graphiql: configService.get<boolean>('isDevOrTest')
              ? { url: `graphql` }
              : false,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            // https://docs.nestjs.com/graphql/subscriptions
            subscriptions: {
              'graphql-ws': true,
            },
            useGlobalPrefix: true,
          }),
        }),
        // Application resources (users, etc.)
        ResourcesModule,
        // Conditionally-imported modules
        ...dynamicImports,
      ],
    };
  }
}

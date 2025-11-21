import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config/env';
import { httpLogger } from './config/logger';
import { DbModule } from './db/db.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({ validate }),
    // https://docs.nestjs.com/techniques/logger
    LoggerModule.forRoot({ pinoHttp: httpLogger }),
    // SQL database module
    DbModule,
    // https://docs.nestjs.com/graphql/quick-start
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: false,
        graphiql: configService.get<string>('NODE_ENV') === 'development',
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        // https://docs.nestjs.com/graphql/subscriptions
        subscriptions: {
          'graphql-ws': true,
        },
      }),
    }),
    // Application resources (users, etc.)
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { GraphQLModule as NestJsGraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    // https://docs.nestjs.com/graphql/quick-start
    NestJsGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: false,
        graphiql: configService.get<boolean>('isDevOrTest')
          ? { url: `graphql` }
          : false,
        autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
        // https://docs.nestjs.com/graphql/subscriptions
        subscriptions: {
          'graphql-ws': true,
        },
        useGlobalPrefix: true,
      }),
    }),
  ],
})
export class GraphQLModule {}

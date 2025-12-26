import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { resolveInfoToPrismaArgs } from './prisma-args.util';

export const PrismaArgs = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return resolveInfoToPrismaArgs(ctx.getInfo());
  },
);

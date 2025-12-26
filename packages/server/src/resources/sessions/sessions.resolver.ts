import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { PrismaArgs } from '../../common/graphql/prisma-args/prisma-args.decorator';
import type { PrismaArgsType } from '../../common/graphql/prisma-args/prisma-args.util';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateSessionInput } from './dto/create-session.input';
import { FindSessionInput } from './dto/find-session.input';
import { FindSessionsInput } from './dto/find-sessions.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { Session } from './entities/session.entity';
import { SessionConnection } from './sessions.connection';
import { SessionsService } from './sessions.service';

@Resolver(() => Session)
export class SessionsResolver {
  constructor(
    private readonly sesionsService: SessionsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Session)
  async createSession(
    @Args() createSessionInput: CreateSessionInput,
  ): Promise<Session> {
    const res = await this.sesionsService.create({ data: createSessionInput });
    return plainToInstance(Session, res[0]);
  }

  @Query(() => Session)
  async session(
    @Args() findSessionInput: FindSessionInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<Session | null> {
    const res = await this.sesionsService.findUnique({
      where: findSessionInput,
      ...prismaArgs,
    });
    return plainToInstance(Session, res);
  }

  @Query(() => SessionConnection)
  sessions(
    @Args() findSessionsInput: FindSessionsInput,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<SessionConnection> {
    const { first, after, last, before, ...input } = findSessionsInput;
    return this.sesionsService.paginate(
      { first, after, last, before },
      { where: input, ...prismaArgs },
      { transformClass: Session },
    );
  }

  @Mutation(() => Session)
  async updateSession(
    @Args()
    { id, ...updateSessionInput }: UpdateSessionInput,
  ): Promise<Session> {
    const res = await this.sesionsService.update({
      where: { id },
      data: updateSessionInput,
    });
    return plainToInstance(Session, res[0]);
  }

  @Mutation(() => Session)
  async deleteSession(
    @Args() findSessionInput: FindSessionInput,
  ): Promise<Session> {
    const res = await this.sesionsService.delete({ where: findSessionInput });
    return plainToInstance(Session, res[0]);
  }

  @ResolveField(() => User)
  async user(
    @Parent() session: Session,
    @PrismaArgs() prismaArgs: PrismaArgsType,
  ): Promise<User | null> {
    const res = await this.usersService.findOne({
      where: { sessions: { some: { id: session.id } } },
      ...prismaArgs,
    });
    return plainToInstance(User, res);
  }
}
